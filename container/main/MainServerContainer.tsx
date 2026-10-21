import { dummyClips, dummyProjects } from "@/configs/contents/dummyData";
import MainClientContainer from "./MainClientContainer";
import MainServerBlock from "./MainServerBlock";

export default function MainServerContainer() {
  const projects = dummyProjects;
  const clips = dummyClips;

  return (
    <MainClientContainer>
      <MainServerBlock projects={projects} clips={clips} />
    </MainClientContainer>
  );
}
