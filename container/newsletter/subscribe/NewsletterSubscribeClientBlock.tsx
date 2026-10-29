"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import { newsletterSubscribeContent } from "@/configs/contents/newsletter";
import { commonIconUrl, logoPrimaryUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";
import { RequestNewsletterSubscribe } from "@/utils/requestToSrv";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 이메일과 필수 동의가 채워져야 구독 버튼이 활성화되고, 구독 신청에 성공하면 완료 화면으로 바뀐다.
export function NewsletterSubscribeForm() {
  const content = newsletterSubscribeContent;
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canSubmit = EMAIL_PATTERN.test(email) && agreed && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setHasError(false);
    const trimmedEmail = email.trim();
    const result = await RequestNewsletterSubscribe({ email: trimmedEmail });
    setIsSubmitting(false);

    if (result) setSubmittedEmail(trimmedEmail);
    else setHasError(true);
  };

  if (submittedEmail) {
    return (
      <div
        aria-live="polite"
        className="flex flex-col items-center gap-1 p-2 text-center"
      >
        <Image
          src={commonIconUrl.mail}
          alt=""
          width={120}
          height={128}
          className="h-[92px] w-auto lg:h-30"
        />
        <p className="p-2.5 text-body-m font-medium text-primary-500">
          {submittedEmail}
        </p>
        <p className="py-5 text-body-m font-medium text-gray-700">
          <MultiLine lines={content.success.notice} />
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center gap-2.5 p-2.5 text-center">
        <Image
          src={logoPrimaryUrl}
          alt="hackable"
          width={174}
          height={33}
          className="h-[22px] w-auto lg:h-[33px]"
        />
        <p className="p-2.5 text-body-m font-medium text-gray-600">
          <MultiLine lines={content.description} />
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[350px] flex-col gap-2 py-5"
      >
        <div className="flex flex-col gap-2 py-5">
          <label htmlFor={`${fieldId}-email`} className="sr-only">
            {content.emailLabel}
          </label>
          <input
            id={`${fieldId}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setHasError(false);
            }}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? `${fieldId}-error` : undefined}
            placeholder={content.emailPlaceholder}
            className="h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-body-m font-medium text-gray-800 outline-none placeholder:text-gray-500 focus:border-primary-300"
          />
          {/* 체크 박스는 동의 체크, 문구는 동의 내용 모달을 연다. */}
          <div className="flex items-center gap-2 py-2.5">
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                aria-label={`${content.consentLabel} ${content.requiredLabel}`}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex size-5 items-center justify-center rounded-sm border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300",
                  agreed
                    ? "border-primary-500 bg-primary-500"
                    : "border-gray-300 bg-white",
                )}
              >
                {agreed && (
                  <Image
                    src={commonIconUrl.check}
                    alt=""
                    width={20}
                    height={20}
                  />
                )}
              </span>
            </label>
            <ConsentModal onAgree={() => setAgreed(true)} />
            <span className="ml-auto text-body-m font-medium text-gray-400">
              {content.requiredLabel}
            </span>
          </div>
        </div>
        {hasError && (
          <p
            id={`${fieldId}-error`}
            role="alert"
            className="text-body-s font-medium text-destructive-300"
          >
            {content.error}
          </p>
        )}
        <Button
          type="submit"
          disabled={!canSubmit}
          aria-busy={isSubmitting || undefined}
          className="h-10 w-full rounded-sm text-label-m font-bold disabled:bg-gray-200 disabled:text-gray-500"
        >
          {isSubmitting ? content.submitting : content.submit}
        </Button>
      </form>
    </div>
  );
}

// 개인정보 수집∙이용 동의 내용 모달. 내용이 길면 모달 안에서 스크롤한다.
// "동의하기"를 누르면 동의 체크까지 하고 닫는다.
function ConsentModal({ onAgree }: { onAgree: () => void }) {
  const content = newsletterSubscribeContent;
  const consent = content.consent;

  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-left text-body-m font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900">
        {content.consentLabel}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[60] flex max-h-[80vh] w-[calc(100%-32px)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white outline-none">
          <div className="flex items-start gap-2 border-b border-gray-200 py-3 pr-2 pl-5">
            <Dialog.Title className="flex-1 pt-1.5 text-body-l font-bold break-keep text-gray-800">
              {consent.title}
            </Dialog.Title>
            <Dialog.Close aria-label={consent.close} className="shrink-0">
              <Image
                src={commonIconUrl.close}
                alt=""
                width={40}
                height={40}
                className="size-8"
              />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 text-body-m text-gray-700">
            <Dialog.Description>{consent.intro}</Dialog.Description>
            <dl className="mt-4 flex flex-col gap-3 rounded-lg bg-gray-50 p-4">
              {consent.items.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <dt className="text-body-s font-bold text-gray-800">
                    {item.label}
                  </dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-body-s text-gray-500">{consent.notice}</p>
            <Link
              href={consent.policyLink.href}
              target="_blank"
              className="mt-2 inline-block text-body-s text-primary-500 underline"
            >
              {consent.policyLink.label}
            </Link>
          </div>

          <div className="border-t border-gray-200 p-4">
            <Dialog.Close asChild>
              <Button
                type="button"
                onClick={onAgree}
                className="h-10 w-full rounded-sm text-label-m font-bold"
              >
                {consent.agree}
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
