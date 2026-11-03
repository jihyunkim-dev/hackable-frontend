import type { MetadataRoute } from "next";
import { siteUrl } from "@/configs/urls";

// 검색엔진 수집 규칙. (/robots.txt)
// - 로그인해야 보이는 화면·글쓰기 화면·내부 API·블로그 관리자/검색 화면은 수집하지 않는다.
// - Vercel 미리보기 배포(VERCEL_ENV=preview)는 운영 사이트와 내용이 겹치므로 전부 막는다.
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      // 워드프레스 화면 기능이 쓰는 주소라 관리자 경로 중 이것만 연다.
      allow: ["/", "/blog/wp-admin/admin-ajax.php"],
      // TODO: /mypage·/teambuilding/create·/teambuilding/*/edit는 noindex(페이지 메타)가 먼저 수집되도록 잠시 열어 둔다.
      // 서치콘솔에서 색인 삭제가 끝나면 다시 막는다.
      disallow: [
        "/api/",
        "/auth/",
        "/newsletter/unsubscribe",
        // 블로그(워드프레스) 관리자 화면·검색 결과
        "/blog/wp-admin/",
        "/blog/?s=",
        "/blog/search/",
      ],
    },
    // 우리 사이트맵(app/sitemap.ts)과 블로그(워드프레스) 사이트맵
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/blog/sitemap_index.xml`],
    host: siteUrl,
  };
}
