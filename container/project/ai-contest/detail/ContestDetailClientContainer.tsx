"use client";

import { createContext, ReactNode } from "react";

interface ContestDetailContextProps {
  id: string;
}

export const ContestDetailContext = createContext({} as ContestDetailContextProps);

export default function ContestDetailClientContainer({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const ContestDetailContextValues = { id };
  return <ContestDetailContext value={ContestDetailContextValues}>{children}</ContestDetailContext>;
}
