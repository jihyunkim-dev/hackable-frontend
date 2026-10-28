import { withAuth } from "@/utils/authSession";
import { getMypageActivity } from "@/utils/mypage";

// 마이페이지 "내 활동": 북마크한 프로젝트·지원사업·팀빌딩과 내가 쓴 팀빌딩
// 로그인하지 않았거나 로그인이 끝났으면 401
export async function GET() {
  const activity = await withAuth(getMypageActivity);
  return Response.json(
    { activity },
    {
      status: activity ? 200 : 401,
      headers: { "Cache-Control": "private, no-store" },
    },
  );
}
