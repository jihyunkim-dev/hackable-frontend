"use client";

import { createContext, ReactNode } from "react";

interface TeamBuildingEditContextProps {
  id: string;
}

export const TeamBuildingEditContext = createContext(
  {} as TeamBuildingEditContextProps,
);

export default function TeamBuildingEditClientContainer({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const TeamBuildingEditContextValues = { id };
  return (
    <TeamBuildingEditContext value={TeamBuildingEditContextValues}>
      {children}
    </TeamBuildingEditContext>
  );
}
