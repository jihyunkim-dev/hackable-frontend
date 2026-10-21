"use client";

import { createContext, ReactNode } from "react";

interface StartupSupportContextProps {}

export const StartupSupportContext = createContext(
  {} as StartupSupportContextProps,
);

export default function StartupSupportClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const StartupSupportContextValues = {};
  return (
    <StartupSupportContext value={StartupSupportContextValues}>
      {children}
    </StartupSupportContext>
  );
}
