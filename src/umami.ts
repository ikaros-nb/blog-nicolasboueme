// Umami, the blog's statistics. It runs at stats.nicolasboueme.com on Nicolas's server; worker/index.ts serves its
// tracker from the blog's own address, at /stats, so ad blockers leave it alone.

/** The nicolasboueme.com website in Umami. */
export const umamiWebsiteId = "c03b0c4f-bb83-4fdc-a0c5-7fba96825573";

/** The Umami server the Worker forwards to. */
export const umamiServer = "https://stats.nicolasboueme.com";
