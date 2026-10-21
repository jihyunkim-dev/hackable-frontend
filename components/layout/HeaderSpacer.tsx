// DefaultLayout은 헤더 뒤로 콘텐츠를 끌어올리므로,
// 상단을 헤더에 가리면 안 되는 페이지는 첫 요소 위에 헤더 높이만큼 여백을 둔다.
export default function HeaderSpacer() {
  return (
    <div
      aria-hidden
      className="h-(--header-height-mobile) md:h-(--header-height-desktop)"
    />
  );
}
