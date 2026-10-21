import Image from "next/image";
import Link from "next/link";
import { companyInfo } from "@/configs/companyInfo";
import { logoUrl } from "@/configs/urls";

export default function Footer() {
  return (
    <footer className="bg-gray-100 px-4 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-14 lg:py-20 xl:px-17 xl:py-24">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-4">
        <Image
          src={logoUrl}
          alt={companyInfo.name}
          width={109}
          height={21}
          className="h-auto w-28 xl:w-36"
        />

        <SnsLinks />

        <ul className="col-span-2 mt-5 flex items-center text-body-s text-gray-700 sm:mt-4">
          {companyInfo.policies.map((policy, index) => (
            <li key={policy.href} className="flex items-center">
              {index > 0 && (
                <span aria-hidden className="mx-2.5 h-3 w-px bg-gray-700" />
              )}
              <Link href={policy.href} className="hover:text-gray-900">
                {policy.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="col-span-2 mt-2 text-body-s text-gray-600 sm:mt-8">
          {companyInfo.copyright}
        </p>
      </div>
    </footer>
  );
}

// 외부 SNS 서비스로 이어지는 링크
function SnsLinks() {
  return (
    <ul className="flex items-center gap-4 md:gap-6 lg:gap-8">
      {companyInfo.sns.map((sns) => (
        <li key={sns.label}>
          <a
            href={sns.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={sns.label}
            className="flex size-9 items-center justify-center rounded-full bg-white transition-shadow hover:shadow-sm sm:size-10 lg:size-11"
          >
            <Image
              src={sns.icon}
              alt=""
              width={28}
              height={28}
              className="size-6 lg:size-7"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
