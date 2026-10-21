import SearchBar from "@/components/ui/SearchBar";

interface SearchSectionProps {
  action: string;
  placeholder: string;
}

export default function SearchSection({ action, placeholder }: SearchSectionProps) {
  return (
    <section className="flex justify-center px-4 py-5 lg:py-7">
      <SearchBar action={action} placeholder={placeholder} />
    </section>
  );
}
