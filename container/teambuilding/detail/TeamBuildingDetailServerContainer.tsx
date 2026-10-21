import { createDummyTeamBuildingDetail } from "@/configs/contents/dummyData";
import TeamBuildingDetailClientContainer from "./TeamBuildingDetailClientContainer";
import TeamBuildingDetailServerBlock from "./TeamBuildingDetailServerBlock";

export default async function TeamBuildingDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체
  const detail = createDummyTeamBuildingDetail(id);

  return (
    <TeamBuildingDetailClientContainer id={id}>
      <TeamBuildingDetailServerBlock detail={detail} />
    </TeamBuildingDetailClientContainer>
  );
}
