import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/utils";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Tag = {
  tag: string;
  tagName: string;
};

/**
 * Builds a de-duplicated, sorted tag list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `tag` is the slug used in URLs; `tagName` is the original label for display
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 * - When `lang` is given, only tags from posts of that language are returned
 */
export function getUniqueTags(
  posts: CollectionEntry<"posts">[],
  lang?: Locale
) {
  const tags: Tag[] = posts
    .filter(postFilter)
    .filter(post => !lang || post.data.lang === lang)
    .flatMap(post => post.data.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex(tag => tag.tag === value.tag) === index
    )
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
  return tags;
}
