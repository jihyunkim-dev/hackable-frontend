import { isAllowedImageUrl } from "@/configs/imageHosts";
import type { UserResponse } from "@/utils/requestToSrv";

// 사용자 프로필 이미지 주소. 쓸 수 없으면 null (기본 사람 아이콘을 보여준다)
// 카카오 프로필 이미지가 http로 올 수 있어 https로 바꿔 쓴다. (같은 주소로 https 제공)
export function getProfileImage(user: UserResponse): string | null {
  const image = user.profile?.profile_image?.replace(/^http:\/\//, "https://");
  return isAllowedImageUrl(image) ? image : null;
}
