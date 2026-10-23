import type { Metadata } from "next";
import "./globals.css";
import { suit } from "./font";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import FloatingButton from "@/components/layout/FloatingButton";

export const metadata: Metadata = {
  title: "hackable",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={cn(suit.variable, "h-full antialiased")}>
      <body
        className={cn(
          "min-h-full flex flex-col font-sans",
          "pb-[calc(var(--navbar-height-mobile)+env(safe-area-inset-bottom))] md:pb-0",
        )}
      >
        <Header />
        <main className="flex-1 pt-(--header-height-mobile) md:pt-(--header-height-desktop)">
          {children}
        </main>
        <Footer />
        <FloatingButton />
      </body>
    </html>
  );
}
