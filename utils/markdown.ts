// 마크다운 본문(클립 description)을 화면용 HTML과 목차로 바꾼다. (서버에서 실행)
import GithubSlugger from "github-slugger";
import type { Element, Root as HastRoot } from "hast";
import type { Root as MdastRoot } from "mdast";
import { toString } from "mdast-util-to-string";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import sanitizeHtml from "sanitize-html";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { isAllowedImageUrl } from "@/configs/imageHosts";

export interface MarkdownHeading {
  id: string;
  text: string;
}

// 원고의 이미지는 상대 경로(images/파일명)로 온다. 파일은 R2의 clips/images/에 같은 이름으로 올린다.
const CLIP_IMAGE_BASE = "https://cdn.hackable.co.kr/clips/images/";
const RELATIVE_IMAGE_PATH = /^(?:\.\/)?images\/([^/?#]+)$/;

// 목차에 넣을 제목 단계 (## 만)
const TOC_DEPTH = 2;

// 모든 제목에 id를 붙이고(같은 제목은 -1, -2로 구분), ## 제목은 목차 목록에 모은다.
function remarkHeadingIds(headings: MarkdownHeading[]) {
  return () => (tree: MdastRoot) => {
    const slugger = new GithubSlugger();
    visit(tree, "heading", (node) => {
      const text = toString(node);
      const id = slugger.slug(text);
      node.data = { ...node.data, hProperties: { id } };
      if (node.depth === TOC_DEPTH) headings.push({ id, text });
    });
  };
}

// 이미지: 쓸 수 있는 주소(허용한 https 호스트)만 남기고 지연 로딩한다.
// 링크: 외부 주소는 새 탭으로 연다.
function rehypeMedia() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "img") {
        const relative =
          typeof node.properties.src === "string"
            ? RELATIVE_IMAGE_PATH.exec(node.properties.src)
            : null;
        if (relative) node.properties.src = CLIP_IMAGE_BASE + relative[1];
        const src = node.properties.src;
        if (typeof src !== "string" || !isAllowedImageUrl(src)) {
          if (parent && typeof index === "number") {
            parent.children.splice(index, 1);
            return index;
          }
          return;
        }
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
      }

      if (node.tagName === "a") {
        const href = node.properties.href;
        if (typeof href === "string" && /^https?:\/\//.test(href)) {
          node.properties.target = "_blank";
          node.properties.rel = ["noopener", "noreferrer"];
        }
      }
    });
  };
}

// 마크다운이 만드는 태그·속성만 허용한다. (제목 id, 표 정렬, 이미지 지연 로딩 포함)
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "del"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "loading", "decoding"],
    h1: ["id"],
    h2: ["id"],
    h3: ["id"],
    h4: ["id"],
    h5: ["id"],
    h6: ["id"],
    th: ["align"],
    td: ["align"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

// 마크다운 안의 HTML 태그는 렌더링하지 않고(remark-rehype 기본값), 결과도 한 번 더 sanitize한다.
export function renderMarkdown(markdown: string) {
  const headings: MarkdownHeading[] = [];
  const html = unified()
    .use(remarkParse)
    // 물결표 하나(~)는 "2천~5천"처럼 범위로 쓰므로 취소선으로 보지 않는다. 취소선은 ~~두 개~~만.
    .use(remarkGfm, { singleTilde: false })
    .use(remarkHeadingIds(headings))
    .use(remarkRehype)
    .use(rehypeMedia)
    .use(rehypeStringify)
    .processSync(markdown)
    .toString();

  return { html: sanitizeHtml(html, SANITIZE_OPTIONS), headings };
}
