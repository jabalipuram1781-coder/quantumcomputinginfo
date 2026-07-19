"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function GiscusComments() {
  const { theme } = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !containerRef.current) return;

    if (!repo || !repoId || !category || !categoryId) return;

    // Clean up any existing giscus frame
    const existingFrame = containerRef.current.querySelector("iframe.giscus-frame");
    if (existingFrame) {
      existingFrame.remove();
    }
    const existingScript = containerRef.current.querySelector("script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    containerRef.current.appendChild(script);
  }, [mounted, repo, repoId, category, categoryId, theme]);

  // Update theme on existing giscus iframe
  React.useEffect(() => {
    if (!mounted) return;
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (iframe) {
      iframe.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: { theme: theme === "dark" ? "dark" : "light" },
          },
        },
        "https://giscus.app"
      );
    }
  }, [theme, mounted]);

  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-8 text-center">
        <p className="text-sm text-white/40">
          Comments are not configured yet. Set up Giscus environment variables to
          enable discussions.
        </p>
        <p className="mt-2 text-xs text-white/20">
          Required: NEXT_PUBLIC_GISCUS_REPO, NEXT_PUBLIC_GISCUS_REPO_ID,
          NEXT_PUBLIC_GISCUS_CATEGORY, NEXT_PUBLIC_GISCUS_CATEGORY_ID
        </p>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-white">Comments</h2>
      <div ref={containerRef} className="giscus" />
    </section>
  );
}
