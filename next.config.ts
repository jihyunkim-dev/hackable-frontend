import type { NextConfig } from "next";

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
    // API 썸네일 이미지 출처 (수집 사이트가 늘어나면 추가)
    remotePatterns: [
      { protocol: "https", hostname: "www.thinkcontest.com" },
      { protocol: "https", hostname: "cdn.allforyoung.com" },
      { protocol: "https", hostname: "s3.ap-northeast-2.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.ap-northeast-2.amazonaws.com" },
    ],
  },
  partialPrefetching: true,
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
