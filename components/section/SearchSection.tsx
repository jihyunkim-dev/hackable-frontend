import SearchBar from "@/components/ui/SearchBar";

interface SearchSectionProps {
  action: string;
  placeholder: string;
  // 지금 검색 중인 검색어 (검색창에 남겨둔다)
  query?: string;
}

export default function SearchSection({
  action,
  placeholder,
  query,
}: SearchSectionProps) {
  return (
    <section className="flex justify-center px-4 py-5 lg:py-7">
      <SearchBar
        // 검색어가 바뀌면 입력창도 새 값으로 다시 그린다.
        key={query}
        action={action}
        placeholder={placeholder}
        defaultValue={query}
      />
    </section>
  );
}
