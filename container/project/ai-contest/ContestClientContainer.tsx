"use client";

import { createContext, ReactNode } from "react";

interface ContestContextProps {}

export const ContestContext = createContext({} as ContestContextProps);

export default function ContestClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const ContestContextValues = {};
  return (
    <ContestContext value={ContestContextValues}>{children}</ContestContext>
  );
}
