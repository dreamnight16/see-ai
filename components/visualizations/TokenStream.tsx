'use client';

import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
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
  '    .start', ' { ', 'background', ': #59AAA5', '; ', 'color', ': white', '; }', '\n',
  '    .reset', ' { ', 'background', ': #E1E9E7', '; }', '\n',
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

  const percent = displayTokens.length > 0
    ? Math.round((displayTokens.length / DEMO_TOKENS.length) * 100)
    : 0;

  return (
    <div className="card dn-rise p-5" style={{ '--dn-enter-index': 0 } as CSSProperties}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center bg-teal-tint">
            <Sparkles className="h-4 w-4 text-teal-ink" />
          </span>
          <div>
            <h3 className="font-display text-base">代码是怎样一步步写出来的</h3>
            <p className="text-[11px] text-text-secondary">看一段话怎样被拆成可以运行的网页代码</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            className="dn-focus dn-interactive flex min-h-[44px] items-center gap-1.5 bg-teal px-4 text-xs font-semibold text-on-color"
          >
            {running ? (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {done ? '重播' : running ? '暂停' : '播放'}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="重置生成过程"
            className="dn-focus dn-interactive flex h-11 w-11 items-center justify-center border border-edge-strong text-text-primary hover:bg-surface-alt"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Prompt display */}
      <div className="mb-4 border border-edge bg-teal-tint p-3">
        <div className="mb-1 flex items-center gap-2">
          <span className="see-kicker text-teal-ink">用户输入</span>
        </div>
        <p className="text-sm font-semibold">{DEMO_PROMPT}</p>
      </div>

      {/* Code generation area */}
      <div className="flex gap-4">
        {/* 「生成中」只用图标旋转 + 文字状态表达，不再做持续的发光脉冲 */}
        <div className="hidden shrink-0 flex-col items-center gap-2 pt-2 md:flex">
          <div className="flex h-12 w-12 items-center justify-center bg-teal-tint">
            <Sparkles
              className={'h-5 w-5 text-teal-ink' + (running ? ' animate-spin' : '')}
              aria-hidden="true"
            />
          </div>
          <span className="text-center text-[10px] leading-tight text-text-secondary">
            {running ? '生成中...' : done ? '完成' : '就绪'}
          </span>
        </div>

        {/* Code output */}
        <div className="min-w-0 flex-1">
          <div className="border border-edge">
            <div className="flex items-center gap-2 border-b border-edge bg-surface-alt px-3 py-2">
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-steel" />
              <span className="see-kicker text-text-secondary">index.html</span>
            </div>
            <pre className="see-code max-h-[350px] min-h-[120px] overflow-auto p-4 font-mono text-xs leading-relaxed">
              <code>
                {displayCode || (
                  <span className="animate-pulse text-on-ink/60">等待生成...</span>
                )}
                {running && (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-teal align-middle"
                  />
                )}
              </code>
            </pre>
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-[10px] text-text-secondary">
            <span className="tabular-nums">
              已生成 {displayTokens.length} / {DEMO_TOKENS.length} tokens
            </span>
            <span className="tabular-nums">{percent}%</span>
            <div className="h-1 flex-1 overflow-hidden bg-surface-raised">
              <div
                className="h-full bg-teal transition-[width] duration-[380ms] ease-[var(--dn-ease-in)]"
                style={{ width: percent + '%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 border border-edge bg-surface-alt p-3">
        <p className="text-xs leading-relaxed text-text-secondary">
          <span className="font-semibold text-text-primary">原理：</span>
          模型更像一个速度很快的“文字接龙”工具：它根据你给的描述，逐个预测接下来可能出现的 token（通常是词或标点），直到代码写完。
          描述越具体，生成结果通常越容易修改，也越接近你真正想做的东西。
        </p>
      </div>
    </div>
  );
}
