import type { Metadata } from "next";
import MypageServerContainer from "@/container/mypage/MypageServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "마이페이지 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/mypage",
  },
};

export default function Mypage() {
  return (
    <>
      <MypageServerContainer />
    </>
  );
}
