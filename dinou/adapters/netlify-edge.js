// dinou/adapters/netlify-edge.js
// Netlify Edge Functions (Deno) Adapter for Dinou v7.
// Connects Netlify Edge Functions with Dinou's dual-bundle edge runtime.

import { fetch as dinouFetch } from "../../.dinou/deno/main.js";

/**
 * Netlify Edge Function handler
 * @param {Request} request
 * @param {object} context - Netlify Edge Context (provides context.next())
 * @returns {Promise<Response>}
 */
export default async function netlifyEdgeHandler(request, context) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const isRSC = pathname.includes("____rsc_payload");
  const isServerFunc =
    pathname.includes("____server_function____") ||
    request.headers.get("x-server-function-call") === "1";

  // For non-internal requests (other than root HTML), try serving from Netlify CDN first
  if (!isRSC && !isServerFunc && pathname !== "/" && context && typeof context.next === "function") {
    try {
      const res = await context.next();
      if (res && res.status < 400) {
        return res;
      }
    } catch (e) {}
  }

  // Handle SSR, RSC, Server Functions, and ISG with Dinou Edge
  return dinouFetch(request);
}

export const config = {
  path: "/*",
  excludedPath: [
    "/assets/*",
    "/favicon.ico",
    "/*.ico",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.svg",
    "/*.webp",
    "/*.webmanifest",
    "/*.txt",
    "/*.xml",
    "/*.map",
  ],
};
