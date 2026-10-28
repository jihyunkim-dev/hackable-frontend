import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { setAuthCookies, takeReturnTo } from "@/utils/authSession";
import { RequestKakaoCallback } from "@/utils/requestToSrv";

// 카카오 로그인 콜백: 카카오가 인가 코드(?code=)를 붙여 이 주소로 돌려보낸다.
// 코드는 서버에서 백엔드로 보내 토큰으로 바꾸고, 토큰은 쿠키에 저장한 뒤 원래 페이지로 이동시킨다.
// (백엔드가 토큰을 쿼리로 붙여 바로 보내는 경우도 그대로 처리한다)
// 성공: access_token·refresh_token·login_success=true
// 실패: login_success=false·error=<코드>·message=<안내 문구>
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const returnTo = await takeReturnTo();

  const code = query.get("code");
  const params = code ? await RequestKakaoCallback(code) : query;

  const accessToken = params?.get("access_token");
  const refreshToken = params?.get("refresh_token");

  if (params?.get("login_success") === "true" && accessToken && refreshToken) {
    await setAuthCookies({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "bearer",
    });
    redirect(returnTo);
  }

  // 실패하면 원래 페이지로 돌아가 안내 문구를 보여준다. (components/layout/header/HeaderClient)
  // 사용자가 카카오 동의 화면에서 취소하면 카카오가 ?error=access_denied 로 돌려보낸다.
  const failed = new URL(returnTo, request.nextUrl.origin);
  failed.searchParams.set(
    "login_error",
    params?.get("message") ?? "로그인에 실패했어요. 다시 시도해주세요.",
  );
  redirect(`${failed.pathname}${failed.search}`);
}
