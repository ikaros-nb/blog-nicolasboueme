import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import type { Locale } from "@/i18n/translations";
import { defaultLocale } from "@/i18n/translations";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @param lang - locale for the post (adds /fr prefix for French)
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true,
  lang?: Locale
) {
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
    .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
    .filter(path => path !== "en" && path !== "fr") // exclude lang directories
    .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
    .map(segment => slugifyStr(segment)); // slugify each segment path

  const langPrefix = lang && lang !== defaultLocale ? `/${lang}` : "";
  const basePath = includeBase ? "/posts" : "";

  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

  // If not inside the sub-dir, simply return the file path
  if (!pathSegments || pathSegments.length < 1) {
    return [langPrefix + basePath, slug].join("/");
  }

  return [langPrefix + basePath, ...pathSegments, slug].join("/");
}
