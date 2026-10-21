"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import SignInModal from "@/components/section/SignInModal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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

// 로그인 버튼: 누르면 로그인 모달이 열린다. (URL 이동 없음)
export function LoginButton({ label }: { label: string }) {
  return (
    <SignInModal
      trigger={
        <Button variant="secondary" size="sm" className="px-6">
          {label}
        </Button>
      }
    />
  );
}
