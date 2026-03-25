import { buildPath, joinLocalizedPath } from "../i18n/routing";
import { getCollectionDocuments, getSingleDocument } from "./strapi-client";
import { formatDate, getImageFormat, getStrapiMediaUrl } from "./utility-function";

const DEFAULT_LANG = "it";
const HERO_VIDEO_FALLBACK = "/images/1021768637.mp4";
const CTA_FIGURE_FALLBACK = "/images/lo-animiamo-noi.png";
const ARTICLE_HERO_FALLBACK = "/images/hero-dettaglio-fallback.jpg";

function asArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function pickFirst(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (Array.isArray(value) && value.length) {
      return value;
    }

    if (value && typeof value === "object") {
      return value;
    }
  }

  return "";
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_>`~-]/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitRichTextParagraphs(value) {
  const clean = String(value || "");
  const fromParagraphs = Array.from(clean.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi), (match) => stripHtml(match[1])).filter(Boolean);

  if (fromParagraphs.length) {
    return fromParagraphs;
  }

  return stripHtml(clean)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveMediaUrl(media, preferredFormat = "large", fallback = "") {
  if (!media) return fallback;

  return getImageFormat(media, preferredFormat) || getStrapiMediaUrl(media.url) || fallback;
}

function truncateText(value, maxLength = 150) {
  const normalized = stripHtml(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function mapButton(button, fallbackLabel, fallbackUrl) {
  return {
    label: pickFirst(button?.etichetta, fallbackLabel),
    href: pickFirst(button?.url, fallbackUrl),
    title: pickFirst(button?.title, button?.etichetta, fallbackLabel),
    targetBlank: Boolean(button?.targetBlank),
  };
}

function mapHeader(header, fallback = {}) {
  return {
    bgWord: pickFirst(header?.titoloTana, fallback.bgWord),
    title: pickFirst(header?.titolo, fallback.title),
    subtitle: pickFirst(header?.sottotitolo, fallback.subtitle),
    backgroundVideoSrc: resolveMediaUrl(header?.videoBackground, "large", fallback.backgroundVideoSrc),
    sideImageSrc: resolveMediaUrl(header?.imgTeam, "large", fallback.sideImageSrc),
    sideImageAlt: pickFirst(header?.imgTeam?.alternativeText, fallback.sideImageAlt),
    showSideImage: Boolean(header?.imgTeamBool && resolveMediaUrl(header?.imgTeam)),
  };
}

function mapArticle(article, lang) {
  const categories = asArray(article?.categorie_articolo).map((item) => pickFirst(item?.titolo)).filter(Boolean);
  const slug = pickFirst(article?.slug);

  return {
    category: pickFirst(categories[0], "Paneblog"),
    date: formatDate(pickFirst(article?.publishedAt, article?.updatedAt)),
    href: slug ? joinLocalizedPath(buildPath("paneblog", lang), slug) : buildPath("paneblog", lang),
    image: resolveMediaUrl(article?.cover, "large", "/images/paneblog-cover-01-356x217.png"),
    imageAlt: pickFirst(article?.cover?.alternativeText, article?.titolo, "Articolo Paneblog"),
    summary: truncateText(article?.contenuto, 160),
    title: pickFirst(article?.titolo, "Articolo Paneblog"),
  };
}

function mapArticleDetail(article, lang) {
  const mappedCard = mapArticle(article, lang);

  return {
    ...mappedCard,
    content: pickFirst(article?.contenuto),
    description: pickFirst(article?.seo?.metaDescription, truncateText(article?.contenuto, 180), mappedCard.summary),
    heroAlt: pickFirst(article?.cover?.alternativeText, article?.titolo, "Copertina articolo Paneblog"),
    heroImage: resolveMediaUrl(article?.cover, "large", ARTICLE_HERO_FALLBACK),
    publishedAt: pickFirst(article?.publishedAt, article?.updatedAt),
    seo: {
      description: pickFirst(article?.seo?.metaDescription, truncateText(article?.contenuto, 180), mappedCard.summary),
      title: pickFirst(article?.seo?.metaTitle, article?.titolo, "Paneblog - Panebarco"),
    },
    slug: pickFirst(article?.slug),
  };
}

export async function getPaneblogPreviewArticles({ lang = DEFAULT_LANG, limit = 3, fallback = [] } = {}) {
  const response = await getCollectionDocuments("articoli", {
    locale: lang,
    status: "published",
    sort: ["publishedAt:desc", "updatedAt:desc"],
    pagination: {
      page: 1,
      pageSize: limit,
    },
    fields: ["documentId", "titolo", "slug", "contenuto", "publishedAt", "updatedAt"],
    populate: {
      cover: true,
      categorie_articolo: {
        fields: ["titolo", "slug"],
      },
    },
  });

  const articles = asArray(response?.data).map((article) => mapArticle(article, lang));

  return articles.length ? articles : fallback;
}

export async function getPaneblogPageContent({ lang = DEFAULT_LANG, fallback = {} } = {}) {
  const [pageResponse, articlesResponse] = await Promise.all([
    getSingleDocument("pagina-paneblog", {
      locale: lang,
      status: "published",
      populate: {
        header: {
          populate: {
            videoBackground: true,
            imgTeam: true,
          },
        },
        cta: {
          populate: {
            cover: true,
            pulsante: true,
          },
        },
        seo: {
          fields: ["metaTitle", "metaDescription"],
        },
      },
    }),
    getCollectionDocuments("articoli", {
      locale: lang,
      status: "published",
      sort: ["publishedAt:desc", "updatedAt:desc"],
      fields: ["documentId", "titolo", "slug", "contenuto", "publishedAt", "updatedAt"],
      populate: {
        cover: true,
        categorie_articolo: {
          fields: ["titolo", "slug"],
        },
      },
    }),
  ]);

  const page = pageResponse?.data || {};
  const introParagraphs = splitRichTextParagraphs(page?.intro?.contenuto);
  const mappedArticles = asArray(articlesResponse?.data).map((article) => mapArticle(article, lang));
  const articleFilters = ["Tutti", ...new Set(mappedArticles.map((article) => article.category).filter(Boolean))];
  const ctaButton = mapButton(page?.cta?.pulsante, fallback.cta?.buttonLabel || "Contattaci", fallback.cta?.href || buildPath("contacts", lang));

  return {
    articleFilters: articleFilters.length ? articleFilters : ["Tutti"],
    articles: mappedArticles,
    cta: {
      background: pickFirst(page?.cta?.bgColor, fallback.cta?.background, "#9f5ea3"),
      buttonLabel: ctaButton.label,
      figureAlt: pickFirst(page?.cta?.cover?.alternativeText, fallback.cta?.figureAlt, "Mascotte Panebarco"),
      figureSrc: resolveMediaUrl(page?.cta?.cover, "large", fallback.cta?.figureSrc || CTA_FIGURE_FALLBACK),
      href: ctaButton.href,
      kicker: pickFirst(page?.cta?.sottotitolo, fallback.cta?.kicker, "Vuoi ricevere gli aggiornamenti?"),
      title: pickFirst(page?.cta?.titolo, fallback.cta?.title, "ISCRIVITI ALLA NEWSLETTER."),
    },
    header: mapHeader(page?.header, {
      backgroundVideoSrc: HERO_VIDEO_FALLBACK,
      bgWord: pickFirst(fallback.header?.bgWord, "PRODUZIONI INDIPENDENTI"),
      sideImageAlt: pickFirst(fallback.header?.sideImageAlt, "Team Panebarco"),
      sideImageSrc: pickFirst(fallback.header?.sideImageSrc, "/images/lo-studio-panebarco-teams.png"),
      subtitle: pickFirst(fallback.header?.subtitle, "Format originali sviluppati dentro la nostra casa creativa"),
      title: pickFirst(fallback.header?.title, "PANEBLOG"),
    }),
    intro: {
      title: pickFirst(page?.intro?.titolo, fallback.intro?.title, "Diario di viaggio"),
      body: introParagraphs[0] || pickFirst(page?.intro?.contenuto, fallback.intro?.body, ""),
    },
    raw: page,
    seo: {
      description: pickFirst(page?.seo?.metaDescription),
      title: pickFirst(page?.seo?.metaTitle, page?.header?.titolo, page?.nomePagina, "Paneblog - Panebarco"),
    },
  };
}

export async function getPaneblogArticlePageContent({ lang = DEFAULT_LANG, slug }) {
  const [articleResponse, relatedArticlesResponse] = await Promise.all([
    getCollectionDocuments("articoli", {
      locale: lang,
      status: "published",
      filters: {
        slug: {
          $eq: slug,
        },
      },
      pagination: {
        page: 1,
        pageSize: 1,
      },
      fields: ["documentId", "titolo", "slug", "contenuto", "publishedAt", "updatedAt"],
      populate: {
        cover: true,
        categorie_articolo: {
          fields: ["titolo", "slug"],
        },
        seo: {
          fields: ["metaTitle", "metaDescription"],
        },
      },
    }),
    getCollectionDocuments("articoli", {
      locale: lang,
      status: "published",
      filters: {
        slug: {
          $ne: slug,
        },
      },
      sort: ["publishedAt:desc", "updatedAt:desc"],
      pagination: {
        page: 1,
        pageSize: 3,
      },
      fields: ["documentId", "titolo", "slug", "contenuto", "publishedAt", "updatedAt"],
      populate: {
        cover: true,
        categorie_articolo: {
          fields: ["titolo", "slug"],
        },
      },
    }),
  ]);

  const article = asArray(articleResponse?.data)[0] || null;

  if (!article) {
    return null;
  }

  return {
    article: mapArticleDetail(article, lang),
    relatedArticles: asArray(relatedArticlesResponse?.data).map((entry) => mapArticle(entry, lang)),
  };
}
