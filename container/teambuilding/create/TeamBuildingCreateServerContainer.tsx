import TeamBuildingCreateClientContainer from "./TeamBuildingCreateClientContainer";
import TeamBuildingCreateServerBlock from "./TeamBuildingCreateServerBlock";

export default function TeamBuildingCreateServerContainer() {
  return (
    <TeamBuildingCreateClientContainer>
      <TeamBuildingCreateServerBlock />
    </TeamBuildingCreateClientContainer>
  );
}
