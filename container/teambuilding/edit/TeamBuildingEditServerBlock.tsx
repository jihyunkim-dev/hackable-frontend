import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import AuthorGate from "@/components/section/AuthorGate";
import LoginGate from "@/components/section/LoginGate";
import TeamBuildingForm, {
  type TeamBuildingFormValues,
} from "@/components/section/TeamBuildingForm";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";

export default function TeamBuildingEditServerBlock({
  id,
  authorId,
  defaultValues,
}: {
  id: string;
  authorId?: number;
  defaultValues: TeamBuildingFormValues;
}) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <LoginGate description={teamBuildingContent.form.loginRequired}>
        <AuthorGate authorId={authorId} backHref={`/teambuilding/${id}`}>
          <TeamBuildingForm
            mode="edit"
            cancelHref={`/teambuilding/${id}`}
            teambuildingId={id}
            defaultValues={defaultValues}
          />
        </AuthorGate>
      </LoginGate>
    </DefaultLayout>
  );
}
