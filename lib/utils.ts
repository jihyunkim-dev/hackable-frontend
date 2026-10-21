import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// styles/theme.css에 정의한 커스텀 토큰을 tailwind-merge에 등록한다.
// 등록하지 않으면 text-display-l(폰트 크기)과 text-primary-500(색상)을
// 같은 그룹으로 오인해 한쪽이 지워질 수 있다.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display-l",
        "display-m",
        "heading-xl",
        "heading-l",
        "heading-m",
        "heading-s",
        "heading-xs",
        "body-l",
        "body-m",
        "body-s",
        "label-l",
        "label-m",
        "label-s",
      ],
      shadow: ["spread-sm", "spread-md"],
      breakpoint: ["xs", "sm", "md", "lg", "xl"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
