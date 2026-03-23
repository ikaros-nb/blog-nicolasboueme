import type { CollectionEntry } from "astro:content";
import { type Locale, defaultLocale } from "./translations";

/**
 * Extract locale from a URL pathname.
 * /fr/posts/... -> "fr"
 * /posts/... -> "en"
 */
export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (lang === "fr") return "fr";
  return defaultLocale;
}

/**
 * Get a localized path for a given route.
 * For the default locale (en), no prefix is added.
 * For fr, /fr is prepended.
 */
export function getLocalizedPath(path: string, lang: Locale): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLocale) return cleanPath;
  return `/${lang}${cleanPath}`;
}

/**
 * Filter posts by language.
 */
export function filterPostsByLang(
  posts: CollectionEntry<"blog">[],
  lang: Locale
): CollectionEntry<"blog">[] {
  return posts.filter(post => post.data.lang === lang);
}
