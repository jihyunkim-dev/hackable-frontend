// API 프로젝트 응답을 화면용 데이터로 바꾼다.
import { cacheLife, cacheTag } from "next/cache";
import sanitizeHtml from "sanitize-html";
import type { ProjectItem } from "@/components/section/ProjectCard";
import type { ProjectDetail } from "@/components/section/ProjectDetailSection";
import {
  projectApiCategories,
  projectContent,
  projectDetailPath,
  type ProjectCategory,
} from "@/configs/contents/project";
import { isAllowedImageUrl } from "@/configs/imageHosts";
import { placeholderImageUrl } from "@/configs/urls";
import { getPagination, PAGE_SIZE, toSkip } from "@/utils/pagination";
import {
  RequestProjectDetail,
  RequestProjectList,
  RequestSearchProjects,
  type ListSort,
  type ProjectSearchDocument,
  type ProjectDetailResponse,
  type ProjectListItemResponse,
} from "@/utils/requestToSrv";

// 서버 캐시 이름표. 새 데이터가 들어오면 revalidateTag("projects")로 이 캐시만 지운다.
const CACHE_TAG = "projects";

const HACKATHON_PATH =
  projectContent.categories.find((category) => category.value === "hackathon")
    ?.href ?? "/project/ai-hackathon";

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
export const formatDate = (value: string) => value.slice(0, 10).replaceAll("-", ".");

// 접수 기간: 2026.10.26 ~ 2026.12.05
export function formatPeriod(start: string | null, end: string | null): string {
  if (!start && !end) return "상시";
  return `${start ? formatDate(start) : ""} ~ ${end ? formatDate(end) : ""}`.trim();
}

// 상세 경로: /project/ai-hackathon/1017-jekkeoton-...
// 카드·상세 경로에 필요한 필드만 받는다. (목록 응답과 검색 결과를 같이 쓴다)
type ProjectCardSource = Pick<
  ProjectListItemResponse,
  "project_id" | "category" | "title" | "end_date" | "thumbnail_img" | "seo_url"
> & { prize?: string | null };

export function getProjectHref(
  project: Pick<ProjectCardSource, "project_id" | "category" | "seo_url">,
): string {
  // 목록에 없는 새 카테고리가 오면 해커톤 경로로 보낸다.
  const basePath =
    (project.category && projectDetailPath[project.category]) ||
    HACKATHON_PATH;
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
    thumbnail: isAllowedImageUrl(project.thumbnail_img)
      ? project.thumbnail_img
      : placeholderImageUrl.thumbnail,
    bodyHtml: sanitizeBody(project.description ?? ""),
    applyUrl: project.external_url,
    href: getProjectHref(project),
  };
}

// 상세 데이터를 1시간 캐시한다. (generateMetadata와 화면이 같은 결과를 쓴다)
export async function getProjectDetail(
  slug: string,
): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG);

  const id = parseSlugId(slug);
  if (!id) return null;

  const data = await RequestProjectDetail(id);
  return data ? toProjectDetail(data, Date.now()) : null;
}

export function toProjectItem(
  project: ProjectCardSource,
  now: number,
): ProjectItem {
  return {
    id: String(project.project_id),
    title: project.title,
    thumbnail: isAllowedImageUrl(project.thumbnail_img)
      ? project.thumbnail_img
      : null,
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

// 검색 결과 문서를 카드용 형태로 맞춘다. (id가 문자열로 온다)
const fromSearchDocument = (
  document: ProjectSearchDocument,
): ProjectCardSource => ({ ...document, project_id: Number(document.id) });

// 페이지별 목록을 1시간 캐시한다. (미리 렌더링되는 1페이지 화면도 이 결과를 쓴다)
// category가 all이면 세분류를 보내지 않아 기본 목록 전부를 받는다.
// 검색어(q)가 있으면 검색 API를 쓴다. 검색은 관련도 순이라 정렬(sort)은 반영되지 않는다.
export async function getProjectPage(
  page: number,
  category: ProjectCategory = "all",
  sort: ListSort = "latest",
  q = "",
) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG);

  const categories =
    category === "all" ? undefined : projectApiCategories[category];

  if (q) {
    const result = await RequestSearchProjects({
      q,
      category: categories,
      page,
      per_page: PAGE_SIZE.project,
    });
    const now = Date.now();
    return {
      items: (result?.hits ?? []).map((hit) =>
        toProjectItem(fromSearchDocument(hit.document), now),
      ),
      pagination: getPagination(result?.found ?? 0, page, PAGE_SIZE.project),
    };
  }

  const data = await RequestProjectList({
    skip: toSkip(page, PAGE_SIZE.project),
    limit: PAGE_SIZE.project,
    category: categories,
    sort,
  });
  const now = Date.now();

  return {
    items: (data?.items ?? []).map((project) => toProjectItem(project, now)),
    pagination: getPagination(data?.total_count ?? 0, page, PAGE_SIZE.project),
  };
}
