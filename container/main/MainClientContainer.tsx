"use client";

import { createContext, ReactNode } from "react";

interface MainContextProps {}

export const MainContext = createContext({} as MainContextProps);

export default function MainClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const MainContextValues = {};
  return <MainContext value={MainContextValues}>{children}</MainContext>;
}
