"use client";

import { useState } from "react";
import { Wand2, Copy, Check, Code2, Play, Sparkles, Save, FolderOpen, AlertTriangle } from "lucide-react";
import CodeReview from "./playground/CodeReview";
import { saveProject } from "@/lib/projects";
import { emitGameEvent } from "@/lib/events";
import Link from "next/link";

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
    <div className="flex flex-col h-full rounded-xl border border-edge bg-surface overflow-hidden shadow-md">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-edge bg-surface-alt flex items-center gap-2.5 shrink-0">
        <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
          <Wand2 className="w-4 h-4 text-accent" />
        </span>
        <div>
          <span className="font-semibold text-sm">网页小工坊</span>
          <span className="text-[10px] text-muted ml-2">把想法做出来</span>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 space-y-3 shrink-0 border-b border-edge/50">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要做的网页，比如：帮我做一个带有倒计时功能的番茄钟..."
            className="w-full h-28 px-4 py-3.5 rounded-xl border border-edge bg-surface-alt text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 focus:bg-surface transition-all placeholder:text-faint"
          />
          {!prompt.trim() && (
            <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">
              {["番茄钟", "个人主页", "计算器", "待办清单"].map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(`帮我做一个${example}`)}
                  className="text-[10px] px-2 py-1 rounded-md bg-surface border border-edge text-muted hover:text-accent hover:border-accent/30 transition-colors"
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-faint">说清楚页面要做什么，结果会更接近你的想法</span>
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                生成代码
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2.5 px-4 py-3 text-sm text-warning bg-warning-soft border-b border-warning/10">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error} 课程和练习不需要模型，可以先继续学习。</span>
        </div>
      )}

      {/* Code output */}
      {cleanCode && (
        <div className="flex-1 min-h-[200px] flex flex-col animate-scale-in">
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-alt border-b border-edge shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Code2 className="w-3.5 h-3.5" />
              生成的代码
            </div>
            <div className="flex items-center gap-3">
              {/* Preview button */}
              <button
                onClick={() => {
                  const blob = new Blob([cleanCode], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}
                className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
              >
                <Play className="w-3 h-3" />
                预览
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  saved ? 'text-success' : 'text-muted hover:text-accent'
                }`}
              >
                {saved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {saved ? '已保存' : '保存'}
              </button>
              <Link
                href="/showcase"
                className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
              >
                <FolderOpen className="w-3 h-3" />
                作品集
              </Link>
              <button
                onClick={() => setShowReview(!showReview)}
                className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                请助手看一眼
              </button>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? "已复制" : "复制"}
              </button>
            </div>
          </div>
          <pre className="flex-1 p-5 overflow-auto text-sm font-mono leading-relaxed bg-[#1e1b18] text-[#e8dcc8] selection:bg-accent/30">
            <code>{cleanCode}</code>
          </pre>
        </div>
      )}

      {/* Code Review */}
      {showReview && cleanCode && (
        <div className="p-4 border-t border-edge">
          <CodeReview code={cleanCode} onClose={() => setShowReview(false)} />
        </div>
      )}
    </div>
  );
}
