import { getCollectionDocuments, getSingleDocument } from "./strapi-client";
import { getImageFormat, getStrapiMediaUrl } from "./utility-function";

const DEFAULT_LANG = "it";

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

function mapPortfolioProject(project, fallbackProject = {}) {
  const categories = asArray(project?.categorie_progetto).map((item) => item?.titolo).filter(Boolean);
  const types = asArray(project?.tipologie_progetto).map((item) => item?.titolo).filter(Boolean);

  return {
    title: pickFirst(project?.titolo, fallbackProject.title),
    slug: pickFirst(project?.slug, fallbackProject.slug),
    image: resolveMediaUrl(project?.cover, "large", fallbackProject.image),
    serviceCategory: pickFirst(categories[0], fallbackProject.serviceCategory),
    videoType: pickFirst(types[0], fallbackProject.videoType),
    summary: pickFirst(project?.intro, fallbackProject.summary),
    tags: categories.length || types.length
      ? [...categories, ...types].slice(0, 2)
      : fallbackProject.tags || [],
  };
}

function mapOriginalSlide(item, fallbackItem = {}) {
  const types = asArray(item?.tipologie_progetto).map((entry) => entry?.titolo).filter(Boolean);

  return {
    title: pickFirst(item?.titolo, fallbackItem.title),
    subtitle: pickFirst(types[0], fallbackItem.subtitle),
    image: resolveMediaUrl(item?.cover, "large", fallbackItem.image),
    slug: pickFirst(item?.slug, fallbackItem.slug),
  };
}

function mapCardItems(items = [], fallbackItems = []) {
  return fallbackItems.map((fallbackItem, index) => {
    const item = items[index] || {};

    return {
      title: pickFirst(item?.titolo, fallbackItem.title),
      summary: pickFirst(item?.contenuto, fallbackItem.summary),
      image: resolveMediaUrl(item?.cover, "large", fallbackItem.image),
      imageAlt: pickFirst(item?.cover?.alternativeText, fallbackItem.imageAlt, fallbackItem.title),
      theme: fallbackItem.theme,
    };
  });
}

function mapContactCards(items = [], fallbackItems = [], contactDetails) {
  const detailMap = [
    {
      href: `mailto:${contactDetails.email}`,
      linkLabel: contactDetails.email,
      secondaryLink: null,
    },
    {
      href: `tel:${contactDetails.phones[0].replace(/\s+/g, "")}`,
      linkLabel: contactDetails.phones[0],
      secondaryLink: {
        href: `tel:${contactDetails.phones[1].replace(/\s+/g, "")}`,
        label: contactDetails.phones[1],
      },
    },
    {
      href: "https://maps.google.com/?q=Via+Molino+9,+48121+Ravenna,+Italia",
      linkLabel: `${contactDetails.address[0]}, ${contactDetails.address[1]}`,
      secondaryLink: null,
    },
  ];

  return fallbackItems.map((fallbackItem, index) => {
    const item = items[index] || {};
    const detail = detailMap[index];

    return {
      icon: fallbackItem.icon,
      title: pickFirst(item?.titolo, fallbackItem.title),
      text: pickFirst(item?.contenuto, fallbackItem.text),
      href: detail.href,
      linkLabel: detail.linkLabel,
      secondaryLink: detail.secondaryLink,
    };
  });
}

export async function getPortfolioPageContent({ lang = DEFAULT_LANG, fallback }) {
  const [pageResponse, originalsResponse] = await Promise.all([
    getSingleDocument("pagina-portfolio", {
      locale: lang,
      status: "published",
      populate: {
        header: {
          populate: {
            videoBackground: true,
            imgTeam: true,
          },
        },
        intro: {
          populate: {
            media: true,
          },
        },
        progettiEvidenza: {
          populate: {
            cover: true,
            categorie_progetto: true,
            tipologie_progetto: true,
          },
        },
        cta: {
          populate: {
            cover: true,
            pulsante: true,
          },
        },
      },
    }),
    getCollectionDocuments("originals", {
      locale: lang,
      status: "published",
      sort: ["updatedAt:desc"],
      pagination: { page: 1, pageSize: 3 },
      fields: ["titolo", "slug"],
      populate: {
        cover: true,
        tipologie_progetto: true,
      },
    }),
  ]);

  const page = pageResponse?.data || {};
  const introParagraphs = splitRichTextParagraphs(page?.intro?.contenuto);
  const highlightProjects = asArray(page?.progettiEvidenza).length
    ? asArray(page?.progettiEvidenza).map((project, index) => mapPortfolioProject(project, fallback.highlightProjects[index]))
    : fallback.highlightProjects;

  return {
    header: mapHeader(page?.header, fallback.header),
    intro: {
      title: pickFirst(page?.intro?.titolo, fallback.intro.title),
      paragraphs: introParagraphs.length ? introParagraphs : fallback.intro.paragraphs,
    },
    highlightProjects,
    originalsSlides: asArray(originalsResponse?.data).length
      ? asArray(originalsResponse?.data).map((item, index) => mapOriginalSlide(item, fallback.originalsSlides[index]))
      : fallback.originalsSlides,
    cta: {
      kicker: pickFirst(page?.cta?.sottotitolo, fallback.cta.kicker),
      title: pickFirst(page?.cta?.titolo, fallback.cta.title),
      figureSrc: resolveMediaUrl(page?.cta?.cover, "large", fallback.cta.figureSrc),
      figureAlt: pickFirst(page?.cta?.cover?.alternativeText, fallback.cta.figureAlt),
      background: pickFirst(page?.cta?.bgColor, fallback.cta.background),
      button: mapButton(page?.cta?.pulsante, fallback.cta.button.label, fallback.cta.button.href),
    },
  };
}

