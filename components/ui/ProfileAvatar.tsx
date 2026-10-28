import Image from "next/image";
import { userIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  // 없으면 기본 사람 아이콘
  image: string | null;
  // 이미지 요청 크기 (next/image sizes). 화면에 보이는 크기와 맞춘다.
  sizes: string;
  className?: string;
  iconClassName?: string;
}

// 둥근 프로필 이미지. 헤더 마이페이지 버튼과 마이페이지 프로필에서 함께 쓴다.
export default function ProfileAvatar({
  image,
  sizes,
  className,
  iconClassName,
}: ProfileAvatarProps) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100",
        className,
      )}
    >
      {image ? (
        <Image src={image} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <Image
          src={userIconUrl}
          alt=""
          width={16}
          height={16}
          className={iconClassName}
        />
      )}
    </span>
  );
}
