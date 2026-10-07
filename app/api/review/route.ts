import { NextRequest } from 'next/server';
import { getAiApiAccessError } from '@/lib/api-access';

const SYSTEM_REVIEW_PROMPT = `你是一个友善的代码审阅老师，帮零基础的人看代码。

请按以下格式回复（用中文）：

大白话解释：用 2-3 句最直白的话，说这段代码干了什么。要让完全不懂编程的人也能听懂。

做得好的地方：
- 列出 2-3 个优点

可以改进的地方：
- 列出 1-3 个改进建议，每个建议用最简单的话说清楚"改什么 + 怎么改"

注意：
- 语气要友善鼓励
- 不要用技术术语，非用不可时要括号解释
- 每个点一句话说清楚`;

const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count++;
  if (Math.random() < 0.01) {
    for (const [key, val] of rateMap) {
      if (now >= val.resetAt) rateMap.delete(key);
    }
  }
  return true;
}

const ALLOWED_HOSTNAMES = new Set([
  'api.deepseek.com',
  'api.openai.com',
  'api.anthropic.com',
]);

function validateBaseURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    return ALLOWED_HOSTNAMES.has(parsed.hostname);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Enforce the bearer token when configured, including browser requests.
  const accessError = getAiApiAccessError(req);
  if (accessError) return accessError;

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: '请求过于频繁，请稍后再试' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const provider = process.env.AI_PROVIDER || 'openai-compatible';
    const model = process.env.AI_MODEL || 'deepseek-chat';
    const apiKey = process.env.AI_API_KEY;
    const baseURL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI 代码审阅未配置。课程、练习和作品保存不受影响。' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (provider === 'openai-compatible' && !validateBaseURL(baseURL)) {
      return new Response(JSON.stringify({ error: 'AI_BASE_URL 不在允许列表中' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const code = body.code?.slice(0, 20000);
    if (!code || typeof code !== 'string') {
      return new Response(JSON.stringify({ error: 'code 参数缺失' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const reviewPrompt = `${SYSTEM_REVIEW_PROMPT}\n\n请审阅以下代码：\n\n\`\`\`html\n${code}\n\`\`\``;

    if (provider === 'openai-compatible' || provider === 'openai') {
      const openaiBaseURL = provider === 'openai' ? 'https://api.openai.com/v1' : baseURL;
      const url = openaiBaseURL.replace(/\/+$/, '') + '/chat/completions';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: reviewPrompt }],
            stream: false,
            max_tokens: 1024,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API 请求失败 (${response.status}): ${text.slice(0, 200)}`);
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return new Response(content, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Anthropic
    const { generateText } = await import('ai');
    const { createAnthropic } = await import('@ai-sdk/anthropic');
    const anthropic = createAnthropic({ apiKey });
    const languageModel = anthropic(model);
    const result = await generateText({
      model: languageModel,
      system: SYSTEM_REVIEW_PROMPT,
      prompt: `请审阅以下代码：\n\n\`\`\`html\n${code}\n\`\`\``,
      maxOutputTokens: 1024,
    });

    return new Response(result.text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Review API error:', error);
    if (error instanceof Error && error.name === "AbortError") {
      return new Response(JSON.stringify({ error: '审阅服务响应超时，请稍后重试' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: '审阅请求失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
