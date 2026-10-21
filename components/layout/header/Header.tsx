import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import Button from "@/components/ui/Button";
import { logoUrl, userIconUrl } from "@/configs/urls";
import { LoginButton, NavLink } from "./HeaderClient";
import { headerActions, navItems } from "./navigation";

export default function Header() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-(--header-height-mobile) bg-background-normal md:h-(--header-height-desktop)">
        <div className="relative flex h-full items-center justify-between px-5">
          <Link href={headerActions.home.href} aria-label={headerActions.home.label}>
            <Image src={logoUrl} alt="hackable" width={109} height={21} priority />
          </Link>

          <DesktopNav />

          <DesktopActions />
          <MobileActions />
        </div>
      </header>

      <MobileNavBar />
    </>
  );
}

/* ===== Desktop (md 이상) ===== */

function DesktopNav() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="absolute left-1/2 hidden -translate-x-1/2 md:block"
    >
      <ul className="flex items-center gap-10 lg:gap-12">
        {navItems.map((item) => (
          <li key={item.href}>
            <ActiveLink
              href={item.href}
              className="text-label-l text-gray-800 transition-colors hover:text-primary-500"
              activeClassName="text-primary-500"
            >
              {item.label}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function DesktopActions() {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button asChild size="sm">
        <Link href={headerActions.subscribe.href}>
          {headerActions.subscribe.label}
        </Link>
      </Button>
      <LoginButton label={headerActions.login.label} />
    </div>
  );
}

/* ===== Mobile (xs, sm) ===== */

function MobileActions() {
  return (
    <div className="flex items-center gap-4 md:hidden">
      <Link
        href={headerActions.subscribe.href}
        className="text-label-m text-primary-500"
      >
        {headerActions.subscribe.label}
      </Link>
      <Link
        href={headerActions.myPage.href}
        aria-label={headerActions.myPage.label}
        className="flex size-9 items-center justify-center rounded-full bg-gray-50"
      >
        <Image src={userIconUrl} alt="" width={16} height={16} />
      </Link>
    </div>
  );
}

function MobileNavBar() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-background-normal pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-(--navbar-height-mobile) grid-cols-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <ActiveLink
              href={item.href}
              className="flex h-full flex-col items-center justify-center gap-1 text-label-s text-gray-800"
              activeClassName="text-primary-500"
            >
              <Image src={item.icon} alt="" width={24} height={24} />
              {item.label}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ===== 공통 ===== */

interface ActiveLinkProps {
  href: string;
  className: string;
  activeClassName: string;
  children: ReactNode;
}

// usePathname이 프리렌더 시점에 확정되지 않는 경로를 위해 Suspense로 감싼다.
// fallback은 활성 표시만 없는 동일한 링크라 레이아웃 변화가 없다.
function ActiveLink({ href, className, activeClassName, children }: ActiveLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={href} className={className}>
          {children}
        </Link>
      }
    >
      <NavLink href={href} className={className} activeClassName={activeClassName}>
        {children}
      </NavLink>
    </Suspense>
  );
}
