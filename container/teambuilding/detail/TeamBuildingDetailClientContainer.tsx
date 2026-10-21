"use client";

import { createContext, ReactNode } from "react";

interface TeamBuildingDetailContextProps {
  id: string;
}

export const TeamBuildingDetailContext = createContext({} as TeamBuildingDetailContextProps);

export default function TeamBuildingDetailClientContainer({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const TeamBuildingDetailContextValues = { id };
  return <TeamBuildingDetailContext value={TeamBuildingDetailContextValues}>{children}</TeamBuildingDetailContext>;
}
