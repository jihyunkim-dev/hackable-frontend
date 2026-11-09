// [더미 데이터] 사용 시 아래 import 주석 해제
// import type { TeamBuildingItem } from "@/components/section/TeamBuildingCard";
// import { dummyClips, dummyProjects } from "@/configs/contents/dummyData";
import { getMainClips } from "@/utils/clip";
import { getMainProjects, getMainTeamBuildings } from "@/utils/main";
import MainClientContainer from "./MainClientContainer";
import MainServerBlock from "./MainServerBlock";

// 메인에 보여 줄 클립 수
const MAIN_CLIP_COUNT = 4;

export default async function MainServerContainer() {
  // [실제 데이터] 더미 데이터 사용 시 아래 블록 주석 처리
  const [projects, teamBuildings, clips] = await Promise.all([
    getMainProjects(),
    getMainTeamBuildings(),
    getMainClips(MAIN_CLIP_COUNT),
  ]);

  // [더미 데이터] 사용 시 아래 주석 해제
  // const projects = dummyProjects;
  // const teamBuildings: TeamBuildingItem[] = [];
  // const clips = dummyClips;

  return (
    <MainClientContainer>
      <MainServerBlock
        projects={projects}
        teamBuildings={teamBuildings}
        clips={clips}
      />
    </MainClientContainer>
  );
}
