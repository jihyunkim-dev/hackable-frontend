"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

const SUBSCRIBE_HREF = "/newsletter/subscribe";
const TEAM_BUILDING_HREF = "/teambuilding";

// 화면 우측 하단 고정 위치. 모바일에서는 하단 탭바 위에 띄운다.
const FLOATING_POSITION =
  "fixed right-4 bottom-[calc(var(--navbar-height-mobile)+env(safe-area-inset-bottom)+16px)] z-40 flex items-center justify-center shadow-lg transition-transform hover:scale-105 md:right-8 md:bottom-8";

// 화면 우측 하단에 고정되는 플로팅 버튼
// - 기본: 구독 바로가기
// - 팀빌딩 목록 모바일: 모집글 작성(+) 버튼으로 바뀐다.
// usePathname이 프리렌더 시점에 확정되지 않으므로 Suspense로 감싸고, 그동안은 구독 버튼을 보여준다.
export default function FloatingButton() {
  return (
    <Suspense fallback={<SubscribeLink />}>
      <FloatingByPath />
    </Suspense>
  );
}

function FloatingByPath() {
  const pathname = usePathname();

  // 구독 페이지에서는 숨긴다.
  if (pathname === SUBSCRIBE_HREF) return null;

  if (pathname === TEAM_BUILDING_HREF) {
    return (
      <>
        <CreateTeamBuildingLink />
        <SubscribeLink className="max-md:hidden" />
      </>
    );
  }

  return <SubscribeLink />;
}

function SubscribeLink({ className }: { className?: string }) {
  return (
    <Link
      href={SUBSCRIBE_HREF}
      aria-label="뉴스레터 구독하기"
      className={cn(
        FLOATING_POSITION,
        "floating-gradient size-13 rounded-[20px] md:size-16 md:rounded-3xl",
        className,
      )}
    >
      <Image
        src={commonIconUrl.hackableWhite}
        alt=""
        width={17}
        height={28}
        className="h-7 w-auto"
      />
    </Link>
  );
}

// 모바일 전용. md 이상은 목록 상단의 작성 버튼을 쓴다.
function CreateTeamBuildingLink() {
  return (
    <Link
      href={teamBuildingContent.create.href}
      aria-label={teamBuildingContent.create.label}
      className={cn(
        FLOATING_POSITION,
        "size-14 rounded-full bg-linear-[135deg] from-rose-500 to-primary-500 md:hidden",
      )}
    >
      <Image src={commonIconUrl.plus} alt="" width={24} height={24} className="size-7" />
    </Link>
  );
}
