export const logoUrl = "/images/logo.svg";

export const navIconUrl = {
  hackathon: "/icons/hackathon-icon.svg",
  grants: "/icons/grants-icon.svg",
  teamBuilding: "/icons/teambuilding-icon.svg",
  clip: "/icons/clip-icon.svg",
};

export const userIconUrl = "/icons/user-icon.svg";

export const snsIconUrl = {
  threads: "/icons/threads-icon.svg",
  instagram: "/icons/instagram-icon.svg",
  naverBlog: "/icons/naver-blog-icon.svg",
};

export const commonIconUrl = {
  bookmarkCard: "/icons/bookmark-card-icon.svg",
  bookmarkClip: "/icons/bookmark-clip-icon.svg",
  clock: "/icons/clock-icon.svg",
  filter: "/icons/filter-icon.svg",
  sort: "/icons/sort-icon.svg",
  search: "/icons/search-icon.svg",
  prev: "/icons/prev-icon.svg",
  ellipsis: "/icons/ellipsis-icon.svg",
  close: "/icons/close-icon.svg",
  back: "/icons/back-icon.svg",
  chevronSmall: "/icons/chevron-sm-icon.svg",
  chevronSmallPurple: "/icons/chevron-sm-purple-icon.svg",
  eye: "/icons/eye-icon.svg",
  eyeSmall: "/icons/eye-card-icon.svg",
  bookmarkOutline: "/icons/bookmark-outline-icon.svg",
  bookmarkCount: "/icons/bookmark-card-count-icon.svg",
  share: "/icons/share-icon.svg",
  imageAdd: "/icons/image-add-icon.svg",
  brandMark: "/icons/h-mark-icon.svg",
  clockPurple: "/icons/clock-purple-icon.svg",
  bookmarkFilled: "/icons/bookmark-filled-icon.svg",
  settings: "/icons/settings-icon.svg",
  check: "/icons/check-icon.svg",
  mail: "/icons/mail-icon.png",
  google: "/icons/google-icon.svg",
  kakao: "/icons/kakao-icon.svg",
};

export const logoPrimaryUrl = "/images/logo-primary.svg";
export const signInLogoUrl = "/images/signin-logo.png";

interface BannerImage {
  src: string;
  width: number;
  height: number;
}

const banner = (name: string, smHeight = 536, xlHeight = 640) => ({
  xs: { src: `/images/banners/${name}-xs.jpg`, width: 780, height: 264 },
  sm: { src: `/images/banners/${name}-sm.jpg`, width: 1536, height: smHeight },
  xl: { src: `/images/banners/${name}-xl.jpg`, width: 2880, height: xlHeight },
});

// 화면 크기별 배너 이미지 (xs: ~767, sm: 768~990, xl: 991~)
export const bannerImageUrl: Record<
  "project" | "hackathon" | "contest" | "grants" | "startupSupport" | "teamBuilding" | "subscribe",
  Record<"xs" | "sm" | "xl", BannerImage>
> = {
  project: banner("project", 544, 650),
  hackathon: banner("hackathon"),
  contest: banner("contest"),
  grants: banner("grants"),
  startupSupport: banner("support"),
  teamBuilding: banner("teambuilding"),
  subscribe: banner("subscribe"),
};

export const mainImageUrl = {
  carouselNewsletter: "/images/main/carousel-newsletter.png",
};

// TODO: API 연동 후 제거
export const dummyImageUrl = {
  projectPoster: "/images/dummy/project-poster.png",
  posterLotte: "/images/dummy/poster-lotte.jpg",
  posterStartup: "/images/dummy/poster-startup.jpg",
  clipFeatured: "/images/dummy/clip-featured.jpg",
  clipWeekly: "/images/dummy/clip-weekly.jpg",
  clipBody: "/images/dummy/clip-body.jpg",
  profile: "/images/dummy/profile.jpg",
  clipThumbnail: "/images/dummy/clip-thumbnail.png",
};
