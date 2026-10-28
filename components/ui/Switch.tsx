"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  name?: string;
  className?: string;
}

export default function Switch({
  checked,
  onCheckedChange,
  label,
  name,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-rose-500" : "bg-gray-200",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-[3px] left-[3px] h-[18px] w-7 rounded-full transition-all",
          checked ? "translate-x-[14px] bg-white" : "bg-gray-400",
        )}
      />
      {name && (
        <input type="hidden" name={name} value={checked ? "open" : "closed"} />
      )}
    </button>
  );
}
