import { getSingleDocument } from "./strapi-client";

const DEFAULT_LANG = "it";

const legalPages = {
  privacyPolicy: {
    defaultTitle: "Informativa Privacy Policy",
    resource: "pagina-privacy-policy",
  },
  privacyPolicyNewsletter: {
    defaultTitle: "Informativa Privacy Policy Newsletter",
    resource: "pagina-privacy-policy-newsletter",
  },
  privacyPolicyPsl: {
    defaultTitle: "Informativa Privacy Policy Social Library",
    resource: "pagina-privacy-policy-psl",
  },
  cookiePolicy: {
    defaultTitle: "Informativa Cookies Privacy",
    resource: "pagina-cookie-policy",
  },
};

function pickFirst(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function extractPrimaryHeading(value) {
  const normalized = String(value || "").replace(/\r\n/g, "\n").trim();
  const titleMatch = normalized.match(/^\s*#\s+(.+?)\s*$/m);

  if (!titleMatch) {
    return {
      body: normalized,
      title: "",
    };
  }

  return {
    body: normalized.replace(titleMatch[0], "").trim(),
    title: titleMatch[1]?.trim() || "",
  };
}

function formatUpdatedLabel(value, lang) {
  if (!value) return "";

  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export async function getLegalPageContent({ pageKey, lang = DEFAULT_LANG }) {
  const config = legalPages[pageKey];

  if (!config) {
    throw new Error(`Unknown legal page key "${pageKey}"`);
  }

  const response = await getSingleDocument(config.resource, {
    locale: lang,
    status: "published",
    fields: ["documentId", "locale", "updatedAt", "contenuto", "nomePagina"],
    populate: {
      seo: {
        fields: ["metaTitle", "metaDescription"],
      },
      localizations: {
        fields: ["documentId", "locale"],
      },
    },
  });

  const page = response?.data || {};
  const rawContent = pickFirst(page?.contenuto);
  const parsedContent = extractPrimaryHeading(rawContent);

  return {
    body: parsedContent.body,
    documentId: page?.documentId || null,
    hasContent: Boolean(rawContent),
    heading: parsedContent.title,
    locale: pickFirst(page?.locale, lang) || lang,
    localizations: Array.isArray(page?.localizations) ? page.localizations : [],
    rawContent,
    seo: {
      description: pickFirst(page?.seo?.metaDescription),
      title: pickFirst(page?.seo?.metaTitle, parsedContent.title, page?.nomePagina, config.defaultTitle),
    },
    updatedAt: page?.updatedAt || null,
    updatedLabel: formatUpdatedLabel(page?.updatedAt, lang),
  };
}
