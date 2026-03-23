import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/translations";
import getSortedPosts from "./getSortedPosts";
import { slugifyAll } from "./slugify";

const getPostsByTag = (
  posts: CollectionEntry<"blog">[],
  tag: string,
  lang?: Locale
) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag)),
    lang
  );

export default getPostsByTag;
