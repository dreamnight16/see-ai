import { NextRequest } from "next/server";
import { SYSTEM_PROMPT, SOCRATIC_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { getAiApiAccessError } from "@/lib/api-access";

// ---- 速率限制 ----
const RATE_WINDOW_MS = 60_000; // 1 分钟窗口
const MAX_REQUESTS_PER_WINDOW = 30;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    // Periodic cleanup when map is large
    if (rateMap.size > 10000) {
      for (const [key, val] of rateMap) {
        if (now >= val.resetAt) rateMap.delete(key);
      }
    }
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count++;
  // Periodic cleanup of stale entries
  if (Math.random() < 0.01) {
    for (const [key, val] of rateMap) {
      if (now >= val.resetAt) rateMap.delete(key);
    }
  }
  return true;
}

// ---- 允许的 baseURL 白名单（防 SSRF） ----
const ALLOWED_HOSTNAMES = new Set([
  "api.deepseek.com",
  "api.openai.com",
  "api.anthropic.com",
]);

function validateBaseURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_HOSTNAMES.has(parsed.hostname);
  } catch {
    return false;
  }
}

// ---- 消息验证 ----
const MAX_MESSAGES = 50;
const MAX_CONTENT_LENGTH = 8000;

function validateMessages(messages: unknown): {
  role: "user" | "assistant";
  content: string;
}[] {
  if (!Array.isArray(messages)) {
    throw new Error("messages 必须是数组");
  }
  if (messages.length > MAX_MESSAGES) {
    throw new Error(`消息数量不能超过 ${MAX_MESSAGES}`);
  }
  if (messages.length === 0) {
    throw new Error("消息不能为空");
  }
  return messages.slice(-MAX_MESSAGES).map((m, i) => {
    if (!m || typeof m !== "object") throw new Error(`消息[${i}]无效`);
    if (m.role !== "user" && m.role !== "assistant")
      throw new Error(`消息[${i}] role 无效`);
    if (typeof m.content !== "string")
      throw new Error(`消息[${i}] content 无效`);
    return {
      role: m.role,
      content: (m.content as string).slice(0, MAX_CONTENT_LENGTH),
    };
  });
}

// Direct fetch to OpenAI-compatible APIs
async function handleOpenAICompatible(
  apiKey: string,
  baseURL: string,
  model: string,
  messages: { role: string; content: string }[],
  systemPrompt: string,
) {
  const url = baseURL.replace(/\/+$/, "") + "/chat/completions";

  const body = JSON.stringify({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
    max_tokens: 4096,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API 请求失败 (${response.status}): ${text.slice(0, 200)}`,
    );
  }

  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // skip unparseable chunks
              }
            }
          }
        } catch (e) {
          console.error("Stream read error:", e);
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    },
  );
}

async function callAIService(
  provider: string,
  model: string,
  apiKey: string,
  baseURL: string,
  messages: { role: string; content: string }[],
  systemPrompt: string,
) {
  if (provider === "openai-compatible" || provider === "openai") {
    const url =
      provider === "openai" ? "https://api.openai.com/v1" : baseURL;
    return handleOpenAICompatible(apiKey, url, model, messages, systemPrompt);
  }

  const { streamText, createTextStreamResponse } = await import("ai");
  const { createAnthropic } = await import("@ai-sdk/anthropic");
  const anthropic = createAnthropic({ apiKey });
  const languageModel = anthropic(model);

  const result = streamText({
    model: languageModel,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    maxOutputTokens: 4096,
  });

  return createTextStreamResponse({
    textStream: result.textStream,
    headers: { "Cache-Control": "no-cache" },
  });
}

function getClientIP(req: NextRequest): string {
  // 仅当部署在可信反向代理之后（TRUST_PROXY=true，代理会覆盖/剥离转发头）时，
  // 才信任 x-forwarded-for / x-real-ip。直接暴露时这些头可被客户端伪造，不能用于
  // 限流；此时回退到 Next.js 从可信连接推导的 socket 地址（req.ip）。
  if (process.env.TRUST_PROXY === "true") {
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwarded) return forwarded;
    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp;
  }
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // CSRF is handled by middleware (Origin validation for POST/PUT/DELETE).
  // Enforce the bearer token when configured, including browser requests.
  const accessError = getAiApiAccessError(req);
  if (accessError) return accessError;

  const ip = getClientIP(req);
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "请求过于频繁，请稍后再试" }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  // Clone request so body can be re-read for fallback
  const reqClone = req.clone();

  const provider = process.env.AI_PROVIDER || "openai-compatible";
  const model = process.env.AI_MODEL || "deepseek-chat";
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL || "https://api.deepseek.com/v1";

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AI 助手未配置。课程、练习和进度功能不受影响。" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  if (provider === "openai-compatible" && !validateBaseURL(baseURL)) {
    return new Response(
      JSON.stringify({ error: "AI_BASE_URL 不在允许列表中" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = await req.json();
  const messages = validateMessages(body.messages);
  const mode = body.mode === 'socratic' ? 'socratic' : 'direct';
  const activePrompt = mode === 'socratic' ? SOCRATIC_SYSTEM_PROMPT : SYSTEM_PROMPT;

  try {
    return await callAIService(provider, model, apiKey, baseURL, messages, activePrompt);
  } catch (primaryError) {
    console.error("Primary AI provider error:", primaryError);

    const fallbackProvider = process.env.AI_FALLBACK_PROVIDER;
    const fallbackModel = process.env.AI_FALLBACK_MODEL;
    const fallbackApiKey = process.env.AI_FALLBACK_API_KEY;
    const fallbackBaseURL = process.env.AI_FALLBACK_BASE_URL;

    if (fallbackProvider && fallbackModel && fallbackApiKey) {
      try {
        const fallbackBody = await reqClone.json();
        const fallbackMessages = validateMessages(fallbackBody.messages);
        const fallbackMode = fallbackBody.mode === 'socratic' ? 'socratic' : 'direct';
        const fallbackPrompt = fallbackMode === 'socratic' ? SOCRATIC_SYSTEM_PROMPT : SYSTEM_PROMPT;

        if (fallbackProvider === "openai-compatible" && !validateBaseURL(fallbackBaseURL || "")) {
          throw new Error("Fallback baseURL not allowed");
        }

        console.error("Trying fallback AI provider...");
        return await callAIService(
          fallbackProvider,
          fallbackModel,
          fallbackApiKey,
          fallbackBaseURL || "https://api.deepseek.com/v1",
          fallbackMessages,
          fallbackPrompt,
        );
      } catch (fallbackError) {
        console.error("Fallback AI provider also failed:", fallbackError);
      }
    }

    if (primaryError instanceof Error && primaryError.name === "AbortError") {
      return new Response(
        JSON.stringify({ error: "AI 服务响应超时，请稍后重试" }),
        { status: 504, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify({ error: "请求处理失败" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
