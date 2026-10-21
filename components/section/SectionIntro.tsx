import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface SectionIntroProps {
  eyebrow: string;
  title: string[];
  className?: string;
}

export default function SectionIntro({
  eyebrow,
  title,
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2.5 px-4.5 py-8 text-center md:py-10",
        className,
      )}
    >
      <p className="text-heading-xs text-primary-500">{eyebrow}</p>
      <h2 className="text-heading-m font-bold text-gray-800">
        {title.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </h2>
    </div>
  );
}
