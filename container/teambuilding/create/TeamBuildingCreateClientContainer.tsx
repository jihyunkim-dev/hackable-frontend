"use client";

import { createContext, ReactNode } from "react";

interface TeamBuildingCreateContextProps {}

export const TeamBuildingCreateContext = createContext(
  {} as TeamBuildingCreateContextProps,
);

export default function TeamBuildingCreateClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const TeamBuildingCreateContextValues = {};
  return (
    <TeamBuildingCreateContext value={TeamBuildingCreateContextValues}>
      {children}
    </TeamBuildingCreateContext>
  );
}
