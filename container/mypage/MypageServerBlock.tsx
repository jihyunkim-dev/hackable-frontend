import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import MultiLine from "@/components/ui/MultiLine";
import { mypageContent } from "@/configs/contents/mypage";
import {
  ActivitySection,
  MypageAuthGate,
  MypageView,
  ProfileSection,
  WithdrawButton,
} from "./MypageClientBlock";

// 로그인 사용자 데이터는 브라우저에서 TanStack Query로 받는다. (MypageClientContainer)
export default function MypageServerBlock() {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <div className="mx-auto w-full max-w-[960px] lg:py-6">
        <MypageAuthGate>
          <ProfileSection />
          <MypageView
            activity={<ActivitySection />}
            settings={<WithdrawSection />}
          />
        </MypageAuthGate>
      </div>
    </DefaultLayout>
  );
}

/* ===== 계정 설정 (탈퇴) ===== */

function WithdrawSection() {
  const { withdraw } = mypageContent;

  return (
    <section className="flex flex-col gap-2.5 px-4 py-3 lg:px-0">
      <h3 className="px-3 py-3 text-heading-xs text-gray-800">
        {withdraw.title}
      </h3>
      <div className="flex flex-col gap-2.5 p-2.5 text-gray-700">
        <p className="text-heading-xs ">
          <MultiLine lines={withdraw.description} />
        </p>
        <ul className="text-body-m pt-8">
          {withdraw.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="p-2 sm:max-w-[991px] pt-8">
        <WithdrawButton />
      </div>
    </section>
  );
}
