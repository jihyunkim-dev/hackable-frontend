import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import TeamBuildingForm from "@/components/section/TeamBuildingForm";

export default function TeamBuildingCreateServerBlock() {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <TeamBuildingForm mode="create" cancelHref="/teambuilding" />
    </DefaultLayout>
  );
}
