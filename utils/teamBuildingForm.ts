// 팀빌딩 작성·수정 폼 값 ↔ API 요청 본문 변환. (브라우저·서버 공용)
import type { TeambuildingRequest } from "@/utils/requestToSrv";

// 모집 상태 값. utils/teamBuilding의 TEAMBUILDING_STATUS와 같다.
// (그 파일은 서버 캐시 함수가 있어 브라우저에서 불러오지 않는다)
export const TEAMBUILDING_STATUS_VALUE = {
  open: "recruiting",
  closed: "closed",
} as const;

// API 최대 개수
const POSITION_MAX = 10;

export interface TeamBuildingFormInput {
  title: string;
  body: string;
  isOpen: boolean;
  position: string;
  // YYYY-MM-DD, 비우면 상시 모집
  deadline: string;
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
    description: input.body.trim() || null,
    status: input.isOpen
      ? TEAMBUILDING_STATUS_VALUE.open
      : TEAMBUILDING_STATUS_VALUE.closed,
    position: position.length ? position : null,
    // 마감일 하루 끝까지 모집한다.
    end_date: input.deadline ? `${input.deadline}T23:59:59` : null,
  };
}

// 서버로 넘어온 본문에서 허용한 필드만 꺼낸다.
export function pickTeambuildingRequest(
  body: Partial<Record<keyof TeambuildingRequest, unknown>>,
): Partial<TeambuildingRequest> {
  const result: Partial<TeambuildingRequest> = {};
  if (typeof body.title === "string") result.title = body.title;
  if (typeof body.description === "string" || body.description === null)
    result.description = body.description;
  if (typeof body.status === "string") result.status = body.status;
  if (typeof body.end_date === "string" || body.end_date === null)
    result.end_date = body.end_date;
  if (Array.isArray(body.position) || body.position === null)
    result.position = body.position?.map(String) ?? null;
  return result;
}
