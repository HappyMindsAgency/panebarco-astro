export const prerender = false;

import type { APIRoute } from "astro";
import { getSingleDocument, getCollectionDocuments } from "../lib/strapi-client";
import { buildPath, joinLocalizedPath } from "../i18n/routing";

export const GET: APIRoute = async () => {
  const siteUrl = "https://www.panebarco.it";
  const now = new Date().toISOString();

  // Fetch single-type pages for lastmod
  const [
    homeIt,
    studioIt,
    storyIt,
    teamIt,
    visionIt,
    servicesIt,
    commercialsIt,
    postIt,
    serviceIt,
    altriIt,
    portfolioIt,
    originalsIt,
    paneblogIt,
    contattiIt,
    socialLibIt,
  ] = await Promise.all([
    getSingleDocument("pagina-home-page",              { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-studio",                 { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-storia-azienda-mutante", { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-panebarcos",             { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-vediamo-oscar",          { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-servizi",                { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-commercials",            { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-post-produzione",        { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-service",                { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-tanto-altro",            { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-portfolio",              { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-originals",              { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-paneblog",               { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-contatti",               { locale: "it", fields: ["updatedAt"] }),
    getSingleDocument("pagina-panebarco-social-library", { locale: "it", fields: ["updatedAt"] }),
  ]);

  // Fetch dynamic collections
  const [originals, progetti, articoli] = await Promise.all([
    getCollectionDocuments("originals", {
      locale: "it",
      status: "published",
      fields: ["slug", "updatedAt"],
      pagination: { pageSize: 1000 },
    }),
    getCollectionDocuments("progetti", {
      locale: "it",
      status: "published",
      fields: ["slug", "updatedAt"],
      pagination: { pageSize: 1000 },
    }),
    getCollectionDocuments("articoli", {
      locale: "it",
      status: "published",
      fields: ["slug", "updatedAt"],
      pagination: { pageSize: 1000 },
    }),
  ]);

  const u = (res: any) => res?.data?.updatedAt || now;

  const staticPages = [
    // Home (IT + EN)
    { url: `${siteUrl}/`,    updatedAt: u(homeIt) },
    { url: `${siteUrl}/en/`, updatedAt: u(homeIt) },

    // Studio
    { url: `${siteUrl}${buildPath("studio",      "it")}`, updatedAt: u(studioIt) },
    { url: `${siteUrl}${buildPath("studioStory", "it")}`, updatedAt: u(storyIt)  },
    { url: `${siteUrl}${buildPath("studioTeam",  "it")}`, updatedAt: u(teamIt)   },
    { url: `${siteUrl}${buildPath("studioOscars","it")}`, updatedAt: u(visionIt) },

    // Servizi
    { url: `${siteUrl}${buildPath("services",            "it")}`, updatedAt: u(servicesIt)    },
    { url: `${siteUrl}${buildPath("servicesCommercials", "it")}`, updatedAt: u(commercialsIt) },
    { url: `${siteUrl}${buildPath("servicesPost",        "it")}`, updatedAt: u(postIt)        },
    { url: `${siteUrl}${buildPath("servicesService",     "it")}`, updatedAt: u(serviceIt)     },
    { url: `${siteUrl}${buildPath("servicesMore",        "it")}`, updatedAt: u(altriIt)       },

    // Portfolio, Originals, Blog
    { url: `${siteUrl}${buildPath("portfolio", "it")}`, updatedAt: u(portfolioIt) },
    { url: `${siteUrl}${buildPath("originals", "it")}`, updatedAt: u(originalsIt) },
    { url: `${siteUrl}${buildPath("paneblog",  "it")}`, updatedAt: u(paneblogIt)  },

    // Contatti, Social Library
    { url: `${siteUrl}${buildPath("contacts",      "it")}`, updatedAt: u(contattiIt)  },
    { url: `${siteUrl}${buildPath("socialLibrary", "it")}`, updatedAt: u(socialLibIt) },

    // Pagine legali (nessun contenuto CMS)
    { url: `${siteUrl}${buildPath("privacyPolicy",         "it")}`, updatedAt: now },
    { url: `${siteUrl}${buildPath("privacyPolicyNewsletter","it")}`, updatedAt: now },
    { url: `${siteUrl}${buildPath("privacyPolicyPsl",      "it")}`, updatedAt: now },
    { url: `${siteUrl}${buildPath("cookiePolicy",          "it")}`, updatedAt: now },
    { url: `${siteUrl}${buildPath("trasparenza",           "it")}`, updatedAt: now },
  ];

  const dynamicPages = [
    ...(originals.data || []).map((item: any) => ({
      url: `${siteUrl}${joinLocalizedPath(buildPath("originals", "it"), item.slug)}`,
      updatedAt: item.updatedAt || now,
    })),
    ...(progetti.data || []).map((item: any) => ({
      url: `${siteUrl}${joinLocalizedPath(buildPath("portfolio", "it"), item.slug)}`,
      updatedAt: item.updatedAt || now,
    })),
    ...(articoli.data || []).map((item: any) => ({
      url: `${siteUrl}${joinLocalizedPath(buildPath("paneblog", "it"), item.slug)}`,
      updatedAt: item.updatedAt || now,
    })),
  ];

  const urls = [...staticPages, ...dynamicPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${new Date(page.updatedAt).toISOString().slice(0, 10)}</lastmod>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
