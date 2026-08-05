import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://nicolasboueme.com/",
    title: "Nicolas Bouème",
    description:
      "Blog of a French iOS developer in Japan. Swift, software craft, and life abroad.",
    author: "Nicolas Bouème",
    profile: "https://nicolasboueme.com/about",
    lang: "en",
    timezone: "Asia/Tokyo",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 10,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showTags: false,
    showArchives: false,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/ikaros-nb" },
    { name: "x", url: "https://x.com/ikaros_nb" },
    { name: "linkedin", url: "https://www.linkedin.com/in/nicolasboueme/" },
    { name: "mail", url: "mailto:nicolasboueme@live.fr" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
