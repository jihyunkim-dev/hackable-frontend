// 메인 화면 데이터. (해커톤·공모전·지원사업 탭)
import { cacheLife, cacheTag } from "next/cache";
import type { ProjectItem } from "@/components/section/ProjectCard";
import type { OpportunityTabValue } from "@/configs/contents/main";
import { projectApiCategories } from "@/configs/contents/project";
import { findHostLogos, toGrantItem } from "@/utils/grant";
import { toProjectItem } from "@/utils/project";
import { RequestGrantList, RequestProjectList } from "@/utils/requestToSrv";

// 탭마다 보여 줄 카드 수
const MAIN_PROJECT_COUNT = 4;
// 이 중에서 무작위로 고른다. (모집 중인 최신 항목)
const POOL_SIZE = 20;

// 배열을 섞어 앞에서 count개를 고른다. (Fisher–Yates)
function pickRandom<T>(items: T[], count: number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// 탭별로 모집 중인 최신 항목 중 무작위 몇 개를 고른다.
// 고른 결과는 1시간 캐시한다. (방문할 때마다 바뀌지는 않고, 캐시가 갱신될 때 새로 섞인다)
// 프로젝트·지원사업 캐시 이름표도 붙여, 새 공고가 들어와 그 캐시를 지우면 메인도 같이 바뀐다.
export async function getMainProjects(): Promise<
  Record<OpportunityTabValue, ProjectItem[]>
> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects", "grants");

  const [hackathons, contests, grants] = await Promise.all([
    RequestProjectList({
      category: projectApiCategories.hackathon,
      limit: POOL_SIZE,
    }),
    RequestProjectList({
      category: projectApiCategories.contest,
      limit: POOL_SIZE,
    }),
    RequestGrantList({ limit: POOL_SIZE }),
  ]);

  const now = Date.now();
  const pickedGrants = pickRandom(grants?.items ?? [], MAIN_PROJECT_COUNT);
  const hostLogoOf = await findHostLogos(pickedGrants);

  return {
    hackathon: pickRandom(hackathons?.items ?? [], MAIN_PROJECT_COUNT).map(
      (project) => toProjectItem(project, now),
    ),
    contest: pickRandom(contests?.items ?? [], MAIN_PROJECT_COUNT).map(
      (project) => toProjectItem(project, now),
    ),
    support: pickedGrants.map((grant) =>
      toGrantItem(grant, now, hostLogoOf(grant.hosted)),
    ),
  };
}
