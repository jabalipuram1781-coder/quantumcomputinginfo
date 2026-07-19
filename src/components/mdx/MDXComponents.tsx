import * as React from "react";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";
import { GlossaryTooltip } from "../blog/GlossaryTooltip";
import { QuizWidget } from "../widgets/QuizWidget";
import { QuantumSimulator } from "../widgets/QuantumSimulator";

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const;
  const sizes: Record<number, string> = {
    1: "text-3xl sm:text-4xl font-bold mt-10 mb-4",
    2: "text-2xl sm:text-3xl font-bold mt-10 mb-4",
    3: "text-xl sm:text-2xl font-semibold mt-8 mb-3",
    4: "text-lg sm:text-xl font-semibold mt-6 mb-2",
    5: "text-base font-semibold mt-4 mb-2",
    6: "text-sm font-semibold mt-4 mb-2 uppercase tracking-wider text-white/60",
  };

  const HeadingComponent = ({
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <Tag
        id={id}
        className={cn("group relative scroll-mt-24 text-white", sizes[level])}
        {...props}
      >
        {children}
        {id && (
          <a
            href={`#${id}`}
            className="ml-2 inline-flex opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Link to ${typeof children === "string" ? children : "section"}`}
          >
            <LinkIcon className="size-4 text-violet-400" />
          </a>
        )}
      </Tag>
    );
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
}

export const mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),

  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 leading-7 text-white/70" {...props}>
      {children}
    </p>
  ),

  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-violet-400 underline decoration-violet-400/30 underline-offset-4 transition-colors hover:text-violet-300 hover:decoration-violet-300/50"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || "#"}
        className="font-medium text-violet-400 underline decoration-violet-400/30 underline-offset-4 transition-colors hover:text-violet-300 hover:decoration-violet-300/50"
        {...props}
      >
        {children}
      </Link>
    );
  },

  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-white/70 marker:text-violet-400/60" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-white/70 marker:text-violet-400/60" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),

  blockquote: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-violet-500/30 bg-violet-500/5 py-3 pl-4 pr-4 text-white/60 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  pre: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLPreElement>) => {
    // Extract language from child code element className
    const childProps = React.isValidElement(children)
      ? (children.props as Record<string, unknown>)
      : {};
    const className = (childProps.className as string) || "";
    const language = className.replace(/language-/, "");

    return (
      <CodeBlock data-language={language || undefined} {...props}>
        {React.isValidElement(children) ? childProps.children as React.ReactNode : children}
      </CodeBlock>
    );
  },

  code: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    // Inline code (not inside pre)
    if (!className?.includes("language-")) {
      return (
        <code
          className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-sm font-mono text-violet-300"
          {...props}
        >
          {children}
        </code>
      );
    }
    // Code block handled by pre above
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-white/5">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),

  thead: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-white/10 bg-white/[0.02]" {...props}>
      {children}
    </thead>
  ),

  th: ({
    children,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/60"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({
    children,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-t border-white/5 px-4 py-3 text-white/70" {...props}>
      {children}
    </td>
  ),

  hr: () => (
    <hr className="my-8 border-white/5" />
  ),

  img: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        className="rounded-lg border border-white/5"
        loading="lazy"
        {...props}
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-white/40">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  strong: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-white" {...props}>
      {children}
    </strong>
  ),

  em: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => (
    <em className="text-white/60" {...props}>
      {children}
    </em>
  ),

  // Custom components
  Callout,
  GlossaryTooltip,
  Term: GlossaryTooltip,
  QuizWidget,
  QuantumSimulator,
};
