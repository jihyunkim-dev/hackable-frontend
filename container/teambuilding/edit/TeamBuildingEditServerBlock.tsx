import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import LoginGate from "@/components/section/LoginGate";
import TeamBuildingForm, {
  type TeamBuildingFormValues,
} from "@/components/section/TeamBuildingForm";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";

export default function TeamBuildingEditServerBlock({
  id,
  defaultValues,
}: {
  id: string;
  defaultValues: TeamBuildingFormValues;
}) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <LoginGate description={teamBuildingContent.form.loginRequired}>
        <TeamBuildingForm
          mode="edit"
          cancelHref={`/teambuilding/${id}`}
          teambuildingId={id}
          defaultValues={defaultValues}
        />
      </LoginGate>
    </DefaultLayout>
  );
}
