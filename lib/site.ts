// Single source of truth for the site's public origin.
//
// This drives metadataBase, the canonical URL, Open Graph tags, robots.txt and
// sitemap.xml. It previously fell back to a Railway URL that stopped resolving
// after the move to Vercel, and borrowed BETTER_AUTH_URL — an auth setting that
// has no reason to track the public origin — as its source.
//
// Set NEXT_PUBLIC_SITE_URL to override when a custom domain is attached.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://living-grimoire.vercel.app";
