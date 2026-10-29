import { notFound } from "next/navigation";
// import { createDummyTeamBuildingDetail } from "@/configs/contents/dummyData";
import { parseSlugId } from "@/utils/project";
import { RequestTeambuildingDetail } from "@/utils/requestToSrv";
import { TEAMBUILDING_STATUS } from "@/utils/teamBuilding";
import {
  isTeamBuildingCategory,
  pickOptions,
  TEAMBUILDING_MODES,
  TEAMBUILDING_POSITIONS,
} from "@/utils/teamBuildingForm";
import TeamBuildingEditClientContainer from "./TeamBuildingEditClientContainer";
import TeamBuildingEditServerBlock from "./TeamBuildingEditServerBlock";

// 수정 화면은 방금 저장한 내용이 보여야 하므로 캐시 없이 받는다.
export default async function TeamBuildingEditServerContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // [실제 데이터]
  const postId = parseSlugId(id);
  const post = postId ? await RequestTeambuildingDetail(postId) : null;
  if (!post) notFound();
  const defaultValues = {
    // 카테고리 없이 쓴 예전 글은 프로젝트로 보여 준다. (저장하면 프로젝트로 들어간다)
    category: isTeamBuildingCategory(post.category) ? post.category : "project",
    title: post.title,
    body: post.description ?? "",
    isOpen: post.status !== TEAMBUILDING_STATUS.closed,
    // 예전 글의 자유 입력 포지션은 고를 수 있는 항목만 남긴다.
    position: pickOptions(post.position, TEAMBUILDING_POSITIONS),
    // TODO: 진행 방식은 백엔드 필드가 생기기 전까지 tags에 들어 있다.
    modes: pickOptions(post.tags, TEAMBUILDING_MODES),
    deadline: post.end_date?.slice(0, 10) ?? "",
    imageUrl: post.thumbnail_img ?? undefined,
  };

  // [더미 데이터] 위 [실제 데이터] 블록을 주석 처리하고 아래 주석을 풀면 더미 데이터로 보인다.
  // const detail = createDummyTeamBuildingDetail(id);
  // const defaultValues = {
  //   category: "project",
  //   title: detail.title,
  //   body: detail.body,
  //   isOpen: detail.isOpen,
  //   position: [],
  //   modes: [],
  //   deadline: "",
  // };

  // [실제 데이터] 작성자만 수정할 수 있다. (더미 데이터일 때는 undefined로 확인을 건너뛴다)
  const authorId: number | undefined = post.author_id;

  return (
    <TeamBuildingEditClientContainer id={id}>
      <TeamBuildingEditServerBlock
        id={id}
        authorId={authorId}
        defaultValues={defaultValues}
      />
    </TeamBuildingEditClientContainer>
  );
}
