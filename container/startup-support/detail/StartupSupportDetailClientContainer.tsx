"use client";

import { createContext, ReactNode } from "react";

interface StartupSupportDetailContextProps {
  id: string;
}

export const StartupSupportDetailContext = createContext(
  {} as StartupSupportDetailContextProps,
);

export default function StartupSupportDetailClientContainer({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const StartupSupportDetailContextValues = { id };
  return (
    <StartupSupportDetailContext value={StartupSupportDetailContextValues}>
      {children}
    </StartupSupportDetailContext>
  );
}
