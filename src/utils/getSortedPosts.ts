import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/utils";
import { postFilter } from "./postFilter";

/**
 * Returns posts that are eligible to be shown to users, sorted by “last updated”
 * descending (uses `modDatetime` when present, otherwise `pubDatetime`).
 *
 * Note: filtering respects drafts and scheduled posts via `postFilter()`.
 * When `lang` is given, only posts of that language are returned.
 */
export function getSortedPosts(
  posts: CollectionEntry<"posts">[],
  lang?: Locale
) {
  return posts
    .filter(postFilter)
    .filter(post => !lang || post.data.lang === lang)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
}
