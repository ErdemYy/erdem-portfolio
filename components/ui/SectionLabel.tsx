import { cn } from "@/lib/utils";

/** "02 — WHO I AM" with a short rule. */
export default function SectionLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-fade className={cn("label flex items-center gap-4", className)}>
      {index && <span className="text-signal">{index}</span>}
      <span className="h-px w-10 bg-white/20" />
      <span>{children}</span>
    </div>
  );
}
