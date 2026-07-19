"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  defaultValue = "",
  onSearch,
  placeholder = "Search articles, topics, news...",
  className,
}: SearchBarProps) {
  const [query, setQuery] = React.useState(defaultValue);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (onSearch) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    }
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/30" />
      <Input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20"
      />
    </div>
  );
}
