"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import LoginRequiredLink from "@/components/ui/LoginRequiredLink";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";
import { FLOATING_POSITION } from "./floatingPosition";

const SUBSCRIBE_HREF = "/newsletter/subscribe";
const TEAM_BUILDING_HREF = "/teambuilding";

// 화면 우측 하단에 고정되는 플로팅 버튼
// - 기본: 구독 바로가기
// - 팀빌딩 목록 모바일: 모집글 작성(+) 버튼으로 바뀐다.
// - 대회·지원사업 상세 lg 미만: 페이지가 띄운 참여하기 버튼(ProjectDetailSection)에 자리를 내준다.
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
        // 상세 페이지 참여하기 버튼(data-floating-override)이 있으면 lg 미만에서 숨긴다.
        "max-lg:[body:has([data-floating-override])_&]:hidden",
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

// 모바일 전용. md 이상은 목록 상단의 작성 버튼을 쓴다. 로그인하지 않았으면 로그인 모달을 띄운다.
function CreateTeamBuildingLink() {
  return (
    <LoginRequiredLink
      href={teamBuildingContent.create.href}
      aria-label={teamBuildingContent.create.label}
      className={cn(
        FLOATING_POSITION,
        "size-14 rounded-full bg-linear-[135deg] from-rose-500 to-primary-500 md:hidden",
      )}
    >
      <Image
        src={commonIconUrl.plus}
        alt=""
        width={24}
        height={24}
        className="size-7"
      />
    </LoginRequiredLink>
  );
}
