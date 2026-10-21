import { Fragment } from "react";

// 문자열 배열을 <br />로 이어 여러 줄로 렌더링한다.
export default function MultiLine({ lines }: { lines: string[] }) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}
