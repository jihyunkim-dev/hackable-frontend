import { NextRequest, NextResponse } from "next/server";

// /blog 경로를 블로그 서버(BLOG_ORIGIN)로 경로 그대로 프록시한다.
export function proxy(req: NextRequest) {
  const incoming = new URL(req.url);
  const origin = process.env.BLOG_ORIGIN;

  if (!origin) {
    return new NextResponse("BLOG_ORIGIN is not configured", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const destination = new URL(origin);
  destination.pathname = incoming.pathname;
  destination.search = incoming.search;

  // Preview 진단용: query, cookie 등은 기록하지 않습니다.
  console.log("[blog-proxy]", {
    inputPath: incoming.pathname,
    destinationPath: destination.pathname,
  });

  const response = NextResponse.rewrite(destination);
  response.headers.set("X-Blog-Router", "preserve-slash-v1");

  return response;
}

export const config = {
  matcher: ["/blog/:path*"],
};
