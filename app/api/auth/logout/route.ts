import { clearAuthCookies, getRefreshToken } from "@/utils/authSession";
import { RequestLogout } from "@/utils/requestToSrv";

// 로그아웃: 백엔드에서 refresh_token을 무효로 만들고 토큰 쿠키를 지운다.
// 백엔드 요청이 실패해도 이 브라우저에서는 로그아웃되도록 쿠키는 항상 지운다.
export async function POST() {
  const refreshToken = await getRefreshToken();
  if (refreshToken) await RequestLogout(refreshToken);
  await clearAuthCookies();
  return new Response(null, { status: 204 });
}
