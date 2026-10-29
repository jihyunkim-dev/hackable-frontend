// 마이페이지 "내 활동" 데이터. Route Handler(app/api/mypage)에서 로그인 토큰으로 받아 화면용 카드 데이터로 바꾼다.
import type { ClipItem } from "@/components/section/ClipCard";
import type { ProjectItem } from "@/components/section/ProjectCard";
import type { TeamBuildingItem } from "@/components/section/TeamBuildingCard";
import { projectApiCategories } from "@/configs/contents/project";
import { toClipItem } from "@/utils/clip";
import { findHostLogos, toGrantItem } from "@/utils/grant";
import { toProjectItem } from "@/utils/project";
import {
  RequestMyClipBookmarks,
  RequestMyGrantBookmarks,
  RequestMyProjectBookmarks,
  RequestMyTeambuildingBookmarks,
  RequestMyTeambuildings,
} from "@/utils/requestToSrv";
import { toTeamBuildingItem } from "@/utils/teamBuilding";

export interface MypageActivity {
  bookmarkedProjects: Record<
    "hackathon" | "contest" | "support",
    ProjectItem[]
  >;
  bookmarkedTeamBuildings: TeamBuildingItem[];
  writtenTeamBuildings: TeamBuildingItem[];
  bookmarkedClips: ClipItem[];
}

// 마이페이지에는 페이지 나눔이 없어 서버 최대치(100개)까지 한 번에 받는다.
const BOOKMARK_LIMIT = 100;

// 다섯 목록을 같은 토큰으로 한 번에 받는다.
// 따로 요청하면 토큰이 만료됐을 때 재발급이 겹쳐 로그인이 끊길 수 있다. (utils/authSession withAuth)
// 토큰이 만료되면 모두 실패하므로, 모두 실패했을 때만 null을 돌려 재발급을 시도하게 한다.
export async function getMypageActivity(
  token: string,
): Promise<MypageActivity | null> {
  const [projects, grants, bookmarkedPosts, writtenPosts, clips] =
    await Promise.all([
      RequestMyProjectBookmarks(token, { limit: BOOKMARK_LIMIT }),
      RequestMyGrantBookmarks(token, { limit: BOOKMARK_LIMIT }),
      RequestMyTeambuildingBookmarks(token, { limit: BOOKMARK_LIMIT }),
      RequestMyTeambuildings(token),
      RequestMyClipBookmarks(token, { limit: BOOKMARK_LIMIT }),
    ]);
  if (!projects && !grants && !bookmarkedPosts && !writtenPosts && !clips) {
    return null;
  }

  const now = Date.now();
  const projectItems = projects?.items ?? [];
  const grantItems = grants?.items ?? [];
  const hackathonCategories: (string | null)[] = projectApiCategories.hackathon;
  const getHostLogo = await findHostLogos(grantItems);

  return {
    bookmarkedProjects: {
      hackathon: projectItems
        .filter((project) => hackathonCategories.includes(project.category))
        .map((project) => toProjectItem(project, now)),
      // 해커톤이 아닌 프로젝트(AI 공모전·창업경진대회)는 공모전 탭에 모은다.
      contest: projectItems
        .filter((project) => !hackathonCategories.includes(project.category))
        .map((project) => toProjectItem(project, now)),
      support: grantItems.map((grant) =>
        toGrantItem(grant, now, getHostLogo(grant.hosted)),
      ),
    },
    bookmarkedTeamBuildings: (bookmarkedPosts?.items ?? []).map((post) =>
      toTeamBuildingItem(post, now),
    ),
    writtenTeamBuildings: (writtenPosts ?? []).map((post) =>
      toTeamBuildingItem(post, now),
    ),
    bookmarkedClips: (clips?.items ?? []).map(toClipItem),
  };
}
