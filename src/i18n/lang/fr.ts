import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Accueil",
    posts: "Articles",
    tags: "Tags",
    about: "À propos",
    archives: "Archives",
    search: "Rechercher",
  },
  post: {
    publishedAt: "Publié le",
    updatedAt: "Mis à jour",
    sharePostIntro: "Partager cet article sur :",
    sharePostOn: "Partager cet article sur {{platform}}",
    sharePostViaEmail: "Partager cet article par e-mail",
    tagLabel: "Tags",
    backToTop: "Retour en haut",
    goBack: "Retour",
    editPage: "Modifier la page",
    previousPost: "Article précédent",
    nextPost: "Article suivant",
  },
  pagination: {
    prev: "Préc.",
    next: "Suiv.",
    page: "Page",
  },
  home: {
    greeting: "Nicolas",
    intro: "Développeur iOS basé au Japon depuis août 2023.",
    socialLinks: "Réseaux sociaux :",
    featured: "En vedette",
    recentPosts: "Articles récents",
    allPosts: "Tous les articles",
  },
  rss: {
    title: "Nicolas Bouème",
    desc: "Le blog d'un développeur iOS français au Japon.",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "Tous droits réservés.",
  },
  pages: {
    tagTitle: "Tag : {{tag}}",
    tagDesc: "Tous les articles avec le tag « {{tag}} ».",

    tagsTitle: "Tags",
    tagsDesc: "Tous les tags utilisés dans les articles.",

    postsTitle: "Articles",
    postsDesc: "Tous les articles que j'ai publiés.",

    archivesTitle: "Archives",
    archivesDesc: "Tous les articles que j'ai archivés.",

    searchTitle: "Rechercher",
    searchDesc: "Rechercher un article ...",
  },
  a11y: {
    skipToContent: "Aller au contenu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    toggleTheme: "Changer de thème",
    searchPlaceholder: "Rechercher des articles...",
    noResults: "Aucun résultat trouvé",
    goToPreviousPage: "Aller à la page précédente",
    goToNextPage: "Aller à la page suivante",
  },
  notFound: {
    title: "404 Introuvable",
    message: "Page introuvable",
    goHome: "Revenir à l'accueil",
  },
} satisfies UIStrings;
