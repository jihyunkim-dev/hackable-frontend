import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import LoginGate from "@/components/section/LoginGate";
import TeamBuildingForm from "@/components/section/TeamBuildingForm";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";

export default function TeamBuildingCreateServerBlock() {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <LoginGate description={teamBuildingContent.form.loginRequired}>
        <TeamBuildingForm mode="create" cancelHref="/teambuilding" />
      </LoginGate>
    </DefaultLayout>
  );
}
