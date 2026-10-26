import { notFound } from "next/navigation";
// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyTeamBuildingDetail } from "@/configs/contents/dummyData";
import { getTeamBuildingDetail } from "@/utils/teamBuilding";
import TeamBuildingDetailClientContainer from "./TeamBuildingDetailClientContainer";
import TeamBuildingDetailServerBlock from "./TeamBuildingDetailServerBlock";

export default async function TeamBuildingDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // [실제 데이터] 더미 데이터 사용 시 아래 블록 주석 처리
  const detail = await getTeamBuildingDetail(id);
  if (!detail) notFound();

  // [더미 데이터] 사용 시 아래 주석 해제
  // const detail = createDummyTeamBuildingDetail(id);

  return (
    <TeamBuildingDetailClientContainer id={id}>
      <TeamBuildingDetailServerBlock detail={detail} />
    </TeamBuildingDetailClientContainer>
  );
}
