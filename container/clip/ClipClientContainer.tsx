"use client";

import { createContext, ReactNode } from "react";

interface ClipContextProps {}

export const ClipContext = createContext({} as ClipContextProps);

export default function ClipClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const ClipContextValues = {};
  return <ClipContext value={ClipContextValues}>{children}</ClipContext>;
}
