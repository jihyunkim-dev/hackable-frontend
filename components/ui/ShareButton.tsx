"use client";

import Image from "next/image";
import { useState } from "react";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  label: string;
  copiedLabel: string;
  title: string;
  // true면 아이콘만 보여주고 문구는 스크린리더용으로 둔다.
  iconOnly?: boolean;
  iconClassName?: string;
  className?: string;
}

// 기기 공유 시트를 우선 사용하고, 지원하지 않으면 링크를 복사한다.
export default function ShareButton({
  label,
  copiedLabel,
  title,
  iconOnly = false,
  iconClassName,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // 사용자가 공유를 취소한 경우
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white text-label-l text-gray-700 shadow-[0_1px_0_rgb(0_0_0/0.06)] transition-colors hover:bg-gray-50",
        className,
      )}
    >
      <Image
        src={commonIconUrl.share}
        alt=""
        width={16}
        height={15}
        className={iconClassName}
      />
      <span aria-live="polite" className={cn(iconOnly && "sr-only")}>
        {copied ? copiedLabel : label}
      </span>
    </button>
  );
}
