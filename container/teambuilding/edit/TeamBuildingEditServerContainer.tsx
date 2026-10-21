import { createDummyTeamBuildingDetail } from "@/configs/contents/dummyData";
import TeamBuildingEditClientContainer from "./TeamBuildingEditClientContainer";
import TeamBuildingEditServerBlock from "./TeamBuildingEditServerBlock";

export default async function TeamBuildingEditServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체
  const detail = createDummyTeamBuildingDetail(id);

  return (
    <TeamBuildingEditClientContainer id={id}>
      <TeamBuildingEditServerBlock
        id={id}
        defaultValues={{
          title: detail.title,
          body: detail.body,
          isOpen: detail.isOpen,
          position: detail.position,
          deadline: detail.deadline,
        }}
      />
    </TeamBuildingEditClientContainer>
  );
}
