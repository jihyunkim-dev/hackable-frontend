"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { ReactNode } from "react";
import MultiLine from "@/components/ui/MultiLine";
import { signInContent } from "@/configs/contents/signIn";
import { commonIconUrl, signInLogoUrl } from "@/configs/urls";

// 카카오 로그인 버튼 배경은 카카오 브랜드 가이드 색상을 그대로 쓴다.
const KAKAO_YELLOW = "bg-[#FEE500]";

// 로그인 모달 (URL 없이 열림)
// TODO: 구글·카카오 소셜 로그인 연동
export default function SignInModal({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[60] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-50 outline-none sm:w-[467px]">
          <div className="flex justify-end p-1">
            <Dialog.Close aria-label={signInContent.close}>
              <Image
                src={commonIconUrl.close}
                alt=""
                width={40}
                height={40}
                className="size-7 sm:size-10"
              />
            </Dialog.Close>
          </div>

          <div className="flex flex-col items-center gap-2 py-3 text-center sm:gap-3">
            <Image
              src={signInLogoUrl}
              alt="hackable"
              width={191}
              height={62}
              className="h-[38px] w-auto sm:h-[62px]"
            />
            <Dialog.Title className="text-label-l font-bold text-gray-700 sm:text-heading-xs sm:font-semibold">
              <MultiLine lines={signInContent.title} />
            </Dialog.Title>
            <Dialog.Description className="text-body-m font-medium text-gray-500">
              <MultiLine lines={signInContent.description} />
            </Dialog.Description>
          </div>

          <div className="flex flex-col gap-2 px-7 py-2 pb-5">
            <p className="flex items-center gap-1.5 text-body-s text-gray-400">
              <span aria-hidden className="h-px flex-1 bg-gray-300" />
              {signInContent.divider}
              <span aria-hidden className="h-px flex-1 bg-gray-300" />
            </p>
            <div className="flex flex-col gap-3 px-2 py-4">
              <SocialButton
                icon={commonIconUrl.google}
                label={signInContent.google}
                className="bg-white"
              />
              <SocialButton
                icon={commonIconUrl.kakao}
                label={signInContent.kakao}
                className={KAKAO_YELLOW}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SocialButton({
  icon,
  label,
  className,
}: {
  icon: string;
  label: string;
  className: string;
}) {
  return (
    <button
      type="button"
      className={`flex h-8 items-center rounded-lg px-4 text-body-s text-gray-800 shadow-xs transition-opacity hover:opacity-90 sm:h-10 sm:px-6 sm:text-body-m sm:font-medium ${className}`}
    >
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        className="size-4 sm:size-5"
      />
      <span className="flex-1 text-center">{label}</span>
    </button>
  );
}
