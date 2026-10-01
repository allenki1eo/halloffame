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

function send(body: ReturnType<typeof payload>) {
  void fetch("/api/traffic", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}

export function TrafficBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
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
