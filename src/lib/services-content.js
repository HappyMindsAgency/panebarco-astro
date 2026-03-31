import customLabel from "./utility-customlabel";
import { getCollectionDocuments, getSingleDocument } from "./strapi-client";
import { getImageFormat, getStrapiMediaUrl } from "./utility-function";
import { buildPath, joinLocalizedPath } from "../i18n/routing";

const DEFAULT_LANG = "it";

const serviceRouteKeys = {
  commercials: "servicesCommercials",
  "post-produzione": "servicesPost",
  service: "servicesService",
  "e-tanto-altro": "servicesMore",
};

const servicePopulate = {
  header: {
    populate: {
      mediaBackground: true,
      imgTeam: true,
    },
  },
  intro: {
    populate: {
      media: true,
    },
  },
  servizi: {
    populate: {
      cover: true,
      pulsante: true,
    },
  },
  loghi: true,
  cta: {
    populate: {
      cover: true,
      pulsante: true,
    },
  },
  seo: {
    populate: {
      metaSocial: {
        populate: {
          image: true,
        },
      },
    },
  },
};

const baseServiceDetailPopulate = {
  header: {
    populate: {
      mediaBackground: true,
      imgTeam: true,
    },
  },
  intro: {
    populate: {
      media: true,
    },
  },
  composit: {
    populate: {
      progetti: {
        populate: {
          cover: true,
        },
      },
      pulsante: true,
    },
  },
  cta: {
    populate: {
      cover: true,
      pulsante: true,
    },
  },
  seo: {
    populate: {
      metaSocial: {
        populate: {
          image: true,
        },
      },
    },
  },
};

const serviceDetailPopulateByResource = {
  "pagina-commercials": baseServiceDetailPopulate,
  "pagina-post-produzione": baseServiceDetailPopulate,
  "pagina-service": baseServiceDetailPopulate,
  "pagina-tanto-altro": {
    ...baseServiceDetailPopulate,
    pensieri: {
      populate: {
        cover: true,
      },
    },
    ctaLibrary: {
      populate: {
        cover: true,
        pulsante: true,
      },
    },
  },
};

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
  return clean.split(/\n{2,}/).map((item) => stripHtml(item)).filter(Boolean);
}

function splitTags(value) {
  return String(value || "")
    .split(/[,;|]/)
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
    backgroundVideoSrc: resolveMediaUrl(header?.mediaBackground, "large", fallback.backgroundVideoSrc),
    sideImageSrc: resolveMediaUrl(header?.imgTeam, "large", fallback.sideImageSrc),
    sideImageAlt: pickFirst(header?.imgTeam?.alternativeText, fallback.sideImageAlt),
    showSideImage: Boolean(header?.imgTeamBool && resolveMediaUrl(header?.imgTeam)),
  };
}

function mapIntro(intro, fallback = {}) {
  const source = asArray(intro)[0] || intro || {};
  const paragraphs = splitRichTextParagraphs(source?.contenuto);

  return {
    title: pickFirst(source?.titolo, fallback.title),
    content: pickFirst(source?.contenuto, fallback.content),
    paragraphs: paragraphs.length ? paragraphs : asArray(fallback.paragraphs),
    mediaSrc: resolveMediaUrl(source?.media, "large", fallback.mediaSrc),
    mediaAlt: pickFirst(source?.media?.alternativeText, fallback.mediaAlt),
    hasMedia: Boolean(source?.mediaBool && resolveMediaUrl(source?.media)),
  };
}

function mapProjects(projects = [], lang, fallbackCategory) {
  const portfolioBase = buildPath("portfolio", lang || DEFAULT_LANG);
  return projects.slice(0, 4).map((project) => ({
    title: pickFirst(project?.titolo),
    summary: pickFirst(project?.intro),
    image: resolveMediaUrl(project?.cover, "large"),
    imageAlt: pickFirst(project?.cover?.alternativeText, project?.titolo),
    tags: [
      fallbackCategory,
      ...(project?.tipologie_progetto || []).map((item) => item?.titolo).filter(Boolean),
    ].filter(Boolean).slice(0, 2),
    href: project?.slug ? joinLocalizedPath(portfolioBase, project.slug) : undefined,
  }));
}

