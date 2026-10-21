import Link from "next/link";
import DefaultLayout from "@/components/layout/DefaultLayout";
import ClipCard, { type ClipItem } from "@/components/section/ClipCard";
import ProjectCard, {
  type ProjectItem,
} from "@/components/section/ProjectCard";
import SectionIntro from "@/components/section/SectionIntro";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { mainContent, type OpportunityTabValue } from "@/configs/contents/main";
import { HeroCarousel } from "./MainClientBlock";

interface MainServerBlockProps {
  projects: Record<OpportunityTabValue, ProjectItem[]>;
  clips: ClipItem[];
}

export default function MainServerBlock({
  projects,
  clips,
}: MainServerBlockProps) {
  return (
    <DefaultLayout>
      <HeroSection />
      <CarouselSection />
      <OpportunitySection projects={projects} />
      <ClipSection clips={clips} />
      <ClosingSection />
    </DefaultLayout>
  );
}

/* ===== Hero ===== */

function HeroSection() {
  const { hero } = mainContent;

  return (
    <section className="flex flex-col items-center gap-4 bg-linear-to-b from-primary-50 to-background-normal to-98% px-5 pt-[calc(var(--header-height-mobile)+76px)] pb-19 text-center text-gray-800 md:gap-6 md:pt-[calc(var(--header-height-desktop)+88px)] md:pb-22 lg:pt-[calc(var(--header-height-desktop)+96px)] lg:pb-24">
      <h1 className="text-heading-xl font-extrabold">
        <MultiLine lines={hero.title} />
      </h1>
      <p className="text-body-l">{hero.description}</p>
    </section>
  );
}

/* ===== Carousel ===== */

function CarouselSection() {
  return (
    <section className="px-2 py-5 md:px-3 md:py-4">
      <HeroCarousel slides={mainContent.carousel} />
    </section>
  );
}

/* ===== Opportunity (해커톤·공모전·지원사업) ===== */

function OpportunitySection({
  projects,
}: {
  projects: Record<OpportunityTabValue, ProjectItem[]>;
}) {
  const { opportunity } = mainContent;

  return (
    <section className="py-3">
      <SectionIntro eyebrow={opportunity.eyebrow} title={opportunity.title} />

      <Tabs defaultValue={opportunity.tabs[0].value}>
        <TabsList aria-label="기회 유형" className="gap-5 md:gap-12 lg:gap-21">
          {opportunity.tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-7 w-[94px] text-label-l pb-4"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {opportunity.tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mx-auto w-full max-w-[1296px]"
          >
            <ul className="scrollbar-hidden flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 py-4 sm:gap-6 md:scroll-px-8 md:px-8 md:py-8 lg:py-12">
              {projects[tab.value].map((item) => (
                <li key={item.id} className="snap-start">
                  <ProjectCard item={item} />
                </li>
              ))}
            </ul>

            <div className="px-5 pb-6 md:px-8">
              <Button
                asChild
                variant="outline"
                className="w-full md:h-14 lg:h-[72px]"
              >
                <Link href={tab.moreHref}>{tab.moreLabel}</Link>
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

/* ===== Clip ===== */

function ClipSection({ clips }: { clips: ClipItem[] }) {
  const { clip } = mainContent;

  return (
    <section className="flex flex-col gap-2 py-7 md:gap-8">
      <SectionIntro eyebrow={clip.eyebrow} title={clip.title} />

      <ul className="mx-auto flex w-full flex-col gap-3 px-3 sm:max-w-[680px] sm:gap-8 sm:px-0 md:max-w-[840px] lg:max-w-[1020px]">
        {clips.map((item) => (
          <li key={item.id}>
            <ClipCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ===== Closing ===== */

function ClosingSection() {
  const { closing } = mainContent;

  return (
    <section className="flex flex-col items-center gap-4 bg-linear-to-b from-white to-primary-50 px-2.5 py-20 text-center">
      <div className="flex flex-col gap-2 p-3 md:gap-6">
        <h2 className="text-heading-m font-extrabold text-gray-800">
          <MultiLine lines={closing.title} />
        </h2>
        <p className="text-label-l text-primary-500">{closing.description}</p>
      </div>

      <Button asChild variant="gradient" className="w-80 md:h-15 md:w-[520px]">
        <Link href={closing.href}>{closing.buttonLabel}</Link>
      </Button>
    </section>
  );
}
