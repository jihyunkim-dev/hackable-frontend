import { cn } from "@/lib/utils";

// 팀빌딩 모집 상태 뱃지
export default function StatusBadge({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-lg px-3 py-1 text-label-m text-white",
        isOpen ? "bg-rose-500" : "bg-gray-400",
        className,
      )}
    >
      {isOpen ? "모집중" : "모집마감"}
    </span>
  );
}
