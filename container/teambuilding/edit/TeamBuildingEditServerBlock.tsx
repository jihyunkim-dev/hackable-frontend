import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import TeamBuildingForm, {
  type TeamBuildingFormValues,
} from "@/components/section/TeamBuildingForm";

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
      <TeamBuildingForm
        mode="edit"
        cancelHref={`/teambuilding/${id}`}
        defaultValues={defaultValues}
      />
    </DefaultLayout>
  );
}
