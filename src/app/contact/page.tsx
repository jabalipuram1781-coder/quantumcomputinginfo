"use client";

import * as React from "react";
import Script from "next/script";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { Send, MapPin, Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [turnstileToken, setTurnstileToken] = React.useState<string>("");

  const breadcrumbItems = [{ label: "Contact", href: "/contact" }];

  // Register Turnstile callback on the window
  React.useEffect(() => {
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
    (window as any).onTurnstileExpired = () => {
      setTurnstileToken("");
    };
    (window as any).onTurnstileError = () => {
      setTurnstileToken("");
    };

    return () => {
      delete (window as any).onTurnstileSuccess;
      delete (window as any).onTurnstileExpired;
      delete (window as any).onTurnstileError;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Reset turnstile widget if it exists
        if ((window as any).turnstile) {
          (window as any).turnstile.reset();
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 4000);
  };

  const hasTurnstileKey = !!siteConfig.turnstile.siteKey;

  return (
    <>
      {hasTurnstileKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
          async
          defer
        />
      )}
      <div className="min-h-screen bg-background py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
            <p className="mt-2 text-white/50">
              Have questions, feedback, or want to contribute original articles? Get in touch.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Info Panel */}
            <div className="space-y-8 lg:col-span-1">
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-6 space-y-6">
                <h2 className="text-lg font-semibold text-violet-400">Get in Touch</h2>

                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-md bg-violet-500/10 p-2 text-violet-400">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Email</h3>
                    <p className="text-xs text-white/50 mt-0.5">contact@quantumcomputinginfo.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-md bg-cyan-500/10 p-2 text-cyan-400">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Location</h3>
                    <p className="text-xs text-white/50 mt-0.5">Global Remote (Distributed)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-md bg-emerald-500/10 p-2 text-emerald-400">
                    <MessageSquare className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Feedback</h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Typically replies within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Panel */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border border-white/5 bg-white/[0.02] p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold text-white/60">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="border-white/10 bg-white/5 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold text-white/60">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="border-white/10 bg-white/5 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-semibold text-white/60">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Contribute / Advertising / Correction"
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-semibold text-white/60">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="flex w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                {/* Cloudflare Turnstile Widget */}
                {hasTurnstileKey ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60">Verification</label>
                    <div
                      className="cf-turnstile"
                      data-sitekey={siteConfig.turnstile.siteKey}
                      data-callback="onTurnstileSuccess"
                      data-expired-callback="onTurnstileExpired"
                      data-error-callback="onTurnstileError"
                      data-theme="dark"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-white/30 italic">
                    Turnstile is disabled (NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set).
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading" || (hasTurnstileKey && !turnstileToken)}
                  className="w-full gap-2 bg-violet-600 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 sm:w-auto"
                >
                  {status === "loading" ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="size-4" />
                    </>
                  )}
                </Button>

                {status === "success" && (
                  <p className="text-sm text-emerald-400 mt-2">
                    🎉 Thank you! Your message has been sent successfully. We will get back to you shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm text-red-400 mt-2">
                    Something went wrong. Please check your verification status and try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
