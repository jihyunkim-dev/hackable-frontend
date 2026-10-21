import type { Metadata } from "next";
import TeamBuildingCreateServerContainer from "@/container/teambuilding/create/TeamBuildingCreateServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "팀빌딩 모집글 작성 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/teambuilding/create",
  },
};

export default function TeamBuildingCreate() {
  return (
    <>
      <TeamBuildingCreateServerContainer />
    </>
  );
}
