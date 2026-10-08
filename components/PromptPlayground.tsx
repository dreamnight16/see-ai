"use client";

import { useState } from "react";
import { Wand2, Copy, Check, Code2, Play, Sparkles, Save, FolderOpen, AlertTriangle, Loader2 } from "lucide-react";
import CodeReview from "./playground/CodeReview";
import { saveProject } from "@/lib/projects";
import { emitGameEvent } from "@/lib/events";
import Link from "next/link";

/** 工具栏按钮：直角、≥44px、图标 + 文字，每条操作都自带名字。 */
const TOOL_BTN =
  "dn-focus inline-flex min-h-[44px] items-center gap-1.5 px-3 text-xs transition-colors";
const TOOL_IDLE = "text-text-secondary hover:bg-surface-alt hover:text-text-primary";

export default function PromptPlayground() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setCode("");
    setError("");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `把下面的想法做成一个打开就能运行的 HTML 文件。先把结构和交互做对，再用清楚的排版和克制的颜色收尾。要求：
1. CSS 和 JavaScript 都写在文件里，不依赖外部文件
2. 关键逻辑加简短中文注释，方便初学者读懂
3. 保持页面清楚、轻快，不堆装饰性渐变
4. 只返回代码，不要附加说明

描述：${prompt}`,
            },
          ],
        }),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({} as { error?: string }));
        throw new Error(payload.error || "这次没有接上模型服务");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullCode = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullCode += decoder.decode(value, { stream: true });
        setCode(fullCode);
      }

      // Fire playground event for gamification
      emitGameEvent({ type: 'playground:generated' });
    } catch (err) {
      setError(err instanceof Error ? err.message : "这次没有接上模型服务");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!cleanCode) return;
    saveProject({
      title: prompt.slice(0, 30) || '未命名作品',
      description: prompt.slice(0, 200),
      code: cleanCode,
      tags: [],
    });
    setSaved(true);
    emitGameEvent({ type: 'playground:generated' });
    setTimeout(() => setSaved(false), 3000);
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const cleanCode = code
    .replace(/```html/g, "")
    .replace(/```/g, "")
    .trim();

  return (
    <div className="card flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-edge bg-surface-alt px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-teal text-on-color">
          <Wand2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-semibold">网页小工坊</span>
          <span className="text-[11px] text-text-secondary">把想法做出来</span>
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 space-y-3 border-b border-edge p-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想要做的网页，比如：帮我做一个带有倒计时功能的番茄钟..."
          aria-label="描述你想要做的网页"
          className="dn-focus h-28 w-full resize-none border border-edge-strong bg-surface-alt px-4 py-3.5 text-sm placeholder:text-text-secondary focus:bg-surface"
        />
        {/* 示例词放在输入框下方而不是压在 placeholder 上：
            这样每个都能拿到 44px 的触控高度，也不会和提示文字叠在一起。 */}
        {!prompt.trim() && (
          <div className="flex flex-wrap gap-1.5">
            {["番茄钟", "个人主页", "计算器", "待办清单"].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setPrompt(`帮我做一个${example}`)}
                className="dn-focus inline-flex min-h-[44px] items-center border border-edge-strong bg-surface px-3 text-xs text-text-secondary transition-colors hover:border-teal hover:text-teal-ink"
              >
                &quot;{example}&quot;
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-text-secondary">说清楚页面要做什么，结果会更接近你的想法</span>
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="dn-focus dn-interactive inline-flex min-h-[44px] items-center gap-2 bg-teal px-5 text-sm font-semibold text-on-color disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                生成中...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden="true" />
                生成代码
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2.5 border-b border-edge bg-amber-tint px-4 py-3 text-sm text-text-primary">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-ink" aria-hidden="true" />
          <span>{error} 课程和练习不需要模型，可以先继续学习。</span>
        </div>
      )}

      {/* Code output */}
      {cleanCode && (
        <div className="flex min-h-[200px] flex-1 flex-col">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-edge bg-surface-alt px-4 py-1.5">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Code2 className="h-4 w-4" aria-hidden="true" />
              生成的代码
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {/* Preview button */}
              <button
                onClick={() => {
                  const blob = new Blob([cleanCode], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}
                className={`${TOOL_BTN} ${TOOL_IDLE}`}
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                预览
              </button>
              <button
                onClick={handleSave}
                className={`${TOOL_BTN} ${saved ? 'text-emerald-ink' : TOOL_IDLE}`}
              >
                {saved ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Save className="h-4 w-4" aria-hidden="true" />
                )}
                {saved ? '已保存' : '保存'}
              </button>
              <Link href="/showcase" className={`${TOOL_BTN} ${TOOL_IDLE}`}>
                <FolderOpen className="h-4 w-4" aria-hidden="true" />
                作品集
              </Link>
              <button
                onClick={() => setShowReview(!showReview)}
                aria-expanded={showReview}
                className={`${TOOL_BTN} ${showReview ? 'text-teal-ink' : TOOL_IDLE}`}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                请助手看一眼
              </button>
              <button
                onClick={copyCode}
                className={`${TOOL_BTN} ${TOOL_IDLE}`}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-ink" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? "已复制" : "复制"}
              </button>
            </div>
          </div>
          <pre className="see-code flex-1 overflow-auto p-5 font-mono text-sm leading-relaxed selection:bg-teal selection:text-on-color">
            <code>{cleanCode}</code>
          </pre>
        </div>
      )}

      {/* Code Review */}
      {showReview && cleanCode && (
        <div className="border-t border-edge p-4">
          <CodeReview code={cleanCode} onClose={() => setShowReview(false)} />
        </div>
      )}
    </div>
  );
}
