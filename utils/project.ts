// API 프로젝트 응답을 화면용 데이터로 바꾼다.
import { cacheLife } from "next/cache";
import sanitizeHtml from "sanitize-html";
import type { ProjectItem } from "@/components/section/ProjectCard";
import type { ProjectDetail } from "@/components/section/ProjectDetailSection";
import { projectDetailPath } from "@/configs/contents/project";
import { placeholderImageUrl } from "@/configs/urls";
import {
  RequestProjectDetail,
  type ProjectDetailResponse,
  type ProjectListItemResponse,
} from "@/utils/requestToSrv";

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 한국 시간 기준 날짜 번호 (자정이 지나면 하루가 바뀐다)
const toKstDay = (time: number) => Math.floor((time + KST_OFFSET_MS) / DAY_MS);

// 서버 날짜는 시간대 표기가 없는 한국 시간이다.
const parseKstDate = (value: string) => new Date(`${value}+09:00`).getTime();

// 마감일까지 남은 날: D-3 / D-Day / 마감, 마감일이 없으면 상시
export function formatDDay(endDate: string | null, now: number): string {
  if (!endDate) return "상시";
  const diff = toKstDay(parseKstDate(endDate)) - toKstDay(now);
  if (diff < 0) return "마감";
  return diff === 0 ? "D-Day" : `D-${diff}`;
}

// 2026-10-26T00:00:00 → 2026.10.26
const formatDate = (value: string) => value.slice(0, 10).replaceAll("-", ".");

// 접수 기간: 2026.10.26 ~ 2026.12.05
export function formatPeriod(start: string | null, end: string | null): string {
  if (!start && !end) return "상시";
  return `${start ? formatDate(start) : ""} ~ ${end ? formatDate(end) : ""}`.trim();
}

// 상세 경로: /project/ai-hackathon/1017-jekkeoton-...
export function getProjectHref(project: ProjectListItemResponse): string {
  // 목록에 없는 새 카테고리가 오면 해커톤 경로로 보낸다.
  const basePath =
    (project.category && projectDetailPath[project.category]) ||
    projectDetailPath.hackathon;
  const slug = project.seo_url ?? String(project.project_id);
  return `${basePath}/${slug}`;
}

// URL의 [id](= seo_url 또는 숫자)에서 앞 숫자만 꺼낸다. 없으면 null
export function parseSlugId(slug: string): number | null {
  const id = Number.parseInt(slug, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// 외부에서 수집한 본문 HTML이라 허용한 태그·속성만 남긴다.
export const sanitizeBody = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });

export function toProjectDetail(
  project: ProjectDetailResponse,
  now: number,
): ProjectDetail {
  return {
    id: String(project.project_id),
    title: project.title,
    host: project.hosted ?? "",
    period: formatPeriod(project.start_date, project.end_date),
    dDay: formatDDay(project.end_date, now),
    views: project.view_count,
    thumbnail: project.thumbnail_img || placeholderImageUrl.thumbnail,
    bodyHtml: sanitizeBody(project.description ?? ""),
    applyUrl: project.external_url,
    href: getProjectHref(project),
  };
}

// 상세 데이터를 1분간 캐시한다. (generateMetadata와 화면이 같은 결과를 쓴다)
export async function getProjectDetail(
  slug: string,
): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("minutes");

  const id = parseSlugId(slug);
  if (!id) return null;

  const data = await RequestProjectDetail(id);
  return data ? toProjectDetail(data, Date.now()) : null;
}

export function toProjectItem(
  project: ProjectListItemResponse,
  now: number,
): ProjectItem {
  return {
    id: String(project.project_id),
    title: project.title,
    thumbnail: project.thumbnail_img || null,
    dDay: formatDDay(project.end_date, now),
    prizeLabel: "시상규모",
    prize: project.prize ?? "미정",
    href: getProjectHref(project),
  };
}

// 메타 설명용: HTML 태그를 빼고 앞부분만 자른다.
export function toSummary(html: string, length = 150): string {
  // 문단·줄바꿈 경계에 공백을 넣어 글자가 붙지 않게 한다.
  const spaced = html.replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, " ");
  const text = sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
