import Image from "next/image";
import Link from "next/link";
import ShareButton from "@/components/ui/ShareButton";
import StatusBadge from "@/components/ui/StatusBadge";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

export interface TeamBuildingDetail {
  id: string;
  isOpen: boolean;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  bookmarks: number;
  body: string;
  position: string;
  deadline: string;
}

// 팀빌딩 상세 본문. lg 이상에서는 왼쪽 뒤로가기, 오른쪽 상태·북마크·공유 열이 붙는다.
export default function TeamBuildingDetailSection({
  detail,
  banner,
}: {
  detail: TeamBuildingDetail;
  banner: React.ReactNode;
}) {
  const content = teamBuildingContent.detail;

  return (
    <section className="mx-auto flex w-full max-w-[1440px] items-start justify-center gap-5 lg:px-20 lg:py-16">
      <Link
        href="/teambuilding"
        aria-label={content.backLabel}
        className="sticky top-[calc(var(--header-height-desktop)+24px)] hidden shrink-0 rounded-lg border border-gray-300 p-1 hover:bg-gray-50 lg:block"
      >
        <Image src={commonIconUrl.back} alt="" width={28} height={28} />
      </Link>

      <article className="flex w-full min-w-0 flex-col lg:max-w-[991px] lg:gap-4">
        <div className="overflow-hidden lg:rounded-2xl">{banner}</div>

        <div className="flex flex-col px-3 py-3 lg:p-0">
          <div className="py-2.5 lg:hidden">
            <StatusBadge isOpen={detail.isOpen} />
          </div>
          <header className="flex flex-col py-2.5 lg:py-0">
            <h1 className="text-heading-m text-black lg:py-4">{detail.title}</h1>
            <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
              {detail.author && (
                <span className="text-body-l text-gray-800 lg:py-2.5">
                  {detail.author}
                </span>
              )}
              <span className="flex w-full items-center gap-1 text-body-m text-gray-500 lg:w-auto lg:gap-2.5 lg:px-2.5">
                <time>{detail.createdAt}</time>
                <Image src={commonIconUrl.eye} alt="조회수" width={19} height={19} className="size-3 lg:size-[19px]" />
                {detail.views}
              </span>
            </p>
          </header>

          <div className="flex flex-col py-3 lg:gap-8">
            <div className="text-body-l whitespace-pre-line text-gray-800">
              {detail.body}
            </div>
            {/* 모집 포지션이 비어 있으면 항목째 숨긴다. */}
            {detail.position && (
              <InfoBlock label={content.positionLabel} value={detail.position} />
            )}
            <InfoBlock label={content.deadlineLabel} value={detail.deadline} />
          </div>
        </div>

        <DetailActions detail={detail} className="justify-center px-18 py-5 lg:hidden" />
      </article>

      <aside className="sticky top-[calc(var(--header-height-desktop)+24px)] hidden w-[116px] shrink-0 flex-col gap-2.5 px-2 py-1 lg:flex">
        <StatusBadge isOpen={detail.isOpen} className="h-11 w-full text-label-l" />
        <DetailActions detail={detail} className="flex-col" itemClassName="h-11 w-full" />
      </aside>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 py-6 lg:py-2">
      <h2 className="text-heading-s text-rose-500 lg:font-bold">{label}</h2>
      <p className="text-body-l text-gray-800">{value}</p>
    </div>
  );
}

function DetailActions({
  detail,
  className,
  itemClassName = "h-11 w-[117px]",
}: {
  detail: TeamBuildingDetail;
  className?: string;
  itemClassName?: string;
}) {
  const content = teamBuildingContent.detail;

  return (
    <div className={cn("flex gap-2.5", className)}>
      {/* TODO: 북마크 API 연동 */}
      <button
        type="button"
        aria-label={`${content.bookmarkLabel} ${detail.bookmarks}`}
        className={cn(
          "flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white text-label-l text-gray-700 shadow-[0_1px_0_rgb(0_0_0/0.06)] hover:bg-gray-50",
          itemClassName,
        )}
      >
        <Image src={commonIconUrl.bookmarkOutline} alt="" width={12} height={15} />
        {detail.bookmarks}
      </button>
      <ShareButton
        label={content.shareLabel}
        copiedLabel={content.copiedLabel}
        title={detail.title}
        className={itemClassName}
      />
    </div>
  );
}