function mapCompositItems(container, fallbackModes = [], fallbackTag = "") {
  const compositItems = asArray(container?.composit);
  const itemsToMap = compositItems.length ? compositItems : fallbackModes;
  const bubbleByTitle = {
    "rendere visibile": "/images/commercials-balloon-rendere-visibile-panebarco.svg",
    integrare:
      "/images/post-produzione-balloon-integrare-3D-e-VFX integrati-con-riprese-live-action-panebarco.svg",
    trasformare:
      "/images/post-produzione-balloon-trasformare-compositing-effetti-visivi-e-particellari-panebarco.svg",
    rifinire:
      "/images/post-produzione-balloon-rifinire-color-grading-finishing-look-e-feel-panebarco.svg",
    potenziare:
      "/images/post-produzione-balloon-potenziare-interventi-invisibili-a-supporto-della-narrazione panebarco.svg",
    sviluppare:
      "/images/service-balloon-sviluppare-supporto-creativo-e-progettuale-panebarco.svg",
    produrre:
      "/images/service-balloon-produrre-animazione-2D-3D-e-contenuti-audiovisivi-panebarco.svg",
    coordinare:
      "/images/service-balloon-coordinare-gestione-del-lavoro-con-team-e partner panebarco.svg",
    gestire:
      "/images/service-balloon-gestire-produzione-esecutiva-in-emilia-romagna-panebarco.svg",
  };

  return itemsToMap.map((item, index) => {
    const itemTitle = pickFirst(item?.titolo);
    const fallbackMode =
      fallbackModes.find((mode) => pickFirst(mode?.title).toLowerCase() === itemTitle.toLowerCase()) ||
      fallbackModes[index] ||
      {};
    const resolvedTitle = pickFirst(item?.titolo, fallbackMode.title);
    const projects = mapProjects(
      asArray(item?.progetti),
      pickFirst(container?.locale, DEFAULT_LANG),
      fallbackTag || itemTitle || fallbackMode.title
    );
    const useSceneFallbacks = !compositItems.length;

    return {
      title: resolvedTitle,
      description: pickFirst(item?.contenuto, fallbackMode.description),
      scenes: Array.from(
        { length: projects.length > 0 ? projects.length : (useSceneFallbacks ? (fallbackMode.scenes?.length || 0) : 0) },
        (_, sceneIndex) => ({
          image: pickFirst(projects[sceneIndex]?.image, useSceneFallbacks ? fallbackMode.scenes?.[sceneIndex]?.image : ""),
          imageAlt: pickFirst(projects[sceneIndex]?.imageAlt, useSceneFallbacks ? fallbackMode.scenes?.[sceneIndex]?.imageAlt : ""),
          title: pickFirst(projects[sceneIndex]?.title, useSceneFallbacks ? fallbackMode.scenes?.[sceneIndex]?.title : ""),
          summary: pickFirst(projects[sceneIndex]?.summary, useSceneFallbacks ? fallbackMode.scenes?.[sceneIndex]?.summary : ""),
          tags: projects[sceneIndex]?.tags?.length ? projects[sceneIndex].tags : (useSceneFallbacks ? fallbackMode.scenes?.[sceneIndex]?.tags || [] : []),
          href: projects[sceneIndex]?.href,
        })
      ),
      bubble: pickFirst(bubbleByTitle[resolvedTitle.toLowerCase()], fallbackMode.bubble),
      topLayout: fallbackMode.topLayout,
      bottomLayout: fallbackMode.bottomLayout,
    };
  });
}

function mapServiceCards(items = [], fallbackCards = []) {
  return fallbackCards.map((fallbackCard, index) => {
    const item = items[index] || {};
    const button = mapButton(item?.pulsante, fallbackCard.buttonLabel, fallbackCard.href);
    const isVideo = Boolean(item?.cover?.mime?.startsWith("video/"));
    const mediaSrc = isVideo
      ? getStrapiMediaUrl(item.cover.url) || fallbackCard.image
      : resolveMediaUrl(item?.cover, "large", fallbackCard.image);

    return {
      title: pickFirst(item?.titolo, fallbackCard.title),
      href: button.href,
      image: mediaSrc,
      imageAlt: pickFirst(item?.cover?.alternativeText, fallbackCard.imageAlt),
      summary: pickFirst(item?.contenuto, fallbackCard.summary),
      bullets: splitRichTextParagraphs(item?.sottotitolo).length
        ? splitRichTextParagraphs(item?.sottotitolo)
        : splitTags(item?.sottotitolo).length
          ? splitTags(item?.sottotitolo)
          : fallbackCard.bullets,
      buttonLabel: button.label,
      isVideo,
    };
  });
}

