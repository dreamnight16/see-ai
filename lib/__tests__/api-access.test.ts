import { afterEach, describe, expect, it } from "vitest";
import { getAiApiAccessError } from "../api-access";

const originalToken = process.env.AI_API_AUTH_TOKEN;

afterEach(() => {
  if (originalToken === undefined) delete process.env.AI_API_AUTH_TOKEN;
  else process.env.AI_API_AUTH_TOKEN = originalToken;
});

describe("AI API access", () => {
  it("allows local use when no bearer token is configured", () => {
    delete process.env.AI_API_AUTH_TOKEN;
    expect(getAiApiAccessError({ headers: new Headers() })).toBeNull();
  });

  it("rejects spoofed same-origin headers without the configured token", () => {
    process.env.AI_API_AUTH_TOKEN = "server-secret";

    expect(
      getAiApiAccessError({
        headers: new Headers({
          origin: "https://example.test",
          host: "example.test",
          "sec-fetch-site": "same-origin",
        }),
      })?.status,
    ).toBe(401);
  });

  it("allows callers that provide the optional bearer token", () => {
    process.env.AI_API_AUTH_TOKEN = "server-secret";

    expect(
      getAiApiAccessError({
        headers: new Headers({ authorization: "Bearer server-secret" }),
      }),
    ).toBeNull();
  });

  it("rejects cross-origin callers without the token", async () => {
    process.env.AI_API_AUTH_TOKEN = "server-secret";

    const response = getAiApiAccessError({
      headers: new Headers({
        origin: "https://attacker.test",
        host: "example.test",
      }),
    });

    expect(response?.status).toBe(401);
    await expect(response?.json()).resolves.toEqual({ error: "Unauthorized" });
  });
});
