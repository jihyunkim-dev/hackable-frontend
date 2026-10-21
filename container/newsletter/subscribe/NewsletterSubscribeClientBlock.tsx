"use client";

import Image from "next/image";
import { FormEvent, useId, useState } from "react";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import { newsletterSubscribeContent } from "@/configs/contents/newsletter";
import { commonIconUrl, logoPrimaryUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 이메일과 필수 동의가 채워져야 구독 버튼이 활성화되고, 제출하면 완료 화면으로 바뀐다.
// TODO: 구독 API 연동
export function NewsletterSubscribeForm() {
  const content = newsletterSubscribeContent;
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>();

  const canSubmit = EMAIL_PATTERN.test(email) && agreed;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) setSubmittedEmail(email);
  };

  if (submittedEmail) {
    return (
      <div aria-live="polite" className="flex flex-col items-center gap-1 p-2 text-center">
        <Image src={commonIconUrl.mail} alt="" width={120} height={128} className="h-[92px] w-auto lg:h-30" />
        <p className="p-2.5 text-body-m font-medium text-primary-500">{submittedEmail}</p>
        <p className="py-5 text-body-m font-medium text-gray-700">
          <MultiLine lines={content.success.notice} />
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center gap-2.5 p-2.5 text-center">
        <Image src={logoPrimaryUrl} alt="hackable" width={174} height={33} className="h-[22px] w-auto lg:h-[33px]" />
        <p className="p-2.5 text-body-m font-medium text-gray-600">
          <MultiLine lines={content.description} />
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-[350px] flex-col gap-2 py-5">
        <div className="flex flex-col gap-2 py-5">
          <label htmlFor={`${fieldId}-email`} className="sr-only">
            {content.emailLabel}
          </label>
          <input
            id={`${fieldId}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={content.emailPlaceholder}
            className="h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-body-m font-medium text-gray-800 outline-none placeholder:text-gray-500 focus:border-primary-300"
          />
          <label className="flex cursor-pointer items-center gap-2 py-2.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "flex size-5 items-center justify-center rounded-sm border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300",
                agreed ? "border-primary-500 bg-primary-500" : "border-gray-300 bg-white",
              )}
            >
              {agreed && <Image src={commonIconUrl.check} alt="" width={20} height={20} />}
            </span>
            <span className="text-body-m font-medium text-gray-700">{content.consentLabel}</span>
            <span className="ml-auto text-body-m font-medium text-gray-400">
              {content.requiredLabel}
            </span>
          </label>
        </div>
        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-10 w-full rounded-sm text-label-m font-bold disabled:bg-gray-200 disabled:text-gray-500"
        >
          {content.submit}
        </Button>
      </form>
    </div>
  );
}
