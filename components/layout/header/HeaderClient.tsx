"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ReactNode, useEffect } from "react";
import SignInModal from "@/components/section/SignInModal";
import Button from "@/components/ui/Button";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { userIconUrl } from "@/configs/urls";
import { useAccount } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { getProfileImage } from "@/utils/profile";
import { showAlert } from "@/hooks/useAlertModal";

interface NavLinkProps {
  href: string;
  className: string;
  activeClassName: string;
  children: ReactNode;
}

// 현재 경로에 맞춰 메뉴 활성 상태를 표시한다.
export function NavLink({
  href,
  className,
  activeClassName,
  children,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
}

// 데스크톱 계정 버튼: 로그인 전엔 로그인 모달, 로그인 후엔 프로필 이미지로 마이페이지 이동
export function AccountButton({
  loginLabel,
  myPage,
}: {
  loginLabel: string;
  myPage: { label: string; href: string };
}) {
  const account = useAccount();

  // 로그인 여부를 알기 전에는 빈 자리만 둔다. (로그인 버튼이 잠깐 보였다 바뀌지 않게)
  if (account.status === "unknown") {
    return <span aria-hidden className="size-9" />;
  }

  if (account.status === "user") {
    return (
      <Link
        href={myPage.href}
        aria-label={myPage.label}
        className="rounded-full ring-primary-200 transition-shadow hover:ring-2"
      >
        <ProfileAvatar
          image={account.user && getProfileImage(account.user)}
          sizes="36px"
          className="size-9"
        />
      </Link>
    );
  }

  return (
    <SignInModal
      trigger={
        <Button variant="secondary" size="sm" className="px-6">
          {loginLabel}
        </Button>
      }
    />
  );
}

// 모바일 계정 아이콘: 로그인 전엔 로그인 모달, 로그인 후엔 프로필 이미지로 마이페이지 이동
export function MobileAccountButton({
  loginLabel,
  myPage,
}: {
  loginLabel: string;
  myPage: { label: string; href: string };
}) {
  const account = useAccount();

  if (account.status === "unknown") {
    return <span aria-hidden className="size-9 rounded-full bg-gray-50" />;
  }

  if (account.status === "user") {
    return (
      <Link
        href={myPage.href}
        aria-label={myPage.label}
        className="rounded-full"
      >
        <ProfileAvatar
          image={account.user && getProfileImage(account.user)}
          sizes="36px"
          className="size-9 bg-gray-50"
        />
      </Link>
    );
  }

  return (
    <SignInModal
      trigger={
        <button
          type="button"
          aria-label={loginLabel}
          className="flex size-9 items-center justify-center rounded-full bg-gray-50"
        >
          <Image src={userIconUrl} alt="" width={16} height={16} />
        </button>
      }
    />
  );
}

// 소셜 로그인에 실패하고 돌아오면(?login_error=안내 문구) 한 번 알려주고 주소에서 지운다.
export function LoginErrorNotice() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const message = url.searchParams.get("login_error");
    if (!message) return;

    url.searchParams.delete("login_error");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);

    showAlert(message);
  }, []);

  return null;
}
