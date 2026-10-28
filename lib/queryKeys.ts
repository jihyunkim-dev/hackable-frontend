// TanStack Query 키 모음. 같은 데이터는 같은 키를 써야 캐시를 함께 쓰고, 한 번에 갱신(invalidate)할 수 있다.
// 예: 북마크를 누른 뒤 queryClient.invalidateQueries({ queryKey: queryKeys.mypage.activity() })
export const queryKeys = {
  mypage: {
    all: ["mypage"] as const,
    // GET /auth/me
    me: () => [...queryKeys.mypage.all, "me"] as const,
    // 북마크(프로젝트·지원사업·팀빌딩)와 내가 쓴 팀빌딩. 토큰 재발급이 겹치지 않도록 한 번에 받는다. (app/api/mypage/activity)
    activity: () => [...queryKeys.mypage.all, "activity"] as const,
  },
};
