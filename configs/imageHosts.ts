// API 이미지(썸네일)를 받아올 수 있는 외부 호스트. next.config의 images.remotePatterns와 화면 검사에 함께 쓴다.
// 수집 사이트가 늘어나면 여기에 추가한다. ("*."은 하위 도메인 전체)
export const remoteImageHosts = [
  // 해커블 자체 CDN (프로젝트·클립 썸네일)
  "cdn.hackable.co.kr",
  "www.thinkcontest.com",
  "cdn.allforyoung.com",
  "s3.ap-northeast-2.amazonaws.com",
  "*.s3.ap-northeast-2.amazonaws.com",
  // 클립 썸네일 (Cloudflare R2 공개 버킷). r2.dev 전체가 아니라 우리 버킷 주소만 허용한다.
  "pub-e2dabf394b6749bf8115e9a86559eaf3.r2.dev",
  // 카카오 프로필 이미지 (k.kakaocdn.net, img1.kakaocdn.net 등)
  "*.kakaocdn.net",
];

// next/image는 허용하지 않은 호스트의 이미지를 받으면 에러를 내므로, 쓰기 전에 확인한다.
export function isAllowedImageUrl(
  value: string | null | undefined,
): value is string {
  if (!value) return false;
  try {
    const { protocol, hostname } = new URL(value);
    if (protocol !== "https:") return false;
    return remoteImageHosts.some((host) =>
      host.startsWith("*.")
        ? hostname.endsWith(host.slice(1))
        : hostname === host,
    );
  } catch {
    return false;
  }
}
