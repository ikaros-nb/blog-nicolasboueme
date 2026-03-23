import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";
import { t } from "@/i18n/translations";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts, "fr");
  return rss({
    title: t("fr", "rss.title"),
    description: t("fr", "rss.desc"),
    site: SITE.website,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath, true, "fr"),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
