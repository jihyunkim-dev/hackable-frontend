import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { setReturnTo } from "@/utils/authSession";
import { googleLoginUrl } from "@/utils/requestToSrv";

// 구글 로그인 시작: 돌아올 페이지를 기억해 두고 백엔드 구글 로그인으로 보낸다.
// 예: /auth/login/google?returnTo=/mypage
export async function GET(request: NextRequest) {
  await setReturnTo(request.nextUrl.searchParams.get("returnTo") ?? "/");
  redirect(googleLoginUrl);
}
