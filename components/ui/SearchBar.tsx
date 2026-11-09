import Image from "next/image";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  action: string;
  placeholder: string;
  defaultValue?: string;
  className?: string;
}

// 검색창 크기·테두리 (빈 자리 SearchBarSkeleton과 같이 쓴다)
const SEARCH_BAR_FRAME =
  "flex h-10 w-full max-w-[360px] rounded-full border border-gray-200 sm:h-11 sm:max-w-[560px] lg:h-13 lg:max-w-[620px]";

// JS 없이도 동작하도록 GET 폼으로 검색어(q)를 전달한다.
export default function SearchBar({
  action,
  placeholder,
  defaultValue,
  className,
}: SearchBarProps) {
  return (
    <form
      role="search"
      action={action}
      className={cn(
        SEARCH_BAR_FRAME,
        "items-center gap-2 bg-white pr-1.5 pl-3 focus-within:border-primary-300 sm:pl-4 lg:pl-5",
        className,
      )}
    >
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-label-m text-gray-800 outline-none placeholder:text-gray-400 lg:text-label-l"
      />
      <button
        type="submit"
        aria-label="검색"
        className="flex size-7 shrink-0 items-center justify-center sm:size-8 lg:size-10"
      >
        <Image
          src={commonIconUrl.search}
          alt=""
          width={40}
          height={40}
          className="size-full"
        />
      </button>
    </form>
  );
}

// 검색어를 기다리는 동안 검색창 자리를 같은 크기로 비워 둔다. (글자·입력창 없음)
export function SearchBarSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(SEARCH_BAR_FRAME, "bg-gray-50", className)}
    />
  );
}
