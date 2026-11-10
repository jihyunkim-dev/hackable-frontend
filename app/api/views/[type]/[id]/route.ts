import {
  RequestCountView,
  VIEW_PATHS,
  type ViewTarget,
} from "@/utils/requestToSrv";

// 상세 페이지 방문 한 번을 센다. 예: POST /api/views/project/12
// 응답: { views } (반영 후 조회수). 봇이면 세지 않고 204
// 화면은 캐시된 상세 데이터를 쓰고, 조회수는 브라우저가 이 경로로 따로 알린다. (components/ui/ViewCount)

// 검색엔진·미리보기·성능 측정 도구는 세지 않는다.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|yeti|daum|lighthouse|headless|preview|scrap|facebookexternalhit|embedly|whatsapp|kakaotalk-scrap/i;

const isViewTarget = (type: string): type is ViewTarget =>
  Object.hasOwn(VIEW_PATHS, type);

type Context = { params: Promise<{ type: string; id: string }> };

export async function POST(request: Request, context: Context) {
  const { type, id } = await context.params;
  const itemId = Number(id);
  if (!isViewTarget(type) || !Number.isInteger(itemId) || itemId <= 0) {
    return new Response(null, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent");
  if (!userAgent || BOT_PATTERN.test(userAgent)) {
    return new Response(null, { status: 204 });
  }

  // Vercel이 x-forwarded-for 맨 앞에 실제 방문자 IP를 넣는다.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const views = await RequestCountView(type, itemId, { ip, userAgent });
  if (views === null) return new Response(null, { status: 502 });
  return Response.json({ views });
}
