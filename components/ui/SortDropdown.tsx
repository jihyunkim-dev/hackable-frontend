"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

interface SortDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SortDropdown({
  label,
  options,
  value,
  onChange,
  className,
}: SortDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={`${label}: ${value}`}
        className={cn(
          "flex h-8 shrink-0 items-center text-label-s text-gray-700 lg:text-label-m",
          className,
        )}
      >
        {value}
        <Image src={commonIconUrl.sort} alt="" width={24} height={24} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-[60] min-w-28 rounded-lg bg-white p-1 shadow-md"
        >
          <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
            {options.map((option) => (
              <DropdownMenu.RadioItem
                key={option}
                value={option}
                className="rounded-sm px-3 py-2 text-label-m text-gray-700 outline-none data-[highlighted]:bg-gray-50 data-[state=checked]:text-primary-500"
              >
                {option}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
