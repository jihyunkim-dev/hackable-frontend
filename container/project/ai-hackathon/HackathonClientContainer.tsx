"use client";

import { createContext, ReactNode } from "react";

interface HackathonContextProps {}

export const HackathonContext = createContext({} as HackathonContextProps);

export default function HackathonClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const HackathonContextValues = {};
  return (
    <HackathonContext value={HackathonContextValues}>
      {children}
    </HackathonContext>
  );
}
