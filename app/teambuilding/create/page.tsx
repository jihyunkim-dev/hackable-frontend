import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import TeamBuildingCreateServerContainer from "@/container/teambuilding/create/TeamBuildingCreateServerContainer";

export const metadata: Metadata = pageMetadata({
  ...seoContent.teamBuildingCreate,
  noindex: true,
});

export default function TeamBuildingCreate() {
  return (
    <>
      <TeamBuildingCreateServerContainer />
    </>
  );
}
