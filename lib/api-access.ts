/**
 * Enforce the configured bearer token for every AI request.
 * Request origin headers provide CSRF checks, not authentication.
 */
export function getAiApiAccessError(request: { headers: Headers }): Response | null {
  const token = process.env.AI_API_AUTH_TOKEN;
  if (!token) return null;

  const authorization = request.headers.get("authorization");
  if (authorization === `Bearer ${token}`) return null;

  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
