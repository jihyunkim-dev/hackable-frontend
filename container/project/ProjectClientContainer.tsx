"use client";

import { createContext, ReactNode } from "react";

interface ProjectContextProps {}

export const ProjectContext = createContext({} as ProjectContextProps);

export default function ProjectClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const ProjectContextValues = {};
  return <ProjectContext value={ProjectContextValues}>{children}</ProjectContext>;
}
