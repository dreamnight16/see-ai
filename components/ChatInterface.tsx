"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import SocraticToggle from "./chat/SocraticToggle";
import { getRepository } from "@/lib/repository";

/** 「回答方式」偏好的存储键；0.1 起就在用这个键，不能改名 */
const SOCRATIC_KEY = "vibe-coding-socratic";

/**
 * 「回答方式」偏好是一个外部状态：它住在 localStorage 里，服务端读不到。
 *
 * 直接用 useState 初始化里读 localStorage 会 hydration 不匹配——
 * 服务端渲染「直接回答」，客户端首帧渲染「引导思考」，React 只能把整棵树
 * 丢回客户端重渲染（React #418），用户看到状态先闪一下再跳回去。
 *
 * 所以按 React 推荐的做法走 useSyncExternalStore：服务端快照写死成 false，
 * 首帧与服务端一致，水合完成后 React 自己会再读一次真实值并重渲染。
 * 也顺便不用在 effect 里同步 setState（那会触发级联渲染）。
 */
const socraticListeners = new Set<() => void>();

function subscribeSocratic(onStoreChange: () => void) {
  socraticListeners.add(onStoreChange);
  // 另一个标签页改了偏好，这边也跟着变
  window.addEventListener("storage", onStoreChange);
  return () => {
    socraticListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function readSocratic() {
  return getRepository().getItem(SOCRATIC_KEY) === "true";
}

function writeSocratic(next: boolean) {
  getRepository().setItem(SOCRATIC_KEY, String(next));
  socraticListeners.forEach((listener) => listener());
}

/** 服务端没有 localStorage：一律按默认的「直接回答」渲染 */
function serverSocratic() {
  return false;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * 等待回复时的三点指示。
 *
 * 直角方块而不是圆形小点：DNDL 默认几何，同时也和消息气泡的方角保持一致。
 * 三点本身只是装饰，所以另外补一段 sr-only 文字，让「正在等待」不只靠动效传达。
 */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="sr-only">正在输入</span>
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-teal-ink animate-bounce [animation-delay:0ms]" />
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-teal-ink animate-bounce [animation-delay:150ms]" />
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-teal-ink animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "你好，我是课程里的可选学习助手。正文、练习和进度都在这里，不需要我也能继续。\n\n卡住时，把具体的一段代码或一句话贴过来就好。我们可以一起拆概念、改描述，或者把一个小想法拆成几步来做。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const socraticMode = useSyncExternalStore(
    subscribeSocratic,
    readSocratic,
    serverSocratic,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (isNearBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          mode: socraticMode ? 'socratic' : 'direct',
        }),
      });

      if (!response.ok || !response.body) {
        const err = await response.json().catch(() => ({} as { error?: string }));
        throw new Error(err.error || "请求失败");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return next;
        });
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "这次没有接上学习助手。";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
            content: `${msg}\n\n没关系，课程正文、练习、测验和进度不会受影响。等服务恢复后再回来问就行。`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-edge bg-surface-alt px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-teal text-on-color">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold">学习助手</span>
            <span className="text-[11px] text-text-secondary">需要时再用</span>
          </div>
          <div className="mt-1.5">
            <SocraticToggle value={socraticMode} onChange={writeSocratic} />
          </div>
        </div>
      </div>

      {/* Messages：原来那层 radial-gradient 只是装饰，换成画布底色，
          让「用户 = 品牌实色块 / 助手 = 带描边的浅色块」这组对比自己说话。 */}
      <div
        ref={containerRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="min-h-[300px] flex-1 space-y-5 overflow-y-auto bg-canvas p-4 sm:p-5"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar：直角方块，不用圆形头像 */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                msg.role === "user"
                  ? "bg-teal text-on-color"
                  : "border border-edge bg-teal-tint text-teal-ink"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-teal text-on-color"
                  : "border border-edge bg-surface text-text-primary"
              }`}
            >
              {/* 头像图标是装饰性的，谁在说话要用文字说清楚 */}
              <span className="sr-only">{msg.role === "user" ? "你说：" : "助手说："}</span>
              {msg.content ||
                (loading && i === messages.length - 1 ? <TypingDots /> : null)}
            </div>
          </div>
        ))}
        <div />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 gap-2.5 border-t border-edge bg-surface-alt p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="说说你卡在哪里..."
          aria-label="给学习助手发消息"
          className="dn-focus min-h-[44px] min-w-0 flex-1 border border-edge-strong bg-surface px-4 text-sm placeholder:text-text-secondary"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="发送"
          className="dn-focus dn-interactive flex h-11 w-11 shrink-0 items-center justify-center bg-teal text-on-color disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </form>
    </div>
  );
}
