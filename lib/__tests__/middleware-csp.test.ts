import { afterEach, describe, expect, it, vi } from "vitest";
import { middleware } from "../../middleware";

/**
 * CSP 回归测试。
 *
 * 这条规则已经被踩过两次：生产环境把 script-src 收成 'self'，浏览器就会拦掉
 * Next.js 用来下发 RSC 数据的内联脚本（self.__next_f.push(...)），
 * React 拿不到 flight 数据 → hydration 失败 → 页面上所有 onClick 控件
 * （汉堡菜单、学习助手的「直接回答 / 引导思考」、测验选项……）全部没反应，
 * 只有 <a href> 还能用，看起来就像「有的按钮坏了」。
 */
function cspFor(nodeEnv: string): string {
  vi.stubEnv("NODE_ENV", nodeEnv);
  const request = {
    method: "GET",
    headers: new Headers({ host: "learn.example.test" }),
  };
  const response = middleware(request as never);
  return response.headers.get("Content-Security-Policy") ?? "";
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Content-Security-Policy", () => {
  it("keeps 'unsafe-inline' for scripts in production so Next.js can hydrate", () => {
    const csp = cspFor("production");

    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    // 生产环境绝不放 eval
    expect(csp).not.toContain("unsafe-eval");
  });

  it("adds 'unsafe-eval' only in development", () => {
    const csp = cspFor("development");

    expect(csp).toContain("script-src 'self' 'unsafe-eval' 'unsafe-inline'");
  });

  it("keeps the rest of the policy locked down", () => {
    const csp = cspFor("production");

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("object-src 'none'");
    // 外链脚本一律不允许，图片只允许本站与 data/blob
    expect(csp).not.toContain("script-src 'self' https:");
    expect(csp).toContain("img-src 'self' data: blob:");
  });

  it("still rejects cross-origin writes", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = middleware({
      method: "POST",
      headers: new Headers({
        host: "learn.example.test",
        origin: "https://attacker.test",
      }),
    } as never);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Invalid origin" });
  });
});
