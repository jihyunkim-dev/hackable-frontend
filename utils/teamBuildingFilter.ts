// 팀빌딩 목록 필터. 백엔드에 필터 조건이 없어 서버(프론트)에서 받은 글을 직접 거른다.
// TODO: 백엔드 목록 API에 조건이 생기면 요청 파라미터로 옮긴다.
// URL: ?position=기획,디자이너&period=단기(1~3달)&mode=온라인&status=모집중
// (파라미터 이름은 필터 그룹 id, 값은 필터 모달의 항목 이름을 쉼표로 잇는다)
import { defaultFilterGroups } from "@/configs/contents/filter";
import { daysUntil } from "@/utils/project";
import type { TeambuildingResponse } from "@/utils/requestToSrv";
import {
  TEAMBUILDING_STATUS_VALUE,
  pickOptions,
} from "@/utils/teamBuildingForm";

export type TeamBuildingFilterId = "position" | "period" | "mode" | "status";
export type TeamBuildingFilters = Record<TeamBuildingFilterId, string[]>;

const FILTER_IDS: TeamBuildingFilterId[] = [
  "position",
  "period",
  "mode",
  "status",
];

const optionsOf = (id: TeamBuildingFilterId) =>
  defaultFilterGroups.find((group) => group.id === id)?.options ?? [];

const [SHORT_PERIOD, LONG_PERIOD] = optionsOf("period");
const [OPEN_STATUS, CLOSED_STATUS] = optionsOf("status");

// 단기(1~3달)와 중장기(3~6달)를 가르는 남은 날 수
const SHORT_PERIOD_MAX_DAYS = 90;

// URL 값에서 필터 모달에 있는 항목만 꺼낸다. (모르는 값은 버린다)
export function parseTeamBuildingFilters(
  params: Record<string, string | string[] | undefined>,
): TeamBuildingFilters {
  const read = (id: TeamBuildingFilterId) => {
    const raw = params[id];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return pickOptions(value?.split(",") ?? [], optionsOf(id));
  };
  return Object.fromEntries(
    FILTER_IDS.map((id) => [id, read(id)]),
  ) as TeamBuildingFilters;
}

// 페이지 이동 때 유지할 필터 쿼리 ({ position: "기획,디자이너" })
export function toFilterQuery(filters: TeamBuildingFilters) {
  return Object.fromEntries(
    FILTER_IDS.map((id) => [id, filters[id].join(",") || undefined]),
  );
}

export const hasTeamBuildingFilters = (filters: TeamBuildingFilters) =>
  FILTER_IDS.some((id) => filters[id].length > 0);

// 마감일까지 남은 기간으로 나눈다. 상시 모집(마감일 없음)·이미 마감된 글은 어느 기간에도 넣지 않는다.
function periodOf(post: TeambuildingResponse, now: number) {
  const days = daysUntil(post.end_date, now);
  if (days === null || days < 0) return null;
  return days <= SHORT_PERIOD_MAX_DAYS ? SHORT_PERIOD : LONG_PERIOD;
}

// 같은 그룹 안에서는 하나라도 맞으면, 그룹끼리는 모두 맞아야 남긴다.
// 모집 상태는 카드의 모집중/모집마감 표시와 같은 기준(status)을 쓴다.
export function filterTeamBuildings(
  posts: TeambuildingResponse[],
  filters: TeamBuildingFilters,
  now: number,
) {
  const matches = (selected: string[], values: (string | null)[]) =>
    selected.length === 0 ||
    values.some((value) => value !== null && selected.includes(value));

  return posts.filter(
    (post) =>
      matches(filters.position, post.position ?? []) &&
      // TODO: 진행 방식은 백엔드 필드가 생기기 전까지 tags에 들어 있다.
      matches(filters.mode, post.tags ?? []) &&
      matches(filters.period, [periodOf(post, now)]) &&
      matches(filters.status, [
        post.status === TEAMBUILDING_STATUS_VALUE.closed
          ? CLOSED_STATUS
          : OPEN_STATUS,
      ]),
  );
}
