import { dummyMypage } from "@/configs/contents/dummyData";
import MypageClientContainer from "./MypageClientContainer";
import MypageServerBlock from "./MypageServerBlock";

export default function MypageServerContainer() {
  // TODO: 로그인 사용자 정보·북마크 API 연동
  return (
    <MypageClientContainer>
      <MypageServerBlock data={dummyMypage} />
    </MypageClientContainer>
  );
}
