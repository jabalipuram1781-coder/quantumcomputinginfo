import * as React from "react";
import { Info, AlertTriangle, Lightbulb, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "tip" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: React.ElementType;
    borderColor: string;
    bgColor: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  info: {
    icon: Info,
    borderColor: "border-l-blue-500",
    bgColor: "bg-blue-500/5",
    iconColor: "text-blue-400",
    titleColor: "text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-l-amber-500",
    bgColor: "bg-amber-500/5",
    iconColor: "text-amber-400",
    titleColor: "text-amber-400",
  },
  tip: {
    icon: Lightbulb,
    borderColor: "border-l-emerald-500",
    bgColor: "bg-emerald-500/5",
    iconColor: "text-emerald-400",
    titleColor: "text-emerald-400",
  },
  danger: {
    icon: AlertOctagon,
    borderColor: "border-l-red-500",
    bgColor: "bg-red-500/5",
    iconColor: "text-red-400",
    titleColor: "text-red-400",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-6 rounded-lg border-l-4 p-4",
        config.borderColor,
        config.bgColor
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 size-5 shrink-0", config.iconColor)} />
        <div className="min-w-0 flex-1">
          {title && (
            <p className={cn("mb-1 font-semibold", config.titleColor)}>
              {title}
            </p>
          )}
          <div className="text-sm leading-relaxed text-white/70">{children}</div>
        </div>
      </div>
    </div>
  );
}
