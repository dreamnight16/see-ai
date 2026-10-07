"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import SocraticToggle from "./chat/SocraticToggle";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 bg-accent/40 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-accent/40 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-accent/40 rounded-full animate-bounce [animation-delay:300ms]" />
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
  const [socraticMode, setSocraticMode] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      localStorage.getItem('vibe-coding-socratic') === 'true',
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  // Persist socratic mode changes
  useEffect(() => {
    localStorage.setItem('vibe-coding-socratic', String(socraticMode));
  }, [socraticMode]);

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
    <div className="flex flex-col h-full rounded-xl border border-edge bg-surface overflow-hidden shadow-md">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-edge bg-surface-alt flex items-center gap-2.5 shrink-0">
        <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
          <Bot className="w-4 h-4 text-accent" />
        </span>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold text-sm">学习助手</span>
            <span className="text-[10px] text-muted ml-2">需要时再用</span>
          </div>
          <div className="mt-1">
            <SocraticToggle value={socraticMode} onChange={setSocraticMode} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="flex-1 overflow-y-auto p-5 space-y-5 min-h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--color-accent-soft)_0%,_transparent_70%)]"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ring-2 ring-offset-1 ${
                msg.role === "user"
                  ? "bg-accent text-white ring-accent/20 ring-offset-surface"
                  : "bg-surface-alt ring-edge ring-offset-surface"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4 text-accent" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-accent text-white rounded-tr-md"
                  : "bg-surface-alt border border-edge rounded-tl-md"
              }`}
            >
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
        className="p-4 border-t border-edge bg-surface-alt flex gap-2.5 shrink-0"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="说说你卡在哪里..."
          className="flex-1 px-4 py-3 rounded-xl border border-edge bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all placeholder:text-faint"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 transition-all"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
