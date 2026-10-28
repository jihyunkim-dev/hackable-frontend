"use client";

import { createContext, ReactNode } from "react";

interface ClipDetailContextProps {
  id: string;
}

export const ClipDetailContext = createContext({} as ClipDetailContextProps);

export default function ClipDetailClientContainer({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const ClipDetailContextValues = { id };
  return (
    <ClipDetailContext value={ClipDetailContextValues}>
      {children}
    </ClipDetailContext>
  );
}
