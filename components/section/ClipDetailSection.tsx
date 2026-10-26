import Image from "next/image";
import ClipToc from "@/components/section/ClipToc";
import ShareButton from "@/components/ui/ShareButton";
import { clipContent } from "@/configs/contents/clip";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

export type ClipBlock =
  | { type: "paragraph"; text: string }
  // 서버에서 마크다운을 변환·sanitize한 HTML (API 본문)
  | { type: "html"; html: string }
  | { type: "heading"; id: string; text: string }
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    };

export interface ClipDetail {
  id: string;
  category: string;
  title: string;
  readTime: string;
  createdAt: string;
  views: number;
  bookmarks: number;
  blocks: ClipBlock[];
  // 목차. 없으면 heading 블록에서 만든다.
  headings?: { id: string; text: string }[];
}

// 마크다운 본문 스타일. 제목·문단·목록·표·이미지·캡션(*기울임*)을 기존 블록 스타일과 맞춘다.
const MARKDOWN_STYLE = cn(
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

// 클립 상세 본문. lg 이상: 왼쪽 북마크·공유 / 가운데 본문 / 오른쪽 목차
export default function ClipDetailSection({ detail }: { detail: ClipDetail }) {
  const content = clipContent.detail;
  const headings =
    detail.headings ??
    detail.blocks.flatMap((block) =>
      block.type === "heading" ? [{ id: block.id, text: block.text }] : [],
    );

  return (
    <section className="mx-auto flex w-full max-w-[1440px] justify-center">
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-[calc(var(--header-height-desktop)+24px)] flex flex-col items-center gap-9 px-10 py-17">
          {/* 80px 버튼에는 원본 크기 아이콘을 써서 선 두께(2px)를 유지한다. */}
          <BookmarkButton
            label={content.bookmarkLabel}
            icon={{
              src: commonIconUrl.bookmarkOutlineLarge,
              width: 25,
              height: 30,
            }}
            className="size-20 rounded-[18px]"
          />
          <ShareButton
            label={content.shareLabel}
            copiedLabel={content.copiedLabel}
            title={detail.title}
            iconOnly
            icon={{ src: commonIconUrl.shareLarge, width: 36, height: 31 }}
            className="size-20 rounded-[18px] border-gray-200 shadow-none"
          />
        </div>
      </aside>

      <article className="w-full min-w-0 lg:max-w-[978px] lg:px-5 lg:py-17">
        <header className="flex flex-col gap-2.5 px-4 py-2.5 lg:gap-0 lg:p-0">
          <div className="flex items-center justify-between">
            <p className="text-body-m text-gray-700 lg:text-heading-xs lg:text-gray-500">
              {detail.category}
            </p>
            <div className="flex gap-2.5 lg:hidden">
              <BookmarkButton
                label={content.bookmarkLabel}
                className="size-8 rounded-sm border-gray-100"
                iconClassName="h-3.5 w-3"
              />
              <ShareButton
                label={content.shareLabel}
                copiedLabel={content.copiedLabel}
                title={detail.title}
                iconOnly
                iconClassName="h-3 w-3.5"
                className="size-8 rounded-sm border-gray-100 shadow-none"
              />
            </div>
          </div>
          <h1 className="text-heading-m text-gray-700 lg:py-1 lg:font-bold lg:text-gray-800">
            {detail.title}
          </h1>
        </header>

        <p className="flex items-center gap-2 px-4 py-2 text-label-s text-gray-700 lg:px-0 lg:text-label-m">
          {/* 읽는 시간이 없으면 시계 아이콘과 구분점을 함께 숨긴다. */}
          {detail.readTime && (
            <>
              <span className="flex items-center gap-2">
                <Image
                  src={commonIconUrl.clockPurple}
                  alt=""
                  width={16}
                  height={16}
                  className="lg:size-5"
                />
                {detail.readTime}
              </span>
              <span aria-hidden className="text-gray-500">
                ∙
              </span>
            </>
          )}
          <time>{detail.createdAt}</time>
          <span className="ml-auto flex items-center gap-1 lg:gap-2.5">
            <Image
              src={commonIconUrl.eye}
              alt="조회수"
              width={19}
              height={19}
              className="size-4 lg:size-[19px]"
            />
            {detail.views}
          </span>
        </p>

        <div className="flex flex-col gap-2.5 px-4 py-5 text-black lg:gap-5 lg:px-0 lg:py-16">
          {detail.blocks.map((block, index) => (
            <ClipBlockView key={index} block={block} />
          ))}
        </div>
      </article>

      {headings.length > 0 && (
        <aside className="hidden w-[222px] shrink-0 px-5 pt-23 xl:block">
          <div className="sticky top-[calc(var(--header-height-desktop)+24px)]">
            <ClipToc label={content.tocLabel} headings={headings} />
          </div>
        </aside>
      )}
    </section>
  );
}

function ClipBlockView({ block }: { block: ClipBlock }) {
  if (block.type === "html") {
    return (
      // 표가 화면보다 넓으면 본문 안에서 가로 스크롤
      <div
        className={cn(MARKDOWN_STYLE, "overflow-x-auto")}
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    );
  }

  if (block.type === "heading") {
    return (
      <h2
        id={block.id}
        className="scroll-mt-[calc(var(--header-height-desktop)+24px)] pt-2 text-body-l lg:text-heading-s lg:text-gray-800"
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === "image") {
    return (
      <figure className="flex flex-col gap-2">
        <Image
          src={block.src}
          alt={block.alt}
          width={block.width}
          height={block.height}
          sizes="(min-width: 1200px) 938px, 100vw"
          className="h-auto w-full rounded-sm lg:rounded-lg"
        />
        {block.caption && (
          <figcaption className="text-body-s text-gray-500">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <p className="text-body-m whitespace-pre-line lg:text-body-l">
      {block.text}
    </p>
  );
}

// TODO: 북마크 API 연동
function BookmarkButton({
  label,
  icon = { src: commonIconUrl.bookmarkOutline, width: 12, height: 15 },
  className,
  iconClassName,
}: {
  label: string;
  // 아이콘 이미지 교체용 (기본: 작은 북마크 아이콘)
  icon?: { src: string; width: number; height: number };
  className?: string;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex items-center justify-center border border-gray-200 bg-white transition-colors hover:bg-gray-50",
        className,
      )}
    >
      <Image
        src={icon.src}
        alt=""
        width={icon.width}
        height={icon.height}
        className={iconClassName}
      />
    </button>
  );
}
