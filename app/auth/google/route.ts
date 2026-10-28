import type { NextRequest } from "next/server";
import { finishSocialLogin } from "@/utils/authSession";

// 구글 로그인 결과: 백엔드가 구글 인가 코드를 토큰으로 바꾼 뒤 결과를 쿼리로 붙여 이 주소로 보낸다.
// 사용자가 구글 동의 화면에서 취소하면 login_success=false·error=google_denied 로 온다.
export async function GET(request: NextRequest) {
  return finishSocialLogin(
    request.nextUrl.searchParams,
    request.nextUrl.origin,
  );
}
