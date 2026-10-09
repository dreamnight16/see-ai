import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // CSP: 仅允许本站 + API 必需的外部服务
  //
  // script-src 里的 'unsafe-inline' 是必需的，不是手滑：
  // App Router 会把 RSC/flight 数据用**内联脚本**下发（self.__next_f.push(...)），
  // 生产环境如果只写 script-src 'self'，这些内联脚本会被浏览器拦掉，
  // React 拿不到 flight 数据 → hydration 失败 → 页面上所有 onClick 控件
  // （汉堡菜单、学习助手的「直接回答 / 引导思考」、测验选项、练习检查……）
  // 统统一动不动，只有 <a href> 因为走浏览器原生跳转还活着。
  // 0.2.0 修过一次这个坑，0.3.0 重做界面时又退回去了。
  //
  // 换成 nonce 就得全站改成动态渲染（Next 官方文档明确写了：静态页面生成时
  // 没有请求头可读，注不进 nonce），本站是纯预渲染课程站、靠 CDN 缓存吃流量，
  // 代价不值当；SRI 那套只覆盖外部脚本，管不到内联 flight 数据。
  // 因此按 Next 文档「Without Nonces」一节，生产保留 'unsafe-inline'。
  // 站点没有 dangerouslySetInnerHTML / innerHTML / eval 注入点，
  // 正文全部来自仓库内 Markdown，没有可注入的用户 HTML，风险可控。
  //
  // unsafe-eval 仍然只在开发模式放开（Next.js dev 需要）。
  const isDev = process.env.NODE_ENV === "development";
  const csp = [
    "default-src 'self'",
    isDev ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' https://api.deepseek.com https://api.openai.com https://api.anthropic.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // 放开 script-src 的内联之后，再补一条能补回来的限制：
    // 本站没有任何 <object>/<embed>，插件内容一律不允许。
    "object-src 'none'",
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);

  // CSRF: 校验 POST/PUT/DELETE 请求的 Origin
  if (["POST", "PUT", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).hostname;
        const requestHost = host.split(":")[0];
        if (originHost !== requestHost) {
          return NextResponse.json(
            { error: "Invalid origin" },
            { status: 403 },
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid origin" },
          { status: 403 },
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
