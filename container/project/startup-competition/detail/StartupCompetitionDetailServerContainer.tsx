import { createDummyProjectDetail } from "@/configs/contents/dummyData";
import StartupCompetitionDetailClientContainer from "./StartupCompetitionDetailClientContainer";
import StartupCompetitionDetailServerBlock from "./StartupCompetitionDetailServerBlock";

export default async function StartupCompetitionDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체
  const detail = createDummyProjectDetail("startup", id);

  return (
    <StartupCompetitionDetailClientContainer id={id}>
      <StartupCompetitionDetailServerBlock detail={detail} />
    </StartupCompetitionDetailClientContainer>
  );
}
