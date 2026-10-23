import { notFound, permanentRedirect } from "next/navigation";
// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyProjectDetail } from "@/configs/contents/dummyData";
import { projectContent } from "@/configs/contents/project";
import { getGrantDetail } from "@/utils/grant";
import StartupSupportDetailClientContainer from "./StartupSupportDetailClientContainer";
import StartupSupportDetailServerBlock from "./StartupSupportDetailServerBlock";

export default async function StartupSupportDetailServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // [실제 데이터] 더미 데이터 사용 시 아래 블록 주석 처리
  const detail = await getGrantDetail(id);
  if (!detail) notFound();
  // slug가 다르면 정식 주소로 보낸다.
  if (detail.href !== `${projectContent.startupSupport.href}/${id}`) {
    permanentRedirect(detail.href);
  }

  // [더미 데이터] 사용 시 아래 주석 해제
  // const detail = createDummyProjectDetail("support", id);

  return (
    <StartupSupportDetailClientContainer id={id}>
      <StartupSupportDetailServerBlock detail={detail} />
    </StartupSupportDetailClientContainer>
  );
}
