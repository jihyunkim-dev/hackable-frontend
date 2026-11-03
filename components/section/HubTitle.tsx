import { ViewTransition } from "react";
import { cn } from "@/lib/utils";

interface HubTitleProps {
  // 지금 선택된 탭 이름 (전체 / AI공모전 …)
  label: string;
  className?: string;
}

// 목록 페이지 H1. 선택된 탭 이름을 보여 주고, 탭을 바꾸면 이전 이름이 사라지며 새 이름이 스르륵 나타난다.
// - 탭이 다른 페이지(/project → /project/ai-contest)여도 같은 name이라 두 제목이 한 쌍으로 이어진다.
// - 같은 페이지 안에서 탭만 바뀌면(?type=) key가 바뀌어 이전·새 제목이 한 쌍이 된다.
// 애니메이션 모양은 app/globals.css의 .hub-title 참고. 지원하지 않는 브라우저는 그냥 바로 바뀐다.
export default function HubTitle({ label, className }: HubTitleProps) {
  return (
    <ViewTransition
      key={label}
      name="hub-title"
      share="hub-title"
      enter="hub-title"
      default="none"
    >
      <h1
        className={cn("text-heading-m font-extrabold text-gray-800", className)}
      >
        {label}
      </h1>
    </ViewTransition>
  );
}
