import { notFound } from "next/navigation";
// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyClipDetail, dummyRecommendClips } from "@/configs/contents/dummyData";
import { getClipDetail } from "@/utils/clip";
import ClipDetailClientContainer from "./ClipDetailClientContainer";
import ClipDetailServerBlock from "./ClipDetailServerBlock";

export default async function ClipDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // [실제 데이터] 더미 데이터 사용 시 아래 블록 주석 처리
  const data = await getClipDetail(id);
  if (!data) notFound();
  const { detail, recommends } = data;

  // [더미 데이터] 사용 시 아래 주석 해제
  // const detail = createDummyClipDetail(id);
  // const recommends = dummyRecommendClips;

  return (
    <ClipDetailClientContainer id={id}>
      <ClipDetailServerBlock detail={detail} recommends={recommends} />
    </ClipDetailClientContainer>
  );
}
