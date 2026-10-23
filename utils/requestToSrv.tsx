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

// ===== Project (해커톤·공모전·창업경진대회) =====

export type ProjectCategoryValue =
  | "hackathon"
  | "ai_challenge"
  | "ai_competition"
  | "ai_contest"
  | "ai_image"
  | "ai_video"
  | "competition"
  | "idea_competition"
  | "startup_competition";

export type RecruitStatus = "upcoming" | "open" | "closed";

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
  category?: ProjectCategoryValue | null;
  status?: RecruitStatus | null;
}

export const RequestProjectList = async (
  query: ProjectListQuery = {},
): Promise<ProjectListResponse | null> => {
  try {
    const res = await fetch(`${url}/project${toQuery({ ...query })}`);

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

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ProjectBookmark Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("ProjectBookmark Fetch Error", error);
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

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("GrantBookmark Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("GrantBookmark Fetch Error", error);
    return null;
  }
};

// ===== Teambuilding (팀빌딩) =====

// TODO: 서버가 latest 외 값도 에러 없이 받는다. 인기순 값 확정 필요
export type ListSort = "latest" | "popular";

export interface TeambuildingRequest {
  title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  thumbnail_img?: string | null;
  status?: string | null;
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
  tags: string[] | null;
  position: string[] | null;
  view_count: number;
  bookmark_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeambuildingListQuery extends PagingQuery {
  sort_by?: ListSort;
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

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("CreateTeambuilding Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
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

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("UpdateTeambuilding Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("UpdateTeambuilding Fetch Error", error);
    return null;
  }
};

export const RequestTeambuildingBookmark = async (
  teambuildingId: number,
  isBookmarked: boolean,
  token: string,
): Promise<BookmarkResponse | null> => {
  try {
    const res = await fetch(
      `${url}/teambuildings/${teambuildingId}/bookmark`,
      {
        method: isBookmarked ? "DELETE" : "POST",
        headers: authHeader(token),
      },
    );

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("TeambuildingBookmark Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("TeambuildingBookmark Fetch Error", error);
    return null;
  }
};

export interface TeambuildingSearchQuery {
  q?: string;
  query_by?: string; // 기본 "title,description,tags"
  page?: number;
  per_page?: number;
}

// Typesense 검색 결과 (hits[].document 에 팀빌딩 문서가 담긴다)
export interface TeambuildingSearchResponse {
  found: number;
  page: number;
  hits: {
    document: TeambuildingResponse;
  }[];
}

export const RequestSearchTeambuilding = async (
  query: TeambuildingSearchQuery,
): Promise<TeambuildingSearchResponse | null> => {
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
  sort_by?: ListSort;
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

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("ClipBookmark Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
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

    return await res.json();
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
  logged_at: string | null;
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

// TODO: 응답 스키마 미정(OpenAPI에 빈 스키마). 백엔드 확정 시 교체
export interface LoginResponse {
  access_token: string;
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
): Promise<LoginResponse | null> => {
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
): Promise<LoginResponse | null> => {
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
): Promise<LoginResponse | null> => {
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
export const kakaoLoginUrl = `${url}/auth/kakao/login`;

export const RequestMe = async (token: string): Promise<UserResponse | null> => {
  try {
    const res = await fetch(`${url}/auth/me`, {
      headers: authHeader(token),
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("Me Error", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Me Fetch Error", error);
    return null;
  }
};

// 서버 미구현 상태. 성공 여부만 돌려준다.
export const RequestWithdraw = async (token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${url}/auth/withdraw`, {
      method: "DELETE",
      headers: authHeader(token),
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      console.error("Withdraw Error", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Withdraw Fetch Error", error);
    return false;
  }
};
