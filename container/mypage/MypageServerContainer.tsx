import MypageClientContainer from "./MypageClientContainer";
import MypageServerBlock from "./MypageServerBlock";

export default function MypageServerContainer() {
  return (
    <MypageClientContainer>
      <MypageServerBlock />
    </MypageClientContainer>
  );
}
