import { RequestNewsletterUnsubscribe } from "@/utils/requestToSrv";

// 뉴스레터 수신 거부: 메일 링크의 토큰만 백엔드로 넘긴다. (브라우저에 API 주소를 드러내지 않는다)
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  if (!token) return Response.json({ result: "invalid" }, { status: 400 });

  const result = await RequestNewsletterUnsubscribe(token);
  if (!result) return new Response(null, { status: 502 });
  return Response.json({ result }, { status: result === "ok" ? 200 : 404 });
}
