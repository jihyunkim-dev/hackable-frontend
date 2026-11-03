import localFont from "next/font/local";

export const suit = localFont({
  src: "../public/fonts/SUIT-Variable.woff2",
  variable: "--font-suit",
  weight: "100 900",
  display: "swap",
});

// 404 페이지의 큰 숫자 전용. 숫자(0~9)만 잘라 담았다. (SUITE ExtraBold, OFL)
export const suiteDigits = localFont({
  src: "../public/fonts/SUITE-ExtraBold-digits.woff2",
  weight: "800",
  display: "swap",
});
