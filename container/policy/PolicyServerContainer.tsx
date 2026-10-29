import { policyContent, type PolicyKind } from "@/configs/contents/policies";
import { renderMarkdown } from "@/utils/markdown";
import PolicyServerBlock from "./PolicyServerBlock";

// 이용약관·개인정보 처리방침 페이지. 원문 마크다운을 서버에서 HTML로 바꿔 넘긴다.
export default function PolicyServerContainer({ kind }: { kind: PolicyKind }) {
  const policy = policyContent[kind];
  const { html } = renderMarkdown(policy.markdown);

  return <PolicyServerBlock title={policy.title} html={html} />;
}
