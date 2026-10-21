import Image from "next/image";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  action: string;
  placeholder: string;
  defaultValue?: string;
  className?: string;
}

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
        "flex h-10 w-full max-w-[360px] items-center gap-2 rounded-full border border-gray-200 bg-white pr-1.5 pl-3 focus-within:border-primary-300 sm:h-11 sm:max-w-[560px] sm:pl-4 lg:h-13 lg:max-w-[620px] lg:pl-5",
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
