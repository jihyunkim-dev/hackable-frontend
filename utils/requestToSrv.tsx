// 끝에 /가 붙어 있어도 //경로가 되지 않도록 제거한다.
const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

// ===== 공통 =====

// 422 검증 오류는 배열, 그 외 서버 오류는 문자열로 온다. (예: "Search engine error")
export interface ApiError {
  detail:
    | {
        loc: (string | number)[];
        msg: string;
        type: string;
        input?: unknown;
        ctx?: Record<string, unknown>;
      }[]
    | string;
}

export interface BookmarkResponse {
  is_bookmarked: boolean;
  bookmark_count: number;
}

interface PagingQuery {
  skip?: number;
  limit?: number; // 서버 최대 100
}

// undefined/null 값은 빼고 쿼리스트링을 만든다.
const toQuery = (
  params: Record<string, string | number | null | undefined>,
): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const result = query.toString();
  return result ? `?${result}` : "";
};

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

// 로그인이 필요한 요청에서 토큰이 만료·무효(401)일 때 던진다.
// 다른 실패(잘못된 입력 등)는 지금처럼 null/false로 돌려주고, 401만 이 에러로 구분해
// withAuth(utils/authSession)가 그때만 토큰을 재발급해 다시 시도하게 한다.
export class AuthExpiredError extends Error {
  constructor() {
    super("access token expired");
    this.name = "AuthExpiredError";
  }
}

const throwIfUnauthorized = (res: Response) => {
  if (res.status === 401) throw new AuthExpiredError();
};

// ===== Project (해커톤·공모전·창업경진대회) =====

// 세분류. tech_competition·idea_contest는 category를 생략한 기본 목록에서 빠진다.
export type ProjectCategoryValue =
  | "hackathon"
  | "ai_challenge"
  | "ai_competition"
  | "ai_contest"
  | "ai_image"
  | "ai_video"
  | "competition"
  | "idea_competition"
  | "space_competition"
  | "startup_competition"
  | "tech_competition"
  | "idea_contest";

export type RecruitStatus = "upcoming" | "open" | "closed";

// 목록 정렬: latest(최신순) | deadline(마감 임박순). 프로젝트·지원사업·팀빌딩 공통
export type ListSort = "latest" | "deadline";

