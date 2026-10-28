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
  hackableWhite: "/icons/hackable-white-icon.svg",
  plus: "/icons/plus-icon.svg",
  // 클립 상세 lg 이상 80px 버튼용 (선 두께 2px 원본 크기)
  bookmarkOutlineLarge: "/icons/bookmark-outline-lg-icon.svg",
  // 북마크한 상태 (위 아이콘들의 채운 버전)
  bookmarkCardFilled: "/icons/bookmark-card-filled-icon.svg",
  bookmarkClipFilled: "/icons/bookmark-clip-filled-icon.svg",
  bookmarkFilledSmall: "/icons/bookmark-filled-sm-icon.svg",
  bookmarkFilledLarge: "/icons/bookmark-filled-lg-icon.svg",
  shareLarge: "/icons/share-lg-icon.svg",
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
  | "project"
  | "hackathon"
  | "contest"
  | "grants"
  | "startupSupport"
  | "teamBuilding"
  | "subscribe",
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

// 띠배너 (991x220, 문구·버튼이 이미지 안에 있다). 화면 크기와 관계없이 같은 이미지를 쓴다.
function stripBanner(name: string): Record<"xs" | "sm" | "xl", BannerImage> {
  const image = {
    src: `/images/banners/strip-${name}.png`,
    width: 991,
    height: 220,
  };
  return { xs: image, sm: image, xl: image };
}

export const stripBannerUrl = {
  teamBuilding: stripBanner("teambuilding"),
  startupSupport: stripBanner("support"),
  clip: stripBanner("clip"),
  hackathon: stripBanner("hackathon"),
  kakao: stripBanner("kakao"),
};

// 클립 페이지 lg 이상: 캐러셀 아래 좁은 칸에 들어가는 구독 배너
export const subscribeClipBannerUrl: BannerImage = {
  src: "/images/banners/subscribe-clip-lg.jpg",
  width: 1860,
  height: 636,
};

// 지원사업 주최 기관 로고 (512x512 JPG). 주소 규칙: {기관 로고 폴더}/{hosted}.jpg
// 모든 기관에 로고가 있는 건 아니라서, 쓰기 전에 있는지 확인한다. (utils/grant.ts)
export const hostLogoBaseUrl = "https://cdn.hackable.co.kr/웹용_512_JPG";

// 썸네일이 없을 때 보여주는 "이미지 준비중" 이미지
export const placeholderImageUrl = {
  thumbnail: "/images/thumbnail-placeholder.png",
};

// 메인 히어로 캐러셀 이미지 (16:9, 1920x1080)
// TODO: carousel-newsletter.png는 8:5(1278x800)라 16:9 칸에서 위아래가 조금 잘린다. 16:9로 다시 만들어야 함
export const mainImageUrl = {
  carouselNewsletter: "/images/main/carousel-newsletter.png",
  carouselTeamBuilding: "/images/main/carousel-teambuilding.png",
  carouselStartupSupport: "/images/main/carousel-startup-support.png",
  carouselClip: "/images/main/carousel-clip.png",
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
