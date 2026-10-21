"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />;
}

export function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex items-center justify-center border-b border-gray-200",
        className,
      )}
      {...props}
    />
  );
}

// 밑줄형 탭. 활성 탭은 primary 색상과 하단 2px 라인으로 표시한다.
export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "-mb-px flex items-center justify-center border-b-2 border-transparent text-gray-500 transition-colors hover:text-gray-700 data-[state=active]:border-primary-500 data-[state=active]:text-primary-500",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("focus-visible:outline-none", className)}
      {...props}
    />
  );
}
