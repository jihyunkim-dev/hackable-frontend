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
  // lg는 선택: 2단 레이아웃처럼 lg 이상에서 배너 폭이 좁아지는 자리에 쓰는 이미지
  images: Record<"xs" | "sm" | "xl", BannerImage> & { lg?: BannerImage };
  alt: string;
  href?: string;
  priority?: boolean;
  className?: string;
}

const BANNER_QUALITY = 90;

// 화면 크기마다 구도가 다른 배너 이미지를 <picture>로 전환한다. (아트 디렉션)
export default function PromoBanner({
  images,
  alt,
  href,
  priority = false,
  className,
}: PromoBannerProps) {
  // 글자가 많은 배너라 기본(75)보다 높은 품질로 압축한다. (next.config qualities에 등록)
  const common = { alt, sizes: "100vw", priority, quality: BANNER_QUALITY };
  const lg = images.lg
    ? getImageProps({ ...common, ...images.lg }).props.srcSet
    : undefined;
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
    ...(images.lg && {
      "--ratio-lg": `${images.lg.width} / ${images.lg.height}`,
    }),
  } as CSSProperties;
  const boxClassName = cn(
    "block aspect-(--ratio-xs) sm:aspect-(--ratio-sm) md:aspect-(--ratio-xl)",
    images.lg && "lg:aspect-(--ratio-lg)",
    className,
  );

  const picture = (
    <picture>
      {lg && <source media="(min-width: 75rem)" srcSet={lg} />}
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
