import { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface BannerImage {
  src: string;
  width: number;
  height: number;
}

interface PromoBannerProps {
  images: Record<"xs" | "sm" | "xl", BannerImage>;
  alt: string;
  href?: string;
  priority?: boolean;
  className?: string;
}

// 화면 크기마다 구도가 다른 배너 이미지를 <picture>로 전환한다. (아트 디렉션)
export default function PromoBanner({
  images,
  alt,
  href,
  priority = false,
  className,
}: PromoBannerProps) {
  const common = { alt, sizes: "100vw", priority };
  const {
    props: { srcSet: xl },
  } = getImageProps({ ...common, ...images.xl });
  const {
    props: { srcSet: sm },
  } = getImageProps({ ...common, ...images.sm });
  const { props: xs } = getImageProps({ ...common, ...images.xs });

  // 이미지가 바뀌기 전에도 화면 크기별 비율로 자리를 잡아 레이아웃이 흔들리지 않게 한다.
  const ratio = {
    "--ratio-xs": `${images.xs.width} / ${images.xs.height}`,
    "--ratio-sm": `${images.sm.width} / ${images.sm.height}`,
    "--ratio-xl": `${images.xl.width} / ${images.xl.height}`,
  } as CSSProperties;
  const boxClassName = cn(
    "block aspect-(--ratio-xs) sm:aspect-(--ratio-sm) md:aspect-(--ratio-xl)",
    className,
  );

  const picture = (
    <picture>
      <source media="(min-width: 61.9375rem)" srcSet={xl} />
      <source media="(min-width: 48rem)" srcSet={sm} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt는 getImageProps가 넘겨준다 */}
      <img {...xs} className="block size-full object-cover" />
    </picture>
  );

  if (!href) {
    return (
      <div style={ratio} className={boxClassName}>
        {picture}
      </div>
    );
  }

  return (
    <Link href={href} style={ratio} className={boxClassName}>
      {picture}
    </Link>
  );
}
