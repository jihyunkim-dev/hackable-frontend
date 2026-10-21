"use client";

import { createContext, ReactNode } from "react";

interface MypageContextProps {}

export const MypageContext = createContext({} as MypageContextProps);

export default function MypageClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const MypageContextValues = {};
  return <MypageContext value={MypageContextValues}>{children}</MypageContext>;
}
