import { navIconUrl } from "@/configs/urls";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { label: "해커톤", href: "/project", icon: navIconUrl.hackathon },
  { label: "지원사업", href: "/startup-support", icon: navIconUrl.grants },
  { label: "팀빌딩", href: "/teambuilding", icon: navIconUrl.teamBuilding },
  { label: "클립", href: "/clip", icon: navIconUrl.clip },
];

export const headerActions = {
  home: { label: "Hackable 홈", href: "/" },
  subscribe: { label: "구독 안내", href: "/newsletter/subscribe" },
  login: { label: "로그인" },
  myPage: { label: "마이페이지", href: "/mypage" },
};
