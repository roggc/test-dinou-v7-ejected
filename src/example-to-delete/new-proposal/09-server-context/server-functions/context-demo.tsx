"use server";

import { getContext } from "dinou";

export async function getServerTelemetry() {
  const ctx = getContext();

  const ua = ctx?.req?.headers?.["user-agent"] || "Modern Browser";
  const host = ctx?.req?.headers?.host || "localhost:3000";
  const cookies = ctx?.req?.cookies || {};
  const badgeMode = cookies["dinou_badge"] || "Developer";

  return {
    host,
    userAgent: ua.length > 48 ? ua.slice(0, 45) + "..." : ua,
    method: ctx?.req?.method || "POST",
    path: ctx?.req?.path || "/____server_function____",
    nodeVersion: process.version,
    serverUptime: Math.floor(process.uptime()) + "s",
    badgeMode,
    timestamp: new Date().toLocaleTimeString(),
  };
}

export async function setServerBadgeCookie(newBadge: string) {
  const ctx = getContext();
  if (ctx?.res) {
    if (newBadge === "none") {
      ctx.res.clearCookie("dinou_badge", { path: "/" });
    } else {
      ctx.res.cookie("dinou_badge", newBadge, {
        path: "/",
        maxAge: 3600 * 24 * 7,
      });
    }
  }
  return { activeBadge: newBadge };
}
