// The Worker in front of the static files (wrangler.jsonc). It answers only for /stats/*, the paths of
// run_worker_first: Umami's tracker and its events, served from the blog's own address. Every other request goes
// to the static files of dist, with the headers of public/_headers.

import { umamiServer } from "../src/umami";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/stats/script.js") return trackerScript();
    if (pathname === "/stats/api/send" && request.method === "POST") {
      return forwardEvent(request);
    }
    if (pathname.startsWith("/stats/")) {
      return new Response("Not found", { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};

/** Umami's tracker, kept an hour in Cloudflare's cache and the browser's. */
async function trackerScript(): Promise<Response> {
  const response = await fetch(`${umamiServer}/script.js`, {
    cf: { cacheEverything: true, cacheTtl: 3600 },
  } as RequestInit);
  if (!response.ok) return new Response("", { status: 502 });
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * Passes an event from the tracker to Umami, with the visitor's IP address in
 * x-umami-client-ip (Umami's CLIENT_IP_HEADER): Umami reads the country from it
 * and doesn't store it. The User-Agent lets Umami tell visitors apart and drop bots.
 */
async function forwardEvent(request: Request): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": request.headers.get("Content-Type") ?? "application/json",
    "User-Agent": request.headers.get("User-Agent") ?? "",
    "x-umami-client-ip": request.headers.get("CF-Connecting-IP") ?? "",
  };
  for (const name of ["Accept-Language", "x-umami-cache"]) {
    const value = request.headers.get(name);
    if (value) headers[name] = value;
  }

  const response = await fetch(`${umamiServer}/api/send`, {
    method: "POST",
    headers,
    body: request.body,
  });
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}