function mapThoughtCards(cards = [], fallbackCards = []) {
  return fallbackCards.map((fallbackCard, index) => {
    const item = cards[index] || {};

    return {
      label: pickFirst(item?.titolo, fallbackCard.label),
      href: pickFirst(item?.url, fallbackCard.href),
      summary: pickFirst(item?.contenuto, fallbackCard.summary),
      cta: fallbackCard.cta,
      stickerClass: fallbackCard.stickerClass,
    };
  });
}

export async function getServicesPageContent({ lang = DEFAULT_LANG, fallback }) {
  const response = await getSingleDocument("pagina-servizi", {
    locale: lang,
    status: "published",
    populate: servicePopulate,
  });

  const page = response?.data || {};

  return {
    header: mapHeader(page.header, fallback.header),
    intro: mapIntro(page.intro, fallback.intro),
    serviceCards: mapServiceCards(asArray(page.servizi), fallback.serviceCards),
    clientNames: asArray(page.loghi).map((item) => item?.titolo).filter(Boolean).length
      ? asArray(page.loghi).map((item) => item?.titolo).filter(Boolean)
      : fallback.clientNames,
    originalsIntro: pickFirst(page.originals, fallback.originalsIntro),
    oscarCta: {
      title: pickFirst(page.cta?.titolo, fallback.oscarCta.title),
      subtitle: pickFirst(page.cta?.sottotitolo, fallback.oscarCta.subtitle),
      content: pickFirst(page.cta?.contenuto, fallback.oscarCta.content),
      image: resolveMediaUrl(page.cta?.cover, "large", fallback.oscarCta.image),
      imageAlt: pickFirst(page.cta?.cover?.alternativeText, fallback.oscarCta.imageAlt),
      button: mapButton(page.cta?.pulsante, fallback.oscarCta.button.label, fallback.oscarCta.button.href),
    },
  };
}

export async function getServiceDetailContent({ resource, lang = DEFAULT_LANG, fallback }) {
  const populate = serviceDetailPopulateByResource[resource] || baseServiceDetailPopulate;
  const response = await getSingleDocument(resource, {
    locale: lang,
    status: "published",
    populate,
  });

  const page = response?.data || {};

  return {
    header: mapHeader(page.header, fallback.header),
    intro: mapIntro(page.intro, fallback.intro),
    modes: mapCompositItems(page, fallback.modes, fallback.tag),
    tag: pickFirst(fallback.tag),
    cta: {
      kicker: pickFirst(page.cta?.sottotitolo, fallback.cta.kicker),
      title: pickFirst(page.cta?.titolo, fallback.cta.title),
      figureSrc: resolveMediaUrl(page.cta?.cover, "large", fallback.cta.figureSrc),
      figureAlt: pickFirst(page.cta?.cover?.alternativeText, fallback.cta.figureAlt),
      background: pickFirst(page.cta?.bgColor, fallback.cta.background),
      button: mapButton(page.cta?.pulsante, fallback.cta.button.label, fallback.cta.button.href),
    },
  };
}

export async function getServicesOriginalSlides({ lang = DEFAULT_LANG, limit = 3, fallback = [] }) {
  const response = await getCollectionDocuments("originals", {
    locale: lang,
    status: "published",
    sort: ["updatedAt:desc"],
    pagination: { page: 1, pageSize: limit },
    fields: ["titolo", "slug"],
    populate: {
      cover: true,
      tipologie_progetto: true,
    },
  });

  const slides = asArray(response?.data).map((item, index) => ({
    title: pickFirst(item?.titolo, fallback[index]?.title),
    subtitle: pickFirst(item?.tipologie_progetto?.[0]?.titolo, fallback[index]?.subtitle),
    image: resolveMediaUrl(item?.cover, "large", fallback[index]?.image),
    slug: pickFirst(item?.slug, fallback[index]?.slug),
  }));

  return slides.length ? slides : fallback;
}

export function getServiceRouteKey(slug) {
  return serviceRouteKeys[slug] || "services";
}

export function getLabel(label, lang = DEFAULT_LANG, fallback = label) {
  try {
    return customLabel(label, lang) || fallback;
  } catch {
    return fallback;
  }
}
