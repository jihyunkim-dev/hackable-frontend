import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/utils/sitemap";

// 검색엔진용 사이트맵 (/sitemap.xml). 항목과 lastmod 기준은 utils/sitemap 참고
export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
