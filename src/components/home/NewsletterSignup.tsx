"use client";

import * as React from "react";
import { Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section className="relative overflow-hidden py-20">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-cyan-950/40" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
          <Sparkles className="size-3" />
          Stay in the loop
        </div>

        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Stay Updated with{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Quantum Computing
          </span>
        </h2>

        <p className="mt-4 text-muted-foreground">
          Get weekly curated news, research highlights, and learning resources
          delivered straight to your inbox. Join thousands of quantum enthusiasts.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full border-border bg-card text-foreground placeholder:text-muted-foreground sm:max-w-sm"
            required
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            size="lg"
            disabled={status === "loading"}
            className="w-full gap-2 bg-violet-600 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 sm:w-auto"
          >
            {status === "loading" ? (
              "Subscribing..."
            ) : (
              <>
                Subscribe
                <Send className="size-4" />
              </>
            )}
          </Button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm text-emerald-400">
            🎉 You&apos;re subscribed! Check your inbox for a confirmation.
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-400">
            Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </section>
  );
}
