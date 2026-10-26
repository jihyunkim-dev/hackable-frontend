// TanStack Query 키 모음. 같은 데이터는 같은 키를 써야 캐시를 함께 쓰고, 한 번에 갱신(invalidate)할 수 있다.
// 예: 북마크를 누른 뒤 queryClient.invalidateQueries({ queryKey: queryKeys.mypage.bookmarks.all })
export const queryKeys = {
  mypage: {
    all: ["mypage"] as const,
    // GET /auth/me
    me: () => [...queryKeys.mypage.all, "me"] as const,
    bookmarks: {
      all: ["mypage", "bookmarks"] as const,
      // GET /project/bookmark
      projects: () => [...queryKeys.mypage.bookmarks.all, "projects"] as const,
      // GET /startup-support/bookmark
      grants: () => [...queryKeys.mypage.bookmarks.all, "grants"] as const,
      // GET /teambuildings/bookmark
      teamBuildings: () =>
        [...queryKeys.mypage.bookmarks.all, "teamBuildings"] as const,
    },
    // GET /teambuildings/me
    myTeamBuildings: () =>
      [...queryKeys.mypage.all, "myTeamBuildings"] as const,
  },
};
