"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import MultiLine from "@/components/ui/MultiLine";
import { policyContent } from "@/configs/contents/policies";
import { signInContent } from "@/configs/contents/signIn";
import { commonIconUrl, signInLogoUrl } from "@/configs/urls";
import { startSocialLogin } from "@/hooks/useAuth";
import { setLoginModalOpen, useLoginModalOpen } from "@/hooks/useLoginModal";

// 카카오 로그인 버튼 배경은 카카오 브랜드 가이드 색상을 그대로 쓴다.
const KAKAO_YELLOW = "bg-[#FEE500]";

// 레이아웃에 하나 두는 공용 로그인 모달. openLoginModal()로 연다. (hooks/useLoginModal)
export function GlobalSignInModal() {
  const open = useLoginModalOpen();
  return <SignInModal open={open} onOpenChange={setLoginModalOpen} />;
}

// 로그인 모달 (URL 없이 열림)
// trigger를 넘기면 그 버튼으로 열고, open/onOpenChange를 넘기면 밖에서 연다.
// 카카오: 백엔드 카카오 로그인으로 이동했다가 /auth/kakao/callback 으로 돌아온다.
// 구글: 백엔드 구글 로그인으로 이동했다가 /auth/google 로 돌아온다.
export default function SignInModal({
  trigger,
  open,
  onOpenChange,
}: {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
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
                onClick={() => startSocialLogin("google")}
                className="bg-white"
              />
              <SocialButton
                icon={commonIconUrl.kakao}
                label={signInContent.kakao}
                onClick={() => startSocialLogin("kakao")}
                className={KAKAO_YELLOW}
              />
            </div>
            <Agreement />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// 약관 링크를 누르면 모달을 닫고 해당 페이지로 이동한다.
function Agreement() {
  const { agreement } = signInContent;
  const linkClass = "underline underline-offset-2 hover:text-gray-700";

  return (
    <p className="px-2 text-center text-body-s break-keep text-gray-500">
      {agreement.prefix}{" "}
      <Dialog.Close asChild>
        <Link href={policyContent.terms.href} className={linkClass}>
          {agreement.terms}
        </Link>
      </Dialog.Close>
      {agreement.and}{" "}
      <Dialog.Close asChild>
        <Link href={policyContent.privacy.href} className={linkClass}>
          {agreement.privacy}
        </Link>
      </Dialog.Close>
      {agreement.suffix}
    </p>
  );
}

function SocialButton({
  icon,
  label,
  className,
  onClick,
}: {
  icon: string;
  label: string;
  className: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
