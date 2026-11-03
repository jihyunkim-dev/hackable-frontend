import localFont from "next/font/local";

// 본문 폰트 Hackable Sans (SUIT를 글자 묶음으로 나눈 웹폰트). 만드는 법: scripts/font-subset/build.py
export { hackableSans } from "./fonts/hackableSans";

// 404 페이지의 큰 숫자 전용. 숫자(0~9)만 잘라 담았다. (SUITE ExtraBold, OFL)
// 404에서만 쓰므로 모든 페이지에서 미리 받지 않는다.
export const suiteDigits = localFont({
  src: "../public/fonts/SUITE-ExtraBold-digits.woff2",
  weight: "800",
  display: "swap",
  preload: false,
});
