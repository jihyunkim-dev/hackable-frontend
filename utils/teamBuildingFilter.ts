// 팀빌딩 목록 필터. 백엔드 목록 API(GET /teambuildings/)에 조건을 넘겨 거른다.
// URL: ?position=기획,디자이너&period=단기(1~3달)&mode=온라인&status=모집중
// (파라미터 이름은 필터 그룹 id, 값은 필터 모달의 항목 이름을 쉼표로 잇는다)
// 백엔드도 그룹 안에서는 하나라도 맞으면, 그룹끼리는 모두 맞아야 남긴다.
import { defaultFilterGroups } from "@/configs/contents/filter";
import { daysUntil } from "@/utils/project";
import type {
  TeambuildingListQuery,
  TeambuildingRequest,
} from "@/utils/requestToSrv";
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

// 모집 상태 항목 이름 → 백엔드 값. (백엔드는 "모집중"이 아니라 저장된 값으로 거른다)
const STATUS_VALUE_BY_LABEL: Record<string, string> = {
  [OPEN_STATUS]: TEAMBUILDING_STATUS_VALUE.open,
  [CLOSED_STATUS]: TEAMBUILDING_STATUS_VALUE.closed,
};

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

// 목록 API에 넘길 필터 조건. 고르지 않은 그룹은 보내지 않는다.
export function toTeambuildingFilterParams(
  filters: TeamBuildingFilters,
): Pick<TeambuildingListQuery, "position" | "duration" | "mode" | "status"> {
  return {
    position: filters.position,
    duration: filters.period,
    mode: filters.mode,
    status: filters.status.map((label) => STATUS_VALUE_BY_LABEL[label]),
  };
}

// 마감일까지 남은 기간으로 나눈다. 상시 모집(마감일 없음)·이미 마감된 글은 어느 기간에도 넣지 않는다.
function periodOf(endDate: string | null, now: number) {
  const days = daysUntil(endDate, now);
  if (days === null || days < 0) return null;
  return days <= SHORT_PERIOD_MAX_DAYS ? SHORT_PERIOD : LONG_PERIOD;
}

// 백엔드는 기간을 tags에서 찾는다. 글을 저장할 때 마감일로 기간을 계산해 tags에 붙인다.
// (진행 방식과 함께 보낼 때만. 모집 상태만 바꾸는 요청은 tags를 건드리지 않는다)
// 기간은 저장한 날 기준이라, 글을 다시 저장하기 전까지는 바뀌지 않는다.
export function withPeriodTag(
  body: Partial<TeambuildingRequest>,
  now: number,
): Partial<TeambuildingRequest> {
  if (!body.tags || body.end_date === undefined) return body;
  const period = periodOf(body.end_date, now);
  return { ...body, tags: period ? [...body.tags, period] : body.tags };
}
