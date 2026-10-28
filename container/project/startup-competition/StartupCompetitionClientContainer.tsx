"use client";

import { createContext, ReactNode } from "react";

interface StartupCompetitionContextProps {}

export const StartupCompetitionContext = createContext(
  {} as StartupCompetitionContextProps,
);

export default function StartupCompetitionClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const StartupCompetitionContextValues = {};
  return (
    <StartupCompetitionContext value={StartupCompetitionContextValues}>
      {children}
    </StartupCompetitionContext>
  );
}
