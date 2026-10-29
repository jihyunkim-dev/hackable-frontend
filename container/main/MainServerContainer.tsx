// [더미 데이터] 사용 시 아래 import를 dummyClips까지 함께 불러온다.
import { dummyProjects } from "@/configs/contents/dummyData";
import { getMainClips } from "@/utils/clip";
import MainClientContainer from "./MainClientContainer";
import MainServerBlock from "./MainServerBlock";

// 메인에 보여 줄 클립 수
const MAIN_CLIP_COUNT = 4;

export default async function MainServerContainer() {
  // TODO: 프로젝트 섹션은 아직 더미 데이터
  const projects = dummyProjects;

  // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
  const clips = await getMainClips(MAIN_CLIP_COUNT);

  // [더미 데이터] 사용 시 아래 주석 해제
  // const clips = dummyClips;

  return (
    <MainClientContainer>
      <MainServerBlock projects={projects} clips={clips} />
    </MainClientContainer>
  );
}
