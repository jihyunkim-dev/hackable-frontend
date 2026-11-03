// 페이지 메타데이터(검색 제목·설명, 공유 미리보기)를 같은 모양으로 만든다.
// 문구는 configs/contents/seo, 절대 주소는 app/layout의 metadataBase(configs/urls의 siteUrl)로 붙는다.
import type { Metadata } from "next";
import { siteName } from "@/configs/contents/seo";
import ogImage from "@/public/images/og-image.jpg";

interface PageMetaInput {
  title: string;
  description: string;
  // 정식 주소 (canonical, og:url)
  path?: string;
  // true면 검색 결과에 내보내지 않는다.
  noindex?: boolean;
}

// 카톡·SNS 공유 미리보기 이미지 (1200×630). 모든 페이지가 같이 쓴다.
// 파일을 불러와 쓰면 주소에 내용 해시가 붙어, 이미지를 바꿨을 때 예전 미리보기가 남지 않는다.
const SHARE_IMAGE = {
  url: ogImage.src,
  width: ogImage.width,
  height: ogImage.height,
  alt: `${siteName} - 누구나 도전하는 해커톤 플랫폼`,
};

// 하위 페이지의 openGraph는 부모 값과 합쳐지지 않고 통째로 바뀌므로, 공통 값도 매번 같이 넣는다.
export function pageMetadata({
  title,
  description,
  path,
  noindex,
}: PageMetaInput): Metadata {
  return {
    title: { absolute: title },
    description,
    ...(path && { alternates: { canonical: path } }),
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName,
      title,
      description,
      ...(path && { url: path }),
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SHARE_IMAGE],
    },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}

// 상세 페이지 제목: {원문 이름} | 해커블
export const detailTitle = (name: string) => `${name} | ${siteName}`;

// 마감일: 2026.11.08 마감 / 마감일이 없으면 상시 모집
// (utils/project의 formatDate와 같은 모양. 그 파일이 이 파일을 불러오므로 서로 불러오지 않게 따로 둔다)
const deadlineText = (endDate: string | null) =>
  endDate ? `${endDate.slice(0, 10).replaceAll("-", ".")} 마감` : "상시 모집";

const joinWords = (...words: (string | null | undefined)[]) =>
  words.filter(Boolean).join(" ");

// 대회 상세: {주최} {대회명} 모집 요강. {마감일} 마감, 참가 자격·상금·일정과 이 대회 팀원 모집 글을 확인하세요.
export function projectMetaDescription(project: {
  title: string;
  hosted: string | null;
  end_date: string | null;
}) {
  return `${joinWords(project.hosted, project.title)} 모집 요강. ${deadlineText(project.end_date)}, 참가 자격·상금·일정과 이 대회 팀원 모집 글을 확인하세요.`;
}

// 지원사업 상세: {주관기관} {공고명}. {마감일} 마감, 지원 내용({혜택}), 신청 대상, 신청 방법을 확인하세요.
// 혜택 값이 없는 공고가 많아, 없으면 괄호를 뺀다.
export function grantMetaDescription(grant: {
  title: string;
  hosted: string | null;
  end_date: string | null;
  prize: string | null;
}) {
  const support = grant.prize ? `지원 내용(${grant.prize})` : "지원 내용";
  return `${joinWords(grant.hosted, grant.title)}. ${deadlineText(grant.end_date)}, ${support}, 신청 대상, 신청 방법을 확인하세요.`;
}

// 팀빌딩 본문에서 앞부분만 쓰는 글자 수
const TEAMBUILDING_BODY_LENGTH = 60;

// 팀빌딩 상세: {모집 역할} 모집 중. {본문 앞 60자}
// 포지션을 고르지 않은 글은 "팀원", 마감된 글은 "모집 마감"으로 쓴다.
export function teamBuildingMetaDescription(post: {
  position: string;
  isOpen: boolean;
  body: string;
}) {
  const role = post.position || "팀원";
  const body = post.body.replace(/\s+/g, " ").trim();
  const excerpt =
    body.length > TEAMBUILDING_BODY_LENGTH
      ? `${body.slice(0, TEAMBUILDING_BODY_LENGTH)}…`
      : body;
  return joinWords(
    `${role} ${post.isOpen ? "모집 중" : "모집 마감"}.`,
    excerpt,
  );
}
