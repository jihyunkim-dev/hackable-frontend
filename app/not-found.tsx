// 없는 주소로 들어왔을 때 보여 주는 화면 (피그마 Wireframe > 404)
// - 모바일: 404 숫자 → 안내 문구 → 버튼을 가운데로 쌓는다.
// - xl(1440) 이상: 왼쪽에 로고·안내 문구·버튼, 오른쪽에 404 숫자
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { suiteDigits } from "@/app/font";
import { notFoundContent } from "@/configs/contents/notFound";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import appIcon from "@/public/images/app-icon.svg";

// 404 화면은 Next가 검색 제외(noindex)를 붙인다.
export const metadata: Metadata = pageMetadata(seoContent.notFound);

export default function NotFound() {
  const content = notFoundContent;

  return (
    <section className="bg-white xl:flex xl:min-h-[766px] xl:items-center">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 pt-[113px] pb-[99px] text-center xl:grid xl:grid-cols-[1fr_457px] xl:items-center xl:pt-0 xl:pr-[178px] xl:pb-0 xl:pl-[161px] xl:text-left">
        <div className="text-gray-600 xl:order-2 xl:text-center">
          <p
            className={cn(
              suiteDigits.className,
              "text-[60px] leading-[64px] font-extrabold tracking-[0.16em] xl:text-[120px] xl:leading-[149px]",
            )}
          >
            {content.code}
          </p>
          <p className="text-[28px] leading-[35px] font-light tracking-[0.02em] xl:text-[36px] xl:leading-[49px]">
            {content.codeLabel}
          </p>
        </div>

        <div className="mt-[34px] flex flex-col items-center xl:order-1 xl:mt-0 xl:items-start xl:pt-10">
          <Image
            src={appIcon}
            alt=""
            width={68}
            height={68}
            className="mb-5 hidden rounded-[20px] xl:block"
          />
          <h1 className="text-[28px] leading-[1.25] font-semibold tracking-[0.02em] text-gray-700 xl:text-[44px]">
            {content.title}
          </h1>
          <p className="mt-5 text-[16px] leading-6 tracking-[0.02em] text-gray-500 xl:text-[20px]">
            {content.description}
          </p>
          <Link
            href={content.homeLink.href}
            className="mt-[41px] flex h-12 w-[152px] items-center justify-center rounded-full bg-primary-400 text-[16px] font-semibold tracking-[0.02em] text-white transition-colors hover:bg-primary-500 xl:mt-[62px] xl:h-[54px] xl:w-[200px] xl:text-[20px]"
          >
            {content.homeLink.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
