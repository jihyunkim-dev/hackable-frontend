// 사이트맵(/sitemap.xml) 항목을 만든다. (app/sitemap.ts)
// - lastmod: 상세는 글의 updated_at, 목록·메인은 그 안의 글 중 가장 최근 updated_at
// - 날짜를 알 수 없는 페이지(구독 안내·약관)는 lastmod를 넣지 않는다. (지어낸 날짜를 넣지 않는다)
// - 페이지와 같은 캐시 이름표를 붙여, 글이 바뀌어 캐시가 지워지면 사이트맵도 새로 만든다.
import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { projectContent } from "@/configs/contents/project";
import { seoContent } from "@/configs/contents/seo";
import { siteUrl } from "@/configs/urls";
import { getClipHref } from "@/utils/clip";
import { getGrantHref } from "@/utils/grant";
import { getNewsletterArchive } from "@/utils/newsletterArchive";
import { getProjectHref, parseKstDate } from "@/utils/project";
import {
  RequestClipList,
  RequestGrantList,
  RequestProjectList,
  type ClipResponse,
  type GrantListItemResponse,
  type ProjectListItemResponse,
} from "@/utils/requestToSrv";
import {
  fetchAllTeamBuildings,
  TEAMBUILDING_CACHE_TAG,
} from "@/utils/teamBuilding";

// 한 번에 받는 글 수 (서버 최대 100)
const FETCH_CHUNK = 100;
// 마감된 대회·지원사업은 마감 후 이 기간까지만 넣는다.
const CLOSED_KEEP_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

type SitemapEntry = MetadataRoute.Sitemap[number];

// 대회·클립 수정 시각은 시간대 없이 오지만 UTC 기준이다.
const toDate = (value: string) =>
  new Date(/[Z+]/.test(value.slice(19)) ? value : `${value}Z`);
// 팀빌딩·지원사업 시각과 대회·지원사업 마감일은 한국 시간이다.
const toKstDate = (value: string) => new Date(parseKstDate(value));

const latest = (values: Date[]) =>
  values.length
    ? new Date(Math.max(...values.map((value) => value.getTime())))
    : undefined;

const entry = (path: string, lastModified?: Date): SitemapEntry => ({
  url: new URL(path, siteUrl).toString(),
  ...(lastModified && { lastModified }),
});

// 마감일이 없거나, 마감 후 CLOSED_KEEP_DAYS가 지나지 않았으면 넣는다.
const isRecent = (endDate: string | null, now: number) =>
  !endDate || parseKstDate(endDate) >= now - CLOSED_KEEP_DAYS * DAY_MS;

// 마감 포함 전체 대회를 받는다. (마감 후 오래된 공고는 뺀다)
async function fetchProjects(now: number) {
  const projects: ProjectListItemResponse[] = [];
  for (let skip = 0; ; skip += FETCH_CHUNK) {
    const data = await RequestProjectList({
      skip,
      limit: FETCH_CHUNK,
      status: "all",
    });
    const items = data?.items ?? [];
    projects.push(...items);
    if (items.length < FETCH_CHUNK) break;
  }
  return projects.filter((project) => isRecent(project.end_date, now));
}

// 마감 포함 전체 지원사업을 받는다. (마감 후 오래된 공고는 뺀다)
async function fetchGrants(now: number) {
  const grants: GrantListItemResponse[] = [];
  for (let skip = 0; ; skip += FETCH_CHUNK) {
    const data = await RequestGrantList({
      skip,
      limit: FETCH_CHUNK,
      status: "all",
    });
    const items = data?.items ?? [];
    grants.push(...items);
    if (items.length < FETCH_CHUNK) break;
  }
  return grants.filter((grant) => isRecent(grant.end_date, now));
}

async function fetchClips() {
  const clips: ClipResponse[] = [];
  for (let skip = 0; ; skip += FETCH_CHUNK) {
    const chunk = (await RequestClipList({ skip, limit: FETCH_CHUNK })) ?? [];
    clips.push(...chunk);
    if (chunk.length < FETCH_CHUNK) return clips;
  }
}

// 1시간 캐시한다. (대회·지원사업·클립 목록과 같은 주기) 팀빌딩 글을 쓰거나 고치면 바로 새로 만든다.
export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects", "grants", "clips", "newsletter", TEAMBUILDING_CACHE_TAG);

  const now = Date.now();
  const [projects, grants, clips, teamBuildings, newsletters] =
    await Promise.all([
      fetchProjects(now),
      fetchGrants(now),
      fetchClips(),
      fetchAllTeamBuildings("latest"),
      getNewsletterArchive(),
    ]);

  const projectEntries = projects.map((project) => ({
    href: getProjectHref(project),
    updatedAt: toDate(project.updated_at),
  }));

  // 대회 카테고리 목록(/project/ai-hackathon …): 그 카테고리 상세 글 중 가장 최근 수정 시각
  const projectHubs = projectContent.categories.map((category) => {
    const items =
      category.value === "all"
        ? projectEntries
        : projectEntries.filter((item) =>
            item.href.startsWith(`${category.href}/`),
          );
    return entry(category.href, latest(items.map((item) => item.updatedAt)));
  });

  const grantUpdatedAt = grants.map((grant) => toKstDate(grant.updated_at));
  const clipUpdatedAt = clips.map((clip) => toDate(clip.updated_at));
  const teamBuildingUpdatedAt = teamBuildings.map((post) =>
    toKstDate(post.updated_at),
  );
  // 지난 뉴스레터는 발송 후 바뀌지 않아 발송일을 수정일로 쓴다.
  const newsletterPublishedAt = newsletters.map((item) =>
    toKstDate(`${item.publishedAt}T08:00:00`),
  );

  return [
    entry(
      seoContent.home.path,
      latest([
        ...projectEntries.map((item) => item.updatedAt),
        ...grantUpdatedAt,
        ...clipUpdatedAt,
        ...teamBuildingUpdatedAt,
      ]),
    ),
    ...projectHubs,
    entry(seoContent.startupSupport.path, latest(grantUpdatedAt)),
    entry(seoContent.teamBuilding.path, latest(teamBuildingUpdatedAt)),
    entry(seoContent.clip.path, latest(clipUpdatedAt)),
    // 구독 페이지 아래에 지난 뉴스레터 목록이 있어 최신 호 발송일이 바뀐 날이다.
    entry(seoContent.subscribe.path, latest(newsletterPublishedAt)),
    entry(seoContent.terms.path),
    entry(seoContent.privacy.path),
    ...projectEntries.map((item) => entry(item.href, item.updatedAt)),
    ...grants.map((grant, index) =>
      entry(getGrantHref(grant), grantUpdatedAt[index]),
    ),
    ...teamBuildings.map((post, index) =>
      entry(
        `/teambuilding/${post.teambuilding_id}`,
        teamBuildingUpdatedAt[index],
      ),
    ),
    ...clips.map((clip, index) =>
      entry(getClipHref(clip), clipUpdatedAt[index]),
    ),
    ...newsletters.map((item, index) =>
      entry(item.href, newsletterPublishedAt[index]),
    ),
  ];
}
