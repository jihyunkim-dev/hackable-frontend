"use client";

import { createContext, ReactNode } from "react";

interface TeamBuildingContextProps {}

export const TeamBuildingContext = createContext(
  {} as TeamBuildingContextProps,
);

export default function TeamBuildingClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const TeamBuildingContextValues = {};
  return (
    <TeamBuildingContext value={TeamBuildingContextValues}>
      {children}
    </TeamBuildingContext>
  );
}
