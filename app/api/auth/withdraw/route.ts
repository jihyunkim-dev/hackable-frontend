import { clearAuthCookies, withAuth } from "@/utils/authSession";
import { RequestWithdraw } from "@/utils/requestToSrv";

// 회원 탈퇴: 성공하면 토큰 쿠키를 지운다. (백엔드에서 바로 로그인이 막힌다)
export async function DELETE() {
  const withdrawn = await withAuth(
    async (accessToken) => (await RequestWithdraw(accessToken)) || null,
  );
  if (!withdrawn) return new Response(null, { status: 400 });

  await clearAuthCookies();
  return new Response(null, { status: 204 });
}
