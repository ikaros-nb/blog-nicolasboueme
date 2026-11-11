// The blog's events in Umami, beyond the page views the tracker records by itself.
// - outbound: a click on a link that leaves the blog (GitHub, X, LinkedIn, an app's page…), with its address.
// - share: a click on a share button, with the network (data-umami-event on ShareLinks.astro, handled by the tracker).
// - read-end: the reader reached the end of a post.
// - search: what was searched for (search.astro calls trackSearch).
// A bundled script runs once, so the listeners survive the ClientRouter's page swaps.

type Umami = {
  track(event: string, data?: Record<string, string | number>): void;
};

declare global {
  interface Window {
    umami?: Umami;
  }
}

function track(event: string, data?: Record<string, string | number>) {
  window.umami?.track(event, data);
}

document.addEventListener("click", event => {
  const link = (event.target as Element | null)?.closest?.("a[href]");
  // Links that name their own event, like the share buttons, are counted by the tracker.
  if (
    !(link instanceof HTMLAnchorElement) ||
    link.hasAttribute("data-umami-event")
  )
    return;

  if (link.protocol === "mailto:") {
    track("outbound", { url: "mailto" });
    return;
  }
  if (!link.protocol.startsWith("http") || link.host === location.host) return;
  track("outbound", {
    url: `${link.hostname}${link.pathname}`.replace(/\/$/, ""),
  });
});

/** Watches a mark at the end of the post, once per page. */
function watchReadEnd() {
  const article = document.getElementById("article");
  if (!article) return;

  const mark = document.createElement("div");
  mark.setAttribute("aria-hidden", "true");
  article.append(mark);

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    track("read-end", { lang: document.documentElement.lang });
  });
  observer.observe(mark);
  document.addEventListener("astro:before-swap", () => observer.disconnect(), {
    once: true,
  });
}

document.addEventListener("astro:page-load", watchReadEnd);

let searchTimer: ReturnType<typeof setTimeout> | undefined;

/** Counts a search once the reader has stopped typing for 1.5 s, so "sw", "swi"… don't count. */
export function trackSearch(term: string) {
  clearTimeout(searchTimer);
  const query = term.trim().toLowerCase().slice(0, 100);
  if (query.length < 2) return;
  searchTimer = setTimeout(() => track("search", { query }), 1500);
}
