'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

const DEMO_PROMPT = '帮我做一个番茄钟';
const DEMO_TOKENS = [
  '<!DOCTYPE', ' html', '>', '\n',
  '<html', ' lang="zh-CN"', '>', '\n',
  '<head', '>', '\n',
  '  <meta', ' charset="UTF-8"', '>', '\n',
  '  <title', '>番茄钟</title', '>', '\n',
  '  <style', '>', '\n',
  '    body', ' { ', 'font-family', ': system-ui', '; ', 'text-align', ': center', '; ', 'padding', ': 40px', '; }', '\n',
  '    .timer', ' { ', 'font-size', ': 72px', '; ', 'font-weight', ': bold', '; ', 'margin', ': 20px 0', '; }', '\n',
  '    button', ' { ', 'padding', ': 12px 24px', '; ', 'margin', ': 4px', '; ', 'border', ': none', '; ', 'border-radius', ': 8px', '; ', 'cursor', ': pointer', '; }', '\n',
  '    .start', ' { ', 'background', ': #e85d3a', '; ', 'color', ': white', '; }', '\n',
  '    .reset', ' { ', 'background', ': #e0d8cc', '; }', '\n',
  '  </style', '>', '\n',
  '</head', '>', '\n',
  '<body', '>', '\n',
  '  <h1', '>🍅 番茄钟</h1', '>', '\n',
  '  <div', ' class="timer"', ' id="display"', '>25:00</div', '>', '\n',
  '  <button', ' class="start"', ' onclick="startTimer()"', '>开始</button', '>', '\n',
  '  <button', ' class="reset"', ' onclick="resetTimer()"', '>重置</button', '>', '\n',
  '  <script', '>', '\n',
  '    let', ' timeLeft', ' = ', '25', ' * ', '60', ';', '\n',
  '    let', ' interval', ';', '\n',
  '    function', ' startTimer', '() {', '\n',
  '      interval', ' = ', 'setInterval', '(()', ' => {', '\n',
  '        timeLeft', '--;', '\n',
  '        updateDisplay', '();', '\n',
  '        if', ' (', 'timeLeft', ' <= ', '0', ') ', 'clearInterval', '(interval);', '\n',
  '      },', ' ', '1000', ');', '\n',
  '    }', '\n',
  '    function', ' resetTimer', '() {', '\n',
  '      clearInterval', '(interval);', '\n',
  '      timeLeft', ' = ', '25', ' * ', '60', ';', '\n',
  '      updateDisplay', '();', '\n',
  '    }', '\n',
  '    function', ' updateDisplay', '() {', '\n',
  '      const', ' m', ' = ', 'Math', '.', 'floor', '(timeLeft', ' / ', '60', ');', '\n',
  '      const', ' s', ' = ', 'timeLeft', ' % ', '60', ';', '\n',
  '      document', '.', 'getElementById', "('display')", '.', 'textContent', ' = ',
  '        ', '`', '${m', '}:${', 'String', '(s)', '.', 'padStart', '(2,', " '0')", '}`', ';', '\n',
  '    }', '\n',
  '  </script', '>', '\n',
  '</body', '>', '\n',
  '</html', '>',
];

export default function TokenStream() {
  const [displayTokens, setDisplayTokens] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (running && indexRef.current < DEMO_TOKENS.length) {
      timerRef.current = setInterval(() => {
        if (indexRef.current < DEMO_TOKENS.length) {
          setDisplayTokens(DEMO_TOKENS.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          setRunning(false);
          setDone(true);
          clearInterval(timerRef.current);
        }
      }, 40);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  function toggle() {
    if (done) {
      reset();
      return;
    }
    setRunning(!running);
  }

  function reset() {
    setRunning(false);
    setDone(false);
    indexRef.current = 0;
    setDisplayTokens([]);
  }

  const displayCode = displayTokens.join('');

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </span>
          <div>
            <h3 className="font-display font-bold text-base">代码是怎样一步步写出来的</h3>
            <p className="text-[10px] text-muted">看一段话怎样被拆成可以运行的网页代码</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-white hover:shadow-md active:scale-95 transition-all"
          >
            {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {done ? '重播' : running ? '暂停' : '播放'}
          </button>
          <button
            onClick={reset}
            className="p-1.5 rounded-lg text-xs text-muted hover:text-accent hover:bg-surface-alt transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prompt display */}
      <div className="mb-4 p-3 rounded-xl bg-accent-soft border border-accent/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold text-accent">用户输入</span>
        </div>
        <p className="text-sm font-medium">{DEMO_PROMPT}</p>
      </div>

      {/* Code generation area */}
      <div className="flex gap-4">
        {/* "AI thinking" indicator */}
        <div className="hidden md:flex flex-col items-center gap-2 shrink-0 pt-2">
          <div className={`w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center transition-all duration-300 ${
            running ? 'animate-pulse-glow scale-110' : ''
          }`}>
            <Sparkles className={`w-5 h-5 text-accent ${running ? 'animate-spin' : ''}`} />
          </div>
          <span className="text-[9px] text-muted text-center leading-tight">
            {running ? '生成中...' : done ? '完成' : '就绪'}
          </span>
        </div>

        {/* Code output */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-edge overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-alt border-b border-edge">
              <span className="w-2 h-2 rounded-full bg-accent/40" />
              <span className="w-2 h-2 rounded-full bg-warning/40" />
              <span className="w-2 h-2 rounded-full bg-success/40" />
              <span className="text-[10px] text-muted ml-2">index.html</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed bg-[#1e1b18] text-[#e8dcc8] overflow-auto max-h-[350px] min-h-[120px]">
              <code>
                {displayCode || (
                  <span className="text-faint/30 animate-pulse">等待生成...</span>
                )}
                {running && (
                  <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-0.5 align-middle" />
                )}
              </code>
            </pre>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
            <span>已生成 {displayTokens.length} / {DEMO_TOKENS.length} tokens</span>
            <span>{displayTokens.length > 0 ? Math.round((displayTokens.length / DEMO_TOKENS.length) * 100) : 0}%</span>
            <div className="flex-1 h-1 rounded-full bg-surface-raised overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${displayTokens.length > 0 ? (displayTokens.length / DEMO_TOKENS.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 p-3 rounded-xl bg-surface-alt border border-edge/50">
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-text-primary">原理：</span>
          模型更像一个速度很快的“文字接龙”工具：它根据你给的描述，逐个预测接下来可能出现的 token（通常是词或标点），直到代码写完。
          描述越具体，生成结果通常越容易修改，也越接近你真正想做的东西。
        </p>
      </div>
    </div>
  );
}
