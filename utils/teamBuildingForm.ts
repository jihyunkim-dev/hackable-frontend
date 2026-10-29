// 팀빌딩 작성·수정 폼 값 ↔ API 요청 본문 변환. (브라우저·서버 공용)
import type { TeambuildingRequest } from "@/utils/requestToSrv";

// 모집 상태 값. utils/teamBuilding의 TEAMBUILDING_STATUS와 같다.
// (그 파일은 서버 캐시 함수가 있어 브라우저에서 불러오지 않는다)
export const TEAMBUILDING_STATUS_VALUE = {
  open: "recruiting",
  closed: "closed",
} as const;

// 카테고리 값. 백엔드는 값을 정하지 않고 프론트가 보낸 문자열을 그대로 저장·필터한다.
// 화면 이름은 configs/contents/teamBuilding의 categories와 같다.
export const TEAMBUILDING_CATEGORIES = ["project", "study"] as const;
export type TeamBuildingCategory = (typeof TEAMBUILDING_CATEGORIES)[number];

export function isTeamBuildingCategory(
  value: unknown,
): value is TeamBuildingCategory {
  return TEAMBUILDING_CATEGORIES.includes(value as TeamBuildingCategory);
}

// API 최대 개수
const POSITION_MAX = 10;

export interface TeamBuildingFormInput {
  category: TeamBuildingCategory;
  title: string;
  body: string;
  isOpen: boolean;
  position: string;
  // YYYY-MM-DD, 비우면 상시 모집
  deadline: string;
  // 올린 이미지 주소. null이면 이미지 없음
  imageUrl: string | null;
}

// 모집 포지션은 줄바꿈·쉼표로 나눠 배열로 보낸다. (상세에서는 ", "로 이어 보여준다)
export function toTeambuildingRequest(
  input: TeamBuildingFormInput,
): TeambuildingRequest {
  const position = input.position
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, POSITION_MAX);

  return {
    title: input.title.trim(),
    category: input.category,
    description: input.body.trim() || null,
    status: input.isOpen
      ? TEAMBUILDING_STATUS_VALUE.open
      : TEAMBUILDING_STATUS_VALUE.closed,
    position: position.length ? position : null,
    // 마감일 하루 끝까지 모집한다.
    // 시간대(+09:00)를 꼭 붙인다. 없으면 백엔드가 현재 시각(시간대 있음)과 비교하다 오류를 낸다.
    // ("can't compare offset-naive and offset-aware datetimes")
    end_date: input.deadline ? `${input.deadline}T23:59:59+09:00` : null,
    thumbnail_img: input.imageUrl,
  };
}

// 서버로 넘어온 본문에서 허용한 필드만 꺼낸다.
// 이미지 주소는 우리가 올린 주소(isAllowedImage)만 받는다. 아니면 빼고 보낸다.
export function pickTeambuildingRequest(
  body: Partial<Record<keyof TeambuildingRequest, unknown>>,
  isAllowedImage: (url: string) => boolean,
): Partial<TeambuildingRequest> {
  const result: Partial<TeambuildingRequest> = {};
  if (typeof body.title === "string") result.title = body.title;
  if (typeof body.description === "string" || body.description === null)
    result.description = body.description;
  if (typeof body.status === "string") result.status = body.status;
  if (isTeamBuildingCategory(body.category)) result.category = body.category;
  if (typeof body.end_date === "string" || body.end_date === null)
    result.end_date = body.end_date;
  if (Array.isArray(body.position) || body.position === null)
    result.position = body.position?.map(String) ?? null;
  if (
    (typeof body.thumbnail_img === "string" &&
      isAllowedImage(body.thumbnail_img)) ||
    body.thumbnail_img === null
  )
    result.thumbnail_img = body.thumbnail_img;
  return result;
}
