"use client";

import { projectFilterKeys } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (key: string) => void;
  counts: Record<string, number>;
};

/** Editorial filter row: text + a hairline that slides to the active item. */
export default function ProjectFilters({ value, onChange, counts }: Props) {
  const { dict } = useLanguage();
  return (
    <div
      role="tablist"
      aria-label={dict.work.filterLabel}
      className="pointer-events-auto flex flex-wrap gap-x-7 gap-y-3"
    >
      {projectFilterKeys.map((key) => {
        const active = key === value;
        const empty = (counts[key] ?? 0) === 0 && key !== "all";
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={cn(
              "label relative pb-2 transition-colors duration-300",
              active ? "!text-bone" : "hover:!text-bone",
              empty && "opacity-40",
            )}
          >
            {dict.work.filters[key]}
            <sup className="ml-1 text-[0.6rem] opacity-50">{counts[key] ?? 0}</sup>
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 h-px origin-left bg-signal transition-transform duration-500",
                active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
