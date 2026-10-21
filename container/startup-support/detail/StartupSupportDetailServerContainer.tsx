import { createDummyProjectDetail } from "@/configs/contents/dummyData";
import StartupSupportDetailClientContainer from "./StartupSupportDetailClientContainer";
import StartupSupportDetailServerBlock from "./StartupSupportDetailServerBlock";

export default async function StartupSupportDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체
  const detail = createDummyProjectDetail("support", id);

  return (
    <StartupSupportDetailClientContainer id={id}>
      <StartupSupportDetailServerBlock detail={detail} />
    </StartupSupportDetailClientContainer>
  );
}
