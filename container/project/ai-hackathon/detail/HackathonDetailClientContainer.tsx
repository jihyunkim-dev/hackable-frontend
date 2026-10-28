"use client";

import { createContext, ReactNode } from "react";

interface HackathonDetailContextProps {
  id: string;
}

export const HackathonDetailContext = createContext(
  {} as HackathonDetailContextProps,
);

export default function HackathonDetailClientContainer({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const HackathonDetailContextValues = { id };
  return (
    <HackathonDetailContext value={HackathonDetailContextValues}>
      {children}
    </HackathonDetailContext>
  );
}