export async function getOriginalsPageContent({ lang = DEFAULT_LANG, fallback }) {
  const pageResponse = await getSingleDocument("pagina-originals", {
    locale: lang,
    status: "published",
    populate: {
      header: {
        populate: {
          videoBackground: true,
          imgTeam: true,
        },
      },
      esploraProgetti: {
        populate: {
          item: {
            populate: {
              cover: true,
            },
          },
          pulsante: true,
        },
      },
      originalsEvidenza: {
        populate: {
          cover: true,
          tipologie_progetto: true,
        },
      },
      ctaOscar: {
        populate: {
          cover: true,
          pulsante: true,
        },
      },
      ctaContattaci: {
        populate: {
          cover: true,
          pulsante: true,
        },
      },
    },
  });

  const page = pageResponse?.data || {};
  const explore = page?.esploraProgetti || {};

  return {
    header: mapHeader(page?.header, fallback.header),
    explore: {
      title: pickFirst(explore?.titolo, fallback.explore.title),
      summary: pickFirst(explore?.contenuto, fallback.explore.summary),
      items: asArray(explore?.item).length
        ? mapCardItems(asArray(explore?.item), fallback.explore.items)
        : fallback.explore.items,
    },
    highlightedOriginals: asArray(page?.originalsEvidenza).length
      ? asArray(page?.originalsEvidenza).map((item, index) => mapOriginalSlide(item, fallback.highlightedOriginals[index]))
      : fallback.highlightedOriginals,
    ctaOscar: {
      theme: fallback.ctaOscar.theme,
      titleClass: fallback.ctaOscar.titleClass,
      title: pickFirst(page?.ctaOscar?.titolo, fallback.ctaOscar.title),
      body: pickFirst(page?.ctaOscar?.contenuto, fallback.ctaOscar.body),
      button: mapButton(page?.ctaOscar?.pulsante, fallback.ctaOscar.button.label, fallback.ctaOscar.button.href),
    },
    ctaContact: {
      theme: fallback.ctaContact.theme,
      titleClass: fallback.ctaContact.titleClass,
      title: pickFirst(page?.ctaContattaci?.titolo, fallback.ctaContact.title),
      body: pickFirst(page?.ctaContattaci?.sottotitolo, fallback.ctaContact.body),
      button: mapButton(page?.ctaContattaci?.pulsante, fallback.ctaContact.button.label, fallback.ctaContact.button.href),
    },
  };
}

export async function getContactsPageContent({ lang = DEFAULT_LANG, fallback }) {
  const pageResponse = await getSingleDocument("pagina-contatti", {
    locale: lang,
    status: "published",
    populate: {
      header: {
        populate: {
          videoBackground: true,
          imgTeam: true,
        },
      },
      contatti: {
        populate: {
          item: {
            populate: {
              cover: true,
            },
          },
          pulsante: true,
        },
      },
    },
  });

  const page = pageResponse?.data || {};
  const contacts = page?.contatti || {};
  const formParagraphs = splitRichTextParagraphs(page?.contattaci);

  return {
    header: mapHeader(page?.header, fallback.header),
    contactSection: {
      title: pickFirst(contacts?.titolo, fallback.contactSection.title),
      lead: pickFirst(contacts?.sottotitolo, fallback.contactSection.lead),
      cards: asArray(contacts?.item).length
        ? mapContactCards(asArray(contacts?.item), fallback.contactSection.cards, fallback.contactDetails)
        : fallback.contactSection.cards,
    },
    formSection: {
      title: formParagraphs[0] || fallback.formSection.title,
      lead: formParagraphs[1] || fallback.formSection.lead,
    },
  };
}
