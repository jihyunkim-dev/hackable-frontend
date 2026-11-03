import type { NextConfig } from "next";
import { remoteImageHosts } from "./configs/imageHosts";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // /blog/ 끝 슬래시를 리다이렉트로 지우지 않고 proxy가 원래 경로를 보게 한다. (블로그 프록시용)
  skipTrailingSlashRedirect: true,
  skipProxyUrlNormalize: true,
  images: {
    // 배너처럼 글자가 많은 이미지는 90으로 압축해 글자 깨짐을 막는다. (기본 75)
    qualities: [75, 90],
    // AVIF를 먼저 써서 같은 화질에서 용량을 줄인다.
    formats: ["image/avif", "image/webp"],
    // API 썸네일 이미지 출처 (configs/imageHosts.ts에서 관리)
    remotePatterns: remoteImageHosts.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  partialPrefetching: true,
  // 상세 페이지 메타데이터(title·canonical·og)는 데이터를 기다려 본문 뒤에 따라붙는다(스트리밍).
  // 아래 크롤러에게는 기다렸다가 <head>에 넣어 보낸다. 지정하면 Next 기본 목록을 덮어쓰므로 기본 목록도 같이 적는다.
  // 기본 목록: node_modules/next/dist/shared/lib/router/utils/html-bots.js
  // 추가: Googlebot, 다음(Daum·Daumoa), 카카오톡 링크 미리보기(kakaotalk-scrap), 줌(ZumBot)
  htmlLimitedBots:
    /Googlebot|Daum|Daumoa|kakaotalk-scrap|ZumBot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i,
  // /newsletter에는 화면이 없어 구독 안내로 보낸다. (정보구조 문서: 302)
  async redirects() {
    return [
      {
        source: "/newsletter",
        destination: "/newsletter/subscribe",
        statusCode: 302,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
