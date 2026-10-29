import type { Metadata } from "next";
import PolicyServerContainer from "@/container/policy/PolicyServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "이용약관 | hackable",
  },
  description: "해커블 서비스 이용약관",
  alternates: {
    canonical: "/terms",
  },
};

export default function Terms() {
  return (
    <>
      <PolicyServerContainer kind="terms" />
    </>
  );
}
