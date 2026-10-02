"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function payload(kind: "view" | "click", path: string, event?: string, target?: string) {
  const params = new URLSearchParams(window.location.search);
  return {
    kind,
    path,
    referrer: document.referrer,
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    event,
    target,
  };
}

/** Remount guard: React strict mode and layout re-renders must not log one visit twice. */
let lastView = { path: "", at: 0 };

function send(body: ReturnType<typeof payload>) {
  const json = JSON.stringify(body);
  if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon("/api/traffic", json)) return;
  void fetch("/api/traffic", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: json,
    keepalive: true,
  }).catch(() => undefined);
}

export function TrafficBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const now = Date.now();
    if (lastView.path === pathname && now - lastView.at < 2000) return;
    lastView = { path: pathname, at: now };
    send(payload("view", pathname));
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const node = event.target;
      if (!(node instanceof Element)) return;
      const source = node.closest("[data-track]");
      if (!(source instanceof HTMLElement)) return;
      const name = source.dataset.track;
      if (!name) return;
      const href = source instanceof HTMLAnchorElement ? source.getAttribute("href") : "";
      const target = source.dataset.trackTarget || href || "";
      send(payload("click", window.location.pathname, name, target));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
