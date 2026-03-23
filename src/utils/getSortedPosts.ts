import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/translations";
import postFilter from "./postFilter";

const getSortedPosts = (
  posts: CollectionEntry<"blog">[],
  lang?: Locale
) => {
  return posts
    .filter(postFilter)
    .filter(post => (lang ? post.data.lang === lang : true))
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedPosts;
