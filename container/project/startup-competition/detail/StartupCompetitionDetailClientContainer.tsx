"use client";

import { createContext, ReactNode } from "react";

interface StartupCompetitionDetailContextProps {
  id: string;
}

export const StartupCompetitionDetailContext = createContext(
  {} as StartupCompetitionDetailContextProps,
);

export default function StartupCompetitionDetailClientContainer({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const StartupCompetitionDetailContextValues = { id };
  return (
    <StartupCompetitionDetailContext
      value={StartupCompetitionDetailContextValues}
    >
      {children}
    </StartupCompetitionDetailContext>
  );
}
