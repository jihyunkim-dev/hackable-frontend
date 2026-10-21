import type { Metadata } from "next";
import MainServerContainer from "@/container/main/MainServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "hackable",
  },
  description: "",
  alternates: {
    canonical: "/",
  },
};

export default function Main() {
  return (
    <>
      <MainServerContainer />
    </>
  );
}
