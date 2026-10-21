import { createDummyClipDetail, dummyRecommendClips } from "@/configs/contents/dummyData";
import ClipDetailClientContainer from "./ClipDetailClientContainer";
import ClipDetailServerBlock from "./ClipDetailServerBlock";

export default async function ClipDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체
  const detail = createDummyClipDetail(id);

  return (
    <ClipDetailClientContainer id={id}>
      <ClipDetailServerBlock detail={detail} recommends={dummyRecommendClips} />
    </ClipDetailClientContainer>
  );
}
