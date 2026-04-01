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
    backgroundVideoSrc: resolveMediaUrl(header?.mediaBackground, "large", fallback.backgroundVideoSrc),
    sideImageSrc: resolveMediaUrl(header?.imgTeam, "large", fallback.sideImageSrc),
    sideImageAlt: pickFirst(header?.imgTeam?.alternativeText, fallback.sideImageAlt),
    showSideImage: Boolean(header?.imgTeamBool && resolveMediaUrl(header?.imgTeam)),
  };
}

function mapArticle(article, lang) {
  const categories = asArray(article?.categorie_articolo).map((item) => pickFirst(item?.titolo)).filter(Boolean);
  const slug = pickFirst(article?.slug);

  return {
    category: pickFirst(categories[0]),
    date: formatDate(pickFirst(article?.dataPubblicazione, article?.dataPubblicazione)),
    href: slug ? joinLocalizedPath(buildPath("paneblog", lang), slug) : buildPath("paneblog", lang),
    image: resolveMediaUrl(article?.cover, "large", "/images/paneblog-cover-01-356x217.png"),
    imageAlt: pickFirst(article?.cover?.alternativeText, article?.titolo),
    summary: truncateText(article?.contenuto, 160),
    title: pickFirst(article?.titolo),
  };
}

function mapArticleDetail(article, lang) {
  const mappedCard = mapArticle(article, lang);

  return {
    ...mappedCard,
    documentId: pickFirst(article?.documentId),
    content: pickFirst(article?.contenuto),
    description: pickFirst(article?.seo?.metaDescription, truncateText(article?.contenuto, 180), mappedCard.summary),
    heroAlt: pickFirst(article?.cover?.alternativeText, article?.titolo),
    heroImage: resolveMediaUrl(article?.cover, "large", ARTICLE_HERO_FALLBACK),
    publishedAt: pickFirst(article?.publishedAt, article?.updatedAt),
    seo: {
      description: pickFirst(article?.seo?.metaDescription, truncateText(article?.contenuto, 180), mappedCard.summary),
      title: pickFirst(article?.seo?.metaTitle, article?.titolo),
    },
    slug: pickFirst(article?.slug),
  };
}

const FLASH_NEWS_CHARACTERS = [
  { character: "Maya", avatar: "/images/teams-avatar-che-fate-01.png" },
  { character: "Luca", avatar: "/images/teams-avatar-che-fate-02.png" },
  { character: "Nora", avatar: "/images/teams-avatar-che-fate-03.png" },
];

function formatDateDDMMYYYY(value) {
  if (!value) return "";

  try {
    const date = new Date(value);

    if (isNaN(date.getTime())) return "";

    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();

    return `${d}/${m}/${y}`;
  } catch (_error) {
    return "";
  }
}

export async function getFlashNewsContent({ lang = DEFAULT_LANG, limit = 3 } = {}) {
  const response = await getCollectionDocuments("flash-news", {
    locale: lang,
    status: "published",
    sort: ["data:desc", "publishedAt:desc"],
    pagination: { page: 1, pageSize: limit },
    fields: ["documentId", "titolo", "contenuto", "data", "publishedAt"],
  });

  const items = asArray(response?.data);

  if (!items.length) return [];

  return items.map((item, index) => {
    const char = FLASH_NEWS_CHARACTERS[index % FLASH_NEWS_CHARACTERS.length];
    const rawDate = item?.data || item?.publishedAt;

    return {
      date: formatDateDDMMYYYY(rawDate),
      character: char.character,
      avatar: char.avatar,
      title: pickFirst(item?.titolo),
      text: stripHtml(item?.contenuto),
    };
  });
}

export async function getPaneblogPreviewArticles({ lang = DEFAULT_LANG, limit = 3, fallback = [] } = {}) {
  const response = await getCollectionDocuments("articoli", {
    locale: lang,
    status: "published",
    sort: ["publishedAt:asc", "updatedAt:asc"],
    pagination: {
      page: 1,
      pageSize: limit,
    },
    fields: ["documentId", "dataPubblicazione", "titolo", "slug", "contenuto", "publishedAt", "updatedAt"],
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
            mediaBackground: true,
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
      sort: ["publishedAt:asc", "updatedAt:asc"],
      fields: ["documentId", "dataPubblicazione", "titolo", "slug", "contenuto", "publishedAt", "updatedAt"],
      populate: {
        cover: true,
        categorie_articolo: {
          fields: ["titolo", "slug"],
        },
      },
      pagination: {
        page: 1,
        /* ******** Modifica il valore di pageSize se vuoi aumentare gli articoli presi dalla fetch ******** */
        pageSize: 999,
      }
    }),
  ]);

  const page = pageResponse?.data || {};
  const introParagraphs = splitRichTextParagraphs(page?.intro?.contenuto);
  const mappedArticles = asArray(articlesResponse?.data).map((article) => mapArticle(article, lang));
  const articleFilters = ["Tutti", ...new Set(mappedArticles.map((article) => article.category).filter(Boolean))];
  const ctaButton = mapButton(page?.cta?.pulsante, fallback.cta?.buttonLabel, fallback.cta?.href || buildPath("contacts", lang));

  return {
    articleFilters: articleFilters.length ? articleFilters : ["Tutti"],
    articles: mappedArticles,
    cta: {
      background: pickFirst(page?.cta?.bgColor, fallback.cta?.background),
      buttonLabel: ctaButton.label,
      figureAlt: pickFirst(page?.cta?.cover?.alternativeText, fallback.cta?.figureAlt),
      figureSrc: resolveMediaUrl(page?.cta?.cover, "large", fallback.cta?.figureSrc || CTA_FIGURE_FALLBACK),
      href: ctaButton.href,
      kicker: pickFirst(page?.cta?.sottotitolo, fallback.cta?.kicker),
      title: pickFirst(page?.cta?.titolo, fallback.cta?.title),
    },
    header: mapHeader(page?.header, {
      backgroundVideoSrc: HERO_VIDEO_FALLBACK,
      bgWord: pickFirst(fallback.header?.bgWord),
      sideImageAlt: pickFirst(fallback.header?.sideImageAlt),
      sideImageSrc: pickFirst(fallback.header?.sideImageSrc),
      subtitle: pickFirst(fallback.header?.subtitle),
      title: pickFirst(fallback.header?.title),
    }),
    intro: {
      title: pickFirst(page?.intro?.titolo, fallback.intro?.title),
      body: introParagraphs[0] || pickFirst(page?.intro?.contenuto, fallback.intro?.body),
    },
    seo: {
      description: pickFirst(page?.seo?.metaDescription),
      title: pickFirst(page?.seo?.metaTitle, page?.header?.titolo, page?.nomePagina),
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
      fields: ["documentId","dataPubblicazione","titolo", "slug", "contenuto", "publishedAt", "updatedAt"],
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
