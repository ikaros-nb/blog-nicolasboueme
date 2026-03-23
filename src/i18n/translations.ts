export type Locale = "en" | "fr";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "fr"];

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Header
    "nav.posts": "Posts",
    "nav.tags": "Tags",
    "nav.about": "About",
    "nav.search": "Search",
    "nav.archives": "Archives",
    "nav.skipToContent": "Skip to content",
    "nav.openMenu": "Open Menu",
    "nav.closeMenu": "Close Menu",

    // Footer
    "footer.allRightsReserved": "All rights reserved.",

    // Breadcrumb
    "breadcrumb.home": "Home",
    "breadcrumb.posts": "Posts",
    "breadcrumb.tags": "Tags",
    "breadcrumb.about": "About",
    "breadcrumb.search": "Search",
    "breadcrumb.archives": "Archives",

    // 404
    "404.title": "Page Not Found",
    "404.goHome": "Go back home",

    // Search
    "search.title": "Search",
    "search.desc": "Search any article ...",

    // Archives
    "archives.title": "Archives",
    "archives.desc": "All the articles I've archived.",
    "month.1": "January",
    "month.2": "February",
    "month.3": "March",
    "month.4": "April",
    "month.5": "May",
    "month.6": "June",
    "month.7": "July",
    "month.8": "August",
    "month.9": "September",
    "month.10": "October",
    "month.11": "November",
    "month.12": "December",

    // PostDetails
    "post.previous": "Previous Post",
    "post.next": "Next Post",

    // BackButton
    "back.label": "Go back",

    // ShareLinks
    "share.label": "Share this post on:",

    // Homepage
    "home.greeting": "Mingalaba",
    "home.intro":
      "AstroPaper is a minimal, responsive, accessible and SEO-friendly Astro blog theme. This theme follows best practices and provides accessibility out of the box. Light and dark mode are supported by default. Moreover, additional color schemes can also be configured.",
    "home.introMore": "Read the blog posts or check",
    "home.introMoreSuffix": "for more info.",
    "home.featured": "Featured",
    "home.recentPosts": "Recent Posts",
    "home.allPosts": "All Posts",
    "home.socialLinks": "Social Links:",

    // Posts page
    "posts.title": "Posts",
    "posts.desc": "All the articles I've posted.",

    // Tags page
    "tags.title": "Tags",
    "tags.desc": "All the tags used in posts.",
    "tags.tagPrefix": "Tag:",
    "tags.tagDesc": 'All the articles with the tag "{tagName}".',

    // Pagination
    "pagination.prev": "Prev",
    "pagination.next": "Next",
    "pagination.gotoPrev": "Goto Previous Page",
    "pagination.gotoNext": "Goto Next Page",

    // Datetime
    "datetime.updated": "Updated:",

    // RSS
    "rss.title": "AstroPaper",
    "rss.desc": "A minimal, responsive and SEO-friendly Astro blog theme.",
  },
  fr: {
    // Header
    "nav.posts": "Articles",
    "nav.tags": "Tags",
    "nav.about": "\u00C0 propos",
    "nav.search": "Rechercher",
    "nav.archives": "Archives",
    "nav.skipToContent": "Aller au contenu",
    "nav.openMenu": "Ouvrir le menu",
    "nav.closeMenu": "Fermer le menu",

    // Footer
    "footer.allRightsReserved": "Tous droits r\u00E9serv\u00E9s.",

    // Breadcrumb
    "breadcrumb.home": "Accueil",
    "breadcrumb.posts": "Articles",
    "breadcrumb.tags": "Tags",
    "breadcrumb.about": "\u00C0 propos",
    "breadcrumb.search": "Rechercher",
    "breadcrumb.archives": "Archives",

    // 404
    "404.title": "Page introuvable",
    "404.goHome": "Revenir \u00E0 l'accueil",

    // Search
    "search.title": "Rechercher",
    "search.desc": "Rechercher un article ...",

    // Archives
    "archives.title": "Archives",
    "archives.desc": "Tous les articles que j'ai archiv\u00E9s.",
    "month.1": "Janvier",
    "month.2": "F\u00E9vrier",
    "month.3": "Mars",
    "month.4": "Avril",
    "month.5": "Mai",
    "month.6": "Juin",
    "month.7": "Juillet",
    "month.8": "Ao\u00FBt",
    "month.9": "Septembre",
    "month.10": "Octobre",
    "month.11": "Novembre",
    "month.12": "D\u00E9cembre",

    // PostDetails
    "post.previous": "Article pr\u00E9c\u00E9dent",
    "post.next": "Article suivant",

    // BackButton
    "back.label": "Retour",

    // ShareLinks
    "share.label": "Partager cet article sur :",

    // Homepage
    "home.greeting": "Mingalaba",
    "home.intro":
      "AstroPaper est un th\u00E8me de blog Astro minimal, responsive, accessible et optimis\u00E9 pour le SEO. Ce th\u00E8me suit les meilleures pratiques et fournit l'accessibilit\u00E9 d\u00E8s la sortie de la bo\u00EEte. Les modes clair et sombre sont pris en charge par d\u00E9faut. De plus, des sch\u00E9mas de couleurs suppl\u00E9mentaires peuvent \u00E9galement \u00EAtre configur\u00E9s.",
    "home.introMore": "Lisez les articles de blog ou consultez",
    "home.introMoreSuffix": "pour plus d'informations.",
    "home.featured": "En vedette",
    "home.recentPosts": "Articles r\u00E9cents",
    "home.allPosts": "Tous les articles",
    "home.socialLinks": "R\u00E9seaux sociaux :",

    // Posts page
    "posts.title": "Articles",
    "posts.desc": "Tous les articles que j'ai publi\u00E9s.",

    // Tags page
    "tags.title": "Tags",
    "tags.desc": "Tous les tags utilis\u00E9s dans les articles.",
    "tags.tagPrefix": "Tag :",
    "tags.tagDesc": 'Tous les articles avec le tag \u00AB {tagName} \u00BB.',

    // Pagination
    "pagination.prev": "Pr\u00E9c.",
    "pagination.next": "Suiv.",
    "pagination.gotoPrev": "Aller \u00E0 la page pr\u00E9c\u00E9dente",
    "pagination.gotoNext": "Aller \u00E0 la page suivante",

    // Datetime
    "datetime.updated": "Mis \u00E0 jour :",

    // RSS
    "rss.title": "AstroPaper",
    "rss.desc":
      "Un th\u00E8me de blog Astro minimal, responsive et optimis\u00E9 pour le SEO.",
  },
};

export function t(lang: Locale, key: string): string {
  return translations[lang][key] ?? translations[defaultLocale][key] ?? key;
}

export default translations;
