import { Suspense } from "react";
import SearchBar, { SearchBarSkeleton } from "@/components/ui/SearchBar";

interface SearchSectionProps {
  action: string;
  placeholder: string;
  // 지금 검색 중인 검색어 (검색창에 남겨둔다). 요청 때 주소에서 정해진다.
  query: Promise<string>;
}

// 검색어는 요청 때 정해져, 미리 렌더링되는 화면에는 같은 크기의 빈 자리만 둔다.
export default function SearchSection({
  action,
  placeholder,
  query,
}: SearchSectionProps) {
  return (
    <section className="flex justify-center px-4 py-5 lg:py-7">
      <Suspense fallback={<SearchBarSkeleton />}>
        {query.then((q) => (
          <SearchBar
            // 검색어가 바뀌면 입력창도 새 값으로 다시 그린다.
            key={q}
            action={action}
            placeholder={placeholder}
            defaultValue={q}
          />
        ))}
      </Suspense>
    </section>
  );
}
