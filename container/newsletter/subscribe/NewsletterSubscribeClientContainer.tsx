"use client";

import { createContext, ReactNode } from "react";

interface NewsletterSubscribeContextProps {}

export const NewsletterSubscribeContext = createContext({} as NewsletterSubscribeContextProps);

export default function NewsletterSubscribeClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  const NewsletterSubscribeContextValues = {};
  return <NewsletterSubscribeContext value={NewsletterSubscribeContextValues}>{children}</NewsletterSubscribeContext>;
}
