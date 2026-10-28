import type { NextRequest } from "next/server";
import { finishSocialLogin } from "@/utils/authSession";
import { RequestKakaoCallback } from "@/utils/requestToSrv";

// 카카오 로그인 콜백: 카카오가 인가 코드(?code=)를 붙여 이 주소로 돌려보낸다.
// 코드는 서버에서 백엔드로 보내 토큰으로 바꾸고, 토큰은 쿠키에 저장한 뒤 원래 페이지로 이동시킨다.
// (백엔드가 토큰을 쿼리로 붙여 바로 보내는 경우도 그대로 처리한다)
// 사용자가 카카오 동의 화면에서 취소하면 카카오가 ?error=access_denied 로 돌려보낸다.
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const code = query.get("code");
  const params = code ? await RequestKakaoCallback(code) : query;

  return finishSocialLogin(params, request.nextUrl.origin);
}
