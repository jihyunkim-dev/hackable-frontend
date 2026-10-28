import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { setReturnTo } from "@/utils/authSession";
import { kakaoLoginUrl } from "@/utils/requestToSrv";

// 카카오 로그인 시작: 돌아올 페이지를 기억해 두고 백엔드 카카오 로그인으로 보낸다.
// 예: /auth/login/kakao?returnTo=/mypage
export async function GET(request: NextRequest) {
  await setReturnTo(request.nextUrl.searchParams.get("returnTo") ?? "/");
  redirect(kakaoLoginUrl);
}
