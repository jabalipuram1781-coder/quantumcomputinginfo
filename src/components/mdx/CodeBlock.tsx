"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  "data-language"?: string;
}

export function CodeBlock({
  children,
  className,
  "data-language": language,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

  const copyCode = async () => {
    if (preRef.current) {
      const code = preRef.current.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-white/5 bg-[#0d0d12]">
      {/* Language badge & Copy button */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        {language && (
          <span className="text-xs font-medium uppercase tracking-wider text-white/30">
            {language}
          </span>
        )}
        <button
          onClick={copyCode}
          className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy
            </>
          )}
        </button>
      </div>

      <pre
        ref={preRef}
        className={cn(
          "overflow-x-auto p-4 text-sm leading-relaxed text-white/80",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