export interface ProjectListItemResponse {
  project_id: number;
  category: ProjectCategoryValue | null;
  title: string;
  hosted: string | null;
  status: RecruitStatus | null;
  start_date: string | null;
  end_date: string | null;
  prize: string | null;
  prize_amount: number | null;
  thumbnail_img: string | null;
  seo_url: string | null;
  view_count: number;
  bookmark_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetailResponse extends ProjectListItemResponse {
  description: string | null; // HTML
  external_url: string | null;
}

export interface ProjectListResponse {
  total_count: number;
  items: ProjectListItemResponse[];
}

export interface ProjectListQuery extends PagingQuery {
  // 여러 개면 쉼표로 이어 보낸다. 생략하면 기본 목록 전부
  category?: ProjectCategoryValue[];
  // 생략하면 마감 전 항목만. all은 마감 포함 전체
  status?: RecruitStatus | "all";
  sort?: ListSort;
}

export const RequestProjectList = async (
  query: ProjectListQuery = {},
): Promise<ProjectListResponse | null> => {
  try {
    const res = await fetch(
      `${url}/project${toQuery({ ...query, category: query.category?.join(",") })}`,
    );

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ProjectList Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("ProjectList Fetch Error", error);
    return null;
  }
};

export const RequestProjectDetail = async (
  projectId: number,
): Promise<ProjectDetailResponse | null> => {
  try {
    const res = await fetch(`${url}/project/${projectId}`);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ProjectDetail Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("ProjectDetail Fetch Error", error);
    return null;
  }
};

export const RequestProjectBookmark = async (
  projectId: number,
  isBookmarked: boolean,
  token: string,
): Promise<BookmarkResponse | null> => {
  try {
    const res = await fetch(`${url}/project/${projectId}/bookmark`, {
      method: isBookmarked ? "DELETE" : "POST",
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ProjectBookmark Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("ProjectBookmark Fetch Error", error);
    return null;
  }
};

// 내가 북마크한 프로젝트 (북마크한 최신순)
// TODO: 문서에 응답 형식이 비어 있다. 다른 목록과 같은 { total_count, items }로 본다.
export const RequestMyProjectBookmarks = async (
  token: string,
  query: PagingQuery = {},
): Promise<ProjectListResponse | null> => {
  try {
    const res = await fetch(`${url}/project/bookmark${toQuery({ ...query })}`, {
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("MyProjectBookmarks Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("MyProjectBookmarks Fetch Error", error);
    return null;
  }
};

// ===== Startup support (지원사업) =====

export type GrantCategoryValue = "space" | "business";

export interface GrantListItemResponse {
  grant_id: number;
  category: GrantCategoryValue | null;
  title: string;
  hosted: string | null;
  status: RecruitStatus | null;
  start_date: string | null;
  end_date: string | null;
  prize: string | null;
  prize_amount: number | null;
  thumbnail_img: string | null;
  seo_url: string | null;
  view_count: number;
  bookmark_count: number;
  created_at: string;
  updated_at: string;
  region: string | null;
  tags: string[];
  source: string;
  source_id: string;
}

export interface GrantDetailResponse extends GrantListItemResponse {
  description: string | null; // HTML
  external_url: string | null;
}

export interface GrantListResponse {
  total_count: number;
  items: GrantListItemResponse[];
}

export interface GrantListQuery extends PagingQuery {
  category?: GrantCategoryValue | null;
  region?: string | null;
  status?: RecruitStatus | null;
  sort?: ListSort;
}

export const RequestGrantList = async (
  query: GrantListQuery = {},
): Promise<GrantListResponse | null> => {
  try {
    const res = await fetch(`${url}/startup-support${toQuery({ ...query })}`);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("GrantList Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("GrantList Fetch Error", error);
    return null;
  }
};

export const RequestGrantDetail = async (
  grantId: number,
): Promise<GrantDetailResponse | null> => {
  try {
    const res = await fetch(`${url}/startup-support/${grantId}`);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("GrantDetail Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("GrantDetail Fetch Error", error);
    return null;
  }
};

export const RequestGrantBookmark = async (
  grantId: number,
  isBookmarked: boolean,
  token: string,
): Promise<BookmarkResponse | null> => {
  try {
    const res = await fetch(`${url}/startup-support/${grantId}/bookmark`, {
      method: isBookmarked ? "DELETE" : "POST",
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("GrantBookmark Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("GrantBookmark Fetch Error", error);
    return null;
  }
};

// 내가 북마크한 지원사업 (북마크한 최신순)
export const RequestMyGrantBookmarks = async (
  token: string,
  query: PagingQuery = {},
): Promise<GrantListResponse | null> => {
  try {
    const res = await fetch(
      `${url}/startup-support/bookmark${toQuery({ ...query })}`,
      {
        headers: authHeader(token),
      },
    );

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("MyGrantBookmarks Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("MyGrantBookmarks Fetch Error", error);
    return null;
  }
};

// ===== Search (검색, Typesense) =====
// 마감된 항목은 나오지 않고, 검색 관련도 순으로 온다. (정렬 파라미터 없음)

export interface SearchResponse<TDocument> {
  found: number; // 전체 결과 수
  page: number;
  out_of: number;
  hits: { document: TDocument }[];
}

export interface ProjectSearchDocument {
  id: string; // project_id (문자열로 옴)
  title: string;
  category: ProjectCategoryValue | null;
  hosted: string | null;
  status: RecruitStatus | null;
  start_date: string | null;
  end_date: string | null;
  thumbnail_img: string | null;
  seo_url: string | null;
  description: string | null;
  // TODO: 백엔드에 추가 요청함. 현재 검색 결과에는 오지 않는다.
  prize?: string | null;
}

export interface GrantSearchDocument {
  id: string; // grant_id (문자열로 옴)
  title: string;
  category: GrantCategoryValue | null;
  hosted: string | null;
  status: RecruitStatus | null;
  start_date: string | null;
  end_date: string | null;
  thumbnail_img: string | null;
  seo_url: string | null;
  description: string | null;
  region: string | null;
  tags: string[];
  prize?: string | null;
}

interface SearchQuery {
  q: string;
  page?: number;
  per_page?: number;
}

export interface ProjectSearchQuery extends SearchQuery {
  // 여러 개면 쉼표로 이어 보낸다. 생략하면 /project 기본 목록 전부
  category?: ProjectCategoryValue[];
}

export interface GrantSearchQuery extends SearchQuery {
  category?: GrantCategoryValue[];
}

export const RequestSearchProjects = async (
  query: ProjectSearchQuery,
): Promise<SearchResponse<ProjectSearchDocument> | null> => {
  try {
    const res = await fetch(
      `${url}/search/projects${toQuery({ ...query, category: query.category?.join(",") })}`,
    );

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("SearchProjects Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("SearchProjects Fetch Error", error);
    return null;
  }
};

export const RequestSearchGrants = async (
  query: GrantSearchQuery,
): Promise<SearchResponse<GrantSearchDocument> | null> => {
  try {
    const res = await fetch(
      `${url}/search/startup-support${toQuery({ ...query, category: query.category?.join(",") })}`,
    );

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("SearchGrants Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("SearchGrants Fetch Error", error);
    return null;
  }
};

// ===== Teambuilding (팀빌딩) =====

export interface TeambuildingRequest {
  title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  thumbnail_img?: string | null;
  status?: string | null;
  // 프로젝트/스터디 구분. 값은 프론트가 정한다. (utils/teamBuildingForm의 TEAMBUILDING_CATEGORIES)
  category?: string | null;
  tags?: string[] | null;
  position?: string[] | null;
}

export type TeambuildingUpdateRequest = Partial<TeambuildingRequest>;

export interface TeambuildingResponse {
  teambuilding_id: number;
  author_id: number;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  thumbnail_img: string | null;
  status: string | null;
  // 카테고리가 생기기 전에 쓴 글은 null
  category: string | null;
  tags: string[] | null;
  position: string[] | null;
  view_count: number;
  bookmark_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeambuildingListQuery extends PagingQuery {
  sort?: ListSort;
  // 생략하면 전체
  category?: string;
}

export const RequestTeambuildingList = async (
  query: TeambuildingListQuery = {},
): Promise<TeambuildingResponse[] | null> => {
  try {
    const res = await fetch(`${url}/teambuildings/${toQuery({ ...query })}`);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("TeambuildingList Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("TeambuildingList Fetch Error", error);
    return null;
  }
};

export const RequestTeambuildingDetail = async (
  teambuildingId: number,
): Promise<TeambuildingResponse | null> => {
  try {
    const res = await fetch(`${url}/teambuildings/${teambuildingId}`);

    // 지운 글·없는 글은 에러가 아니라 "없음"이다. (상세 화면은 404 화면을 보여 준다)
    if (res.status === 404) return null;
    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("TeambuildingDetail Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("TeambuildingDetail Fetch Error", error);
    return null;
  }
};

export const RequestCreateTeambuilding = async (
  body: TeambuildingRequest,
  token: string,
): Promise<TeambuildingResponse | null> => {
  try {
    const res = await fetch(`${url}/teambuildings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify(body),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("CreateTeambuilding Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("CreateTeambuilding Fetch Error", error);
    return null;
  }
};

export const RequestUpdateTeambuilding = async (
  teambuildingId: number,
  body: TeambuildingUpdateRequest,
  token: string,
): Promise<TeambuildingResponse | null> => {
  try {
    const res = await fetch(`${url}/teambuildings/${teambuildingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify(body),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("UpdateTeambuilding Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("UpdateTeambuilding Fetch Error", error);
    return null;
  }
};

// 내가 쓴 팀빌딩 모집글 삭제 (작성자가 아니면 백엔드가 거절한다). 성공: 204
export const RequestDeleteTeambuilding = async (
  teambuildingId: number,
  token: string,
): Promise<boolean> => {
  try {
    const res = await fetch(`${url}/teambuildings/${teambuildingId}`, {
      method: "DELETE",
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("DeleteTeambuilding Error", errorData);
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("DeleteTeambuilding Fetch Error", error);
    return false;
  }
};

export const RequestTeambuildingBookmark = async (
  teambuildingId: number,
  isBookmarked: boolean,
  token: string,
): Promise<BookmarkResponse | null> => {
  try {
    const res = await fetch(`${url}/teambuildings/${teambuildingId}/bookmark`, {
      method: isBookmarked ? "DELETE" : "POST",
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("TeambuildingBookmark Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("TeambuildingBookmark Fetch Error", error);
    return null;
  }
};

// 북마크 목록은 전체 목록과 달리 total_count가 함께 온다.
export interface TeambuildingListResponse {
  total_count: number;
  items: TeambuildingResponse[];
}

// 내가 북마크한 팀빌딩 (북마크한 최신순)
export const RequestMyTeambuildingBookmarks = async (
  token: string,
  query: PagingQuery = {},
): Promise<TeambuildingListResponse | null> => {
  try {
    const res = await fetch(
      `${url}/teambuildings/bookmark${toQuery({ ...query })}`,
      {
        headers: authHeader(token),
      },
    );

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("MyTeambuildingBookmarks Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("MyTeambuildingBookmarks Fetch Error", error);
    return null;
  }
};

// 내가 쓴 팀빌딩 (삭제한 글 제외, 최신순)
export const RequestMyTeambuildings = async (
  token: string,
): Promise<TeambuildingResponse[] | null> => {
  try {
    const res = await fetch(`${url}/teambuildings/me`, {
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("MyTeambuildings Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("MyTeambuildings Fetch Error", error);
    return null;
  }
};

export interface TeambuildingSearchQuery {
  q: string;
  query_by?: string; // 기본 "title,description,tags"
  page?: number;
  per_page?: number;
}

// 검색 결과의 팀빌딩 문서. 목록 응답과 달리 id가 문자열로 온다.
export interface TeambuildingSearchDocument {
  id: string;
  teambuilding_id: string;
  title: string;
  description: string | null;
  status: string | null;
  tags: string[] | null;
  created_at_timestamp: number;
  // TODO: 백엔드에 추가 요청 필요. 현재 검색 결과에는 오지 않아 카드의 카테고리·마감일·조회수·북마크 수를 못 채운다.
  category?: string | null;
  end_date?: string | null;
  view_count?: number;
  bookmark_count?: number;
}

export const RequestSearchTeambuilding = async (
  query: TeambuildingSearchQuery,
): Promise<SearchResponse<TeambuildingSearchDocument> | null> => {
  try {
    const res = await fetch(
      `${url}/search/teambuildings${toQuery({ ...query })}`,
    );

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("SearchTeambuilding Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("SearchTeambuilding Fetch Error", error);
    return null;
  }
};

// ===== Clips (클립) =====

export interface ClipResponse {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  tags: string[];
  thumbnail_img: string | null;
  duration: number | null;
  is_carousel: boolean;
  is_deleted: boolean;
  view_count: number;
  bookmark_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClipListQuery extends PagingQuery {
  // 클립은 latest(최신순)만 지원한다.
  sort?: "latest";
  category?: string | null;
}

export const RequestClipCarousel = async (
  limit?: number,
): Promise<ClipResponse[] | null> => {
  try {
    const res = await fetch(`${url}/clips/carousel${toQuery({ limit })}`);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ClipCarousel Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("ClipCarousel Fetch Error", error);
    return null;
  }
};

export const RequestClipList = async (
  query: ClipListQuery = {},
): Promise<ClipResponse[] | null> => {
  try {
    const res = await fetch(`${url}/clips/${toQuery({ ...query })}`);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ClipList Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("ClipList Fetch Error", error);
    return null;
  }
};

export const RequestClipDetail = async (
  clipId: number,
): Promise<ClipResponse | null> => {
  try {
    const res = await fetch(`${url}/clips/${clipId}`);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ClipDetail Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("ClipDetail Fetch Error", error);
    return null;
  }
};

// 내가 북마크한 클립 (북마크 목록은 total_count가 함께 온다)
export interface ClipBookmarkListResponse {
  total_count: number;
  items: ClipResponse[];
}

export const RequestMyClipBookmarks = async (
  token: string,
  query: PagingQuery = {},
): Promise<ClipBookmarkListResponse | null> => {
  try {
    const res = await fetch(`${url}/clips/bookmark${toQuery({ ...query })}`, {
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("MyClipBookmarks Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("MyClipBookmarks Fetch Error", error);
    return null;
  }
};

export const RequestClipBookmark = async (
  clipId: number,
  isBookmarked: boolean,
  token: string,
): Promise<BookmarkResponse | null> => {
  try {
    const res = await fetch(`${url}/clips/${clipId}/bookmark`, {
      method: isBookmarked ? "DELETE" : "POST",
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ClipBookmark Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("ClipBookmark Fetch Error", error);
    return null;
  }
};

// ===== Newsletter (뉴스레터) =====

export interface NewsletterResponse {
  ai_contest: ProjectListItemResponse[];
  hackathon_competition: ProjectListItemResponse[];
  startup_support: GrantListItemResponse[];
}

export interface NewsletterQuery {
  days?: number; // 마감까지 남은 일수 (기본 30)
  limit?: number; // 묶음별 개수 (기본 30)
}

export interface SubscribeRequest {
  email: string;
}

// TODO: 응답 스키마 미정. 백엔드 확정 시 교체
export type SubscribeResponse = Record<string, unknown>;

export const RequestNewsletter = async (
  query: NewsletterQuery = {},
): Promise<NewsletterResponse | null> => {
  try {
    const res = await fetch(`${url}/newsletter${toQuery({ ...query })}`);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("Newsletter Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Newsletter Fetch Error", error);
    return null;
  }
};

export const RequestNewsletterSubscribe = async (
  body: SubscribeRequest,
): Promise<SubscribeResponse | null> => {
  try {
    const res = await fetch(`${url}/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("NewsletterSubscribe Error", errorData);
      return null;
    }

    // 응답 스키마가 정해지지 않아 본문이 비어 있어도 성공으로 본다.
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("NewsletterSubscribe Fetch Error", error);
    return null;
  }
};

// ===== Auth (인증) =====

export interface UserProfile {
  name: string | null;
  profile_image: string | null;
  birth_year: number | null;
  birth_month: number | null;
  birth_day: number | null;
  work_location: string | null;
  residence_address: string | null;
  career_length: number | null;
  career_position: string | null;
}

export interface UserResponse {
  user_id: number;
  email: string;
  nickname: string | null;
  uid: string | null;
  provider: "kakao" | "google" | "email";
  logged_at: string | null;
  created_at: string | null;
  term_approved: boolean;
  profile: UserProfile | null;
}

export interface EmailSignUpRequest {
  email: string;
  password: string;
  nickname?: string | null;
  term_approved?: boolean;
}

export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  email: string;
  uid: string;
  provider: "google";
  nickname?: string | null;
  term_approved?: boolean;
}

// 로그인·재발급 응답. access_token은 1시간 뒤 만료된다.
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const RequestEmailSignUp = async (
  body: EmailSignUpRequest,
): Promise<UserResponse | null> => {
  try {
    const res = await fetch(`${url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("EmailSignUp Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("EmailSignUp Fetch Error", error);
    return null;
  }
};

export const RequestEmailLogin = async (
  body: EmailLoginRequest,
): Promise<TokenResponse | null> => {
  try {
    const res = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("EmailLogin Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("EmailLogin Fetch Error", error);
    return null;
  }
};

// Firebase ID Token을 Authorization 헤더로 보낸다.
export const RequestGoogleLogin = async (
  body: GoogleLoginRequest,
  idToken: string,
): Promise<TokenResponse | null> => {
  try {
    const res = await fetch(`${url}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(idToken),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("GoogleLogin Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("GoogleLogin Fetch Error", error);
    return null;
  }
};

export const RequestKakaoLogin = async (
  accessToken: string,
): Promise<TokenResponse | null> => {
  try {
    const res = await fetch(
      `${url}/auth/kakao${toQuery({ access_token: accessToken })}`,
      { method: "POST" },
    );

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("KakaoLogin Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("KakaoLogin Fetch Error", error);
    return null;
  }
};

// 카카오 로그인 페이지로 이동시키는 주소 (fetch가 아닌 페이지 이동용)
// 로그인이 끝나면 카카오가 프론트 /auth/kakao/callback 으로 인가 코드(?code=)를 붙여 돌려보낸다.
export const kakaoLoginUrl = `${url}/auth/kakao/login`;

// 구글 로그인 페이지로 이동시키는 주소 (fetch가 아닌 페이지 이동용)
// 구글은 백엔드 /auth/google/callback 으로 돌아가고, 백엔드가 결과(토큰)를 쿼리로 붙여 프론트 /auth/google 로 보낸다.
export const googleLoginUrl = `${url}/auth/google/login`;

// 카카오 인가 코드를 백엔드에서 우리 서비스 토큰으로 바꾼다.
// 백엔드는 결과를 쿼리로 붙인 프론트 주소로 리다이렉트하므로, 따라가지 않고 그 주소의 쿼리만 꺼낸다.
// 성공: access_token·refresh_token·login_success=true / 실패: login_success=false·error·message
export const RequestKakaoCallback = async (
  code: string,
): Promise<URLSearchParams | null> => {
  try {
    const res = await fetch(`${url}/auth/kakao/callback${toQuery({ code })}`, {
      redirect: "manual",
    });
    const location = res.headers.get("location");

    if (!location) {
      const errorData: ApiError = await res.json();
      console.error("KakaoCallback Error", errorData);
      return null;
    }

    return new URL(location, url).searchParams;
  } catch (error) {
    console.error("KakaoCallback Fetch Error", error);
    return null;
  }
};

// access_token 재발급. refresh_token도 새로 바뀌므로 응답의 두 토큰을 모두 저장해야 한다.
// 한 번 쓴 refresh_token을 다시 보내면 백엔드가 탈취로 보고 그 계정의 로그인을 모두 끊는다.
export const RequestRefreshToken = async (
  refreshToken: string,
): Promise<TokenResponse | null> => {
  try {
    const res = await fetch(`${url}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("RefreshToken Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("RefreshToken Fetch Error", error);
    return null;
  }
};

// 로그아웃: refresh_token을 무효로 만든다. (응답 본문 없음, 204)
export const RequestLogout = async (refreshToken: string): Promise<boolean> => {
  try {
    const res = await fetch(`${url}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("Logout Error", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Logout Fetch Error", error);
    return false;
  }
};

export const RequestMe = async (
  token: string,
): Promise<UserResponse | null> => {
  try {
    const res = await fetch(`${url}/auth/me`, {
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("Me Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("Me Fetch Error", error);
    return null;
  }
};

// 회원 탈퇴 (응답 본문 없음, 204). 성공 여부만 돌려준다.
export const RequestWithdraw = async (token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${url}/auth/withdraw`, {
      method: "DELETE",
      headers: authHeader(token),
    });

    throwIfUnauthorized(res);

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("Withdraw Error", errorData);
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof AuthExpiredError) throw error;
    console.error("Withdraw Fetch Error", error);
    return false;
  }
};
