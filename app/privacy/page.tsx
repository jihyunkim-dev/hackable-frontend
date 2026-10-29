import type { Metadata } from "next";
import PolicyServerContainer from "@/container/policy/PolicyServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "개인정보처리방침 | hackable",
  },
  description: "해커블 개인정보 처리방침",
  alternates: {
    canonical: "/privacy",
  },
};

export default function Privacy() {
  return (
    <>
      <PolicyServerContainer kind="privacy" />
    </>
  );
}
