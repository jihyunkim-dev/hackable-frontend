"use client";

import { createContext, ReactNode } from "react";

interface NewsletterIssueContextProps {}

export const NewsletterIssueContext = createContext(
  {} as NewsletterIssueContextProps,
);

export default function NewsletterIssueClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const NewsletterIssueContextValues = {};
  return (
    <NewsletterIssueContext value={NewsletterIssueContextValues}>
      {children}
    </NewsletterIssueContext>
  );
}
