import { createDummyProjectDetail } from "@/configs/contents/dummyData";
import ContestDetailClientContainer from "./ContestDetailClientContainer";
import ContestDetailServerBlock from "./ContestDetailServerBlock";

export default async function ContestDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체
  const detail = createDummyProjectDetail("contest", id);

  return (
    <ContestDetailClientContainer id={id}>
      <ContestDetailServerBlock detail={detail} />
    </ContestDetailClientContainer>
  );
}
