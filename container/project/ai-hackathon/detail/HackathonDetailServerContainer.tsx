import { createDummyProjectDetail } from "@/configs/contents/dummyData";
import HackathonDetailClientContainer from "./HackathonDetailClientContainer";
import HackathonDetailServerBlock from "./HackathonDetailServerBlock";

export default async function HackathonDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체
  const detail = createDummyProjectDetail("hackathon", id);

  return (
    <HackathonDetailClientContainer id={id}>
      <HackathonDetailServerBlock detail={detail} />
    </HackathonDetailClientContainer>
  );
}
