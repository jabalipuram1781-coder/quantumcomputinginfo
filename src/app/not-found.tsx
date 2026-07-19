import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Atom, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] text-white px-4 text-center">
      {/* Glow */}
      <div className="absolute size-96 rounded-full bg-violet-600/5 blur-[120px]" />

      <div className="relative z-10 space-y-6 max-w-md">
        <div className="mx-auto inline-flex rounded-full bg-violet-500/10 p-4 text-violet-400 animate-spin-slow">
          <Atom className="size-12" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404</h1>
        <h2 className="text-xl font-semibold text-white/80">Decoherence Detected</h2>
        <p className="text-sm text-white/50 leading-relaxed">
          The quantum state you are looking for has collapsed or doesn&apos;t exist in this universe.
          It may have been moved, deleted, or was never initialized.
        </p>

        <div className="pt-4">
          <Link href="/">
            <Button className="gap-2 bg-violet-600 px-6 text-white hover:bg-violet-500">
              <Home className="size-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
