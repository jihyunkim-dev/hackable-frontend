import { cn } from "@/lib/utils";

// 마크다운 본문(renderMarkdown 결과 HTML)에 입히는 공통 스타일. 클립 본문·약관 페이지에서 쓴다.
export const MARKDOWN_STYLE = cn(
  "flex flex-col gap-2.5 text-body-m lg:gap-5 lg:text-body-l",
  "[&_h2]:scroll-mt-[calc(var(--header-height-desktop)+24px)] [&_h2]:pt-2 [&_h2]:text-body-l [&_h2]:font-bold lg:[&_h2]:text-heading-s lg:[&_h2]:text-gray-800",
  "[&_h3]:scroll-mt-[calc(var(--header-height-desktop)+24px)] [&_h3]:pt-1 [&_h3]:text-body-l [&_h3]:font-bold [&_h3]:text-gray-800",
  "[&_a]:text-primary-500 [&_a]:underline [&_strong]:font-bold",
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1",
  "[&_em]:text-body-s [&_em]:text-gray-500 [&_em]:not-italic",
  "[&_img]:h-auto [&_img]:w-full [&_img]:rounded-sm lg:[&_img]:rounded-lg",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-body-s lg:[&_table]:text-body-m",
  "[&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:p-2 [&_th]:text-left [&_th]:font-bold",
  "[&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_td]:align-top",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary-200 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600",
  "[&_code]:rounded-sm [&_code]:bg-gray-100 [&_code]:px-1",
);
