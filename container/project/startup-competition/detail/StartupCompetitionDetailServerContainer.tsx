import { notFound, permanentRedirect } from "next/navigation";
// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyProjectDetail } from "@/configs/contents/dummyData";
import { getProjectDetail } from "@/utils/project";
import StartupCompetitionDetailClientContainer from "./StartupCompetitionDetailClientContainer";
import StartupCompetitionDetailServerBlock from "./StartupCompetitionDetailServerBlock";

const BASE_PATH = "/project/startup-competition";

export default async function StartupCompetitionDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // [실제 데이터] 더미 데이터 사용 시 아래 블록 주석 처리
  const detail = await getProjectDetail(id);
  if (!detail) notFound();
  // 카테고리 경로나 slug가 다르면 정식 주소로 보낸다.
  if (detail.href !== `${BASE_PATH}/${id}`) permanentRedirect(detail.href);

  // [더미 데이터] 사용 시 아래 주석 해제
  // const detail = createDummyProjectDetail("startup", id);

  return (
    <StartupCompetitionDetailClientContainer id={id}>
      <StartupCompetitionDetailServerBlock detail={detail} />
    </StartupCompetitionDetailClientContainer>
  );
}
