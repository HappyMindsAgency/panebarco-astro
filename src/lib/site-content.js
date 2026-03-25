import { buildPath, joinLocalizedPath } from "../i18n/routing";
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
    backgroundVideoSrc: resolveMediaUrl(header?.videoBackground || header?.mediaBackground, "large", fallback.backgroundVideoSrc),
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

function stripRichTextSyntax(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_>`~-]/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTextBlocks(value) {
  return String(value || "")
    .split(/\n{2,}/)
    .map((item) => stripRichTextSyntax(item))
    .filter(Boolean);
}

function extractMarkdownHeading(value, level = 2) {
  const source = String(value || "");
  const pattern = new RegExp(`^#{${level}}\\s+(.+)$`, "m");
  const match = source.match(pattern);

  if (!match) {
    return {
      heading: "",
      body: source,
    };
  }

  return {
    heading: stripRichTextSyntax(match[1]),
    body: source.replace(match[0], "").replace(/^\s+/, ""),
  };
}

function mapHomeHeader(header, fallback = {}) {
  const button = mapButton(header?.pulsante, fallback.cta?.label, fallback.cta?.href);

  return {
    title: pickFirst(header?.titolo, fallback.title),
    subtitle: pickFirst(header?.contenuto, fallback.subtitle),
    videoSrc: resolveMediaUrl(header?.video, "large", fallback.videoSrc),
    cta: {
      label: button.label,
      href: button.href,
    },
  };
}

function mapHomeIntro(intro, fallback = {}) {
  const paragraphs = splitTextBlocks(intro?.contenuto);
  const buttons = asArray(intro?.pulsanti);
  const firstButton = mapButton(buttons[0], fallback.button?.label, fallback.button?.href);

  return {
    title: pickFirst(intro?.titolo, fallback.title),
    typingWords: asArray(intro?.sottotitolo).map((item) => pickFirst(item?.testo)).filter(Boolean).length
      ? asArray(intro?.sottotitolo).map((item) => pickFirst(item?.testo)).filter(Boolean)
      : asArray(fallback.typingWords),
    paragraphs: paragraphs.length ? paragraphs : asArray(fallback.paragraphs),
    imageSrc: resolveMediaUrl(intro?.cover, "large", fallback.imageSrc),
    imageAlt: pickFirst(intro?.cover?.alternativeText, fallback.imageAlt),
    button: {
      label: firstButton.label,
      href: firstButton.href,
    },
  };
}

function mapHomeServiceCards(items = [], fallbackItems = []) {
  return fallbackItems.map((fallbackItem, index) => {
    const item = items[index] || {};

    return {
      title: pickFirst(item?.titolo, fallbackItem.title),
      href: pickFirst(item?.url, fallbackItem.href),
      image: resolveMediaUrl(item?.cover, "large", fallbackItem.image),
      summary: pickFirst(stripRichTextSyntax(item?.contenuto), fallbackItem.summary),
    };
  });
}

function mapStudioIntro(intro, fallback = {}) {
  const content = pickFirst(intro?.contenuto, asArray(fallback.paragraphs).join("\n\n"));
  const button = mapButton(intro?.pulsante, fallback.button?.label, fallback.button?.href);

  return {
    title: pickFirst(intro?.titolo, fallback.title),
    content,
    mediaSrc: resolveMediaUrl(intro?.media, "large", fallback.mediaSrc),
    mediaAlt: pickFirst(intro?.media?.alternativeText, fallback.mediaAlt),
    button: {
      label: button.label,
      href: button.href,
    },
  };
}

function mapStudioCta(cta, fallback = {}) {
  const button = mapButton(cta?.pulsante, fallback.button?.label, fallback.button?.href);

  return {
    kicker: pickFirst(cta?.sottotitolo, fallback.kicker),
    title: pickFirst(cta?.titolo, fallback.title),
    body: pickFirst(stripRichTextSyntax(cta?.contenuto), fallback.body),
    imageSrc: resolveMediaUrl(cta?.cover, "large", fallback.imageSrc),
    imageAlt: pickFirst(cta?.cover?.alternativeText, fallback.imageAlt),
    button: {
      label: button.label,
      href: button.href,
    },
  };
}

function mapOscarsBeliefs(section, fallback = {}) {
  const items = asArray(section?.item);
  const fallbackItems = asArray(fallback.items);

  return {
    title: pickFirst(section?.titolo, fallback.title),
    imageSrc: resolveMediaUrl(section?.cover, "large", fallback.imageSrc),
    imageAlt: pickFirst(section?.cover?.alternativeText, fallback.imageAlt),
    items: (items.length ? items : fallbackItems).map((item, index) => {
      const fallbackItem = fallbackItems[index] || fallbackItems[0] || {};

      return {
        title: pickFirst(item?.titolo, fallbackItem.title),
        subtitle: pickFirst(item?.contenuto, fallbackItem.subtitle),
        theme: pickFirst(fallbackItem.theme, "blue"),
        bgColor: pickFirst(item?.bgColor, fallbackItem.bgColor),
      };
    }),
  };
}

function mapOscarsWorkflow(items = []) {
  return asArray(items).map((item, index) => ({
    kicker: String.fromCharCode(65 + index),
    title: pickFirst(item?.titolo),
    content: pickFirst(item?.contenuto),
  })).filter((item) => item.title || item.content);
}

function mapContactBannerCta(cta, fallback = {}) {
  const button = mapButton(cta?.pulsante, fallback.button?.label, fallback.button?.href);

  return {
    kicker: pickFirst(cta?.sottotitolo, fallback.kicker),
    title: pickFirst(cta?.titolo, fallback.title),
    imageSrc: resolveMediaUrl(cta?.cover, "large", fallback.imageSrc),
    imageAlt: pickFirst(cta?.cover?.alternativeText, fallback.imageAlt),
    background: pickFirst(cta?.bgColor, fallback.background),
    button: {
      label: button.label,
      href: button.href,
    },
  };
}

function extractEmbedSrc(embedValue) {
  const source = String(embedValue || "").trim();

  if (!source) return "";
  if (/^https?:\/\//i.test(source)) return source;

  const iframeSrcMatch = source.match(/src=["']([^"']+)["']/i);
  return iframeSrcMatch ? iframeSrcMatch[1] : "";
}

function mapStoryMutantCards(items = [], fallback = {}) {
  return asArray(items).map((item) => ({
    title: pickFirst(item?.titolo),
    content: pickFirst(item?.contenuto),
    imageSrc: resolveMediaUrl(item?.cover, "large", fallback.imageSrc),
    imageAlt: pickFirst(item?.cover?.alternativeText, fallback.imageAlt),
  })).filter((item) => item.title || item.content || item.imageSrc);
}

function mapPanebarcosSections(items = [], fallback = {}) {
  const sections = asArray(items).map((section) => {
    const members = asArray(section?.team).map((member) => {
      const name = [pickFirst(member?.nome), pickFirst(member?.cognome)].filter(Boolean).join(" ").trim();

      return {
        name,
        role: pickFirst(member?.ruoloUfficiale),
        roleTana: pickFirst(member?.ruoloTana),
        intro: pickFirst(member?.intro),
        linkedin: pickFirst(member?.linkedin),
        imageSrc: resolveMediaUrl(member?.cover, "large", fallback.memberImageSrc),
        imageAlt: pickFirst(member?.cover?.alternativeText, name),
      };
    }).filter((member) => member.name || member.role || member.roleTana || member.intro || member.linkedin || member.imageSrc);

    return {
      title: pickFirst(section?.titolo),
      subtitle: pickFirst(section?.sottotitolo),
      content: pickFirst(section?.contenuto),
      members,
    };
  }).filter((section) => section.title || section.subtitle || section.content || section.members.length);

  const namedSections = [];
  const anonymousMembers = [];

  sections.forEach((section) => {
    const hasOwnContent = Boolean(section.title || section.subtitle || section.content);

    if (hasOwnContent) {
      namedSections.push(section);
      return;
    }

    anonymousMembers.push(...section.members);
  });

  if (!anonymousMembers.length) {
    return namedSections;
  }

  return [
    {
      title: "",
      subtitle: "",
      content: "",
      members: anonymousMembers,
    },
    ...namedSections,
  ];
}

function mapPortfolioShowcaseItems(items = [], fallbackItems = []) {
  return fallbackItems.map((fallbackItem, index) => {
    const item = items[index] || {};
    const categories = asArray(item?.categorie_progetto).map((entry) => pickFirst(entry?.titolo)).filter(Boolean);
    const types = asArray(item?.tipologie_progetto).map((entry) => pickFirst(entry?.titolo)).filter(Boolean);
    const tags = [...categories, ...types].filter(Boolean);

    return {
      title: pickFirst(item?.titolo, fallbackItem.title),
      summary: pickFirst(stripRichTextSyntax(item?.intro), fallbackItem.summary),
      image: resolveMediaUrl(item?.cover, "large", fallbackItem.image),
      imageAlt: pickFirst(item?.cover?.alternativeText, fallbackItem.imageAlt),
      slot: pickFirst(fallbackItem.slot),
      tags: tags.length ? tags.slice(0, 3) : fallbackItem.tags,
      slug: pickFirst(item?.slug),
    };
  });
}

function mapHomeOriginalsShowcaseItems(items = [], fallbackItems = []) {
  return fallbackItems.map((fallbackItem, index) => {
    const item = items[index] || {};

    return {
      title: pickFirst(item?.titolo, fallbackItem.title),
      image: resolveMediaUrl(item?.cover, "large", fallbackItem.image),
      imageAlt: pickFirst(item?.cover?.alternativeText, fallbackItem.imageAlt, fallbackItem.title),
      slug: pickFirst(item?.slug, fallbackItem.slug),
    };
  });
}

export async function getHomePageContent({ lang = DEFAULT_LANG, fallback }) {
  const response = await getSingleDocument("pagina-home-page", {
    locale: lang,
    status: "published",
    populate: {
      header: {
        populate: {
          video: true,
          pulsante: true,
        },
      },
      intro: {
        populate: {
          cover: true,
          pulsanti: true,
          sottotitolo: true,
        },
      },
      servizi: {
        populate: {
          cover: true,
        },
      },
      seo: {
        fields: ["metaTitle", "metaDescription"],
      },
    },
  });

  const page = response?.data || {};

  return {
    header: mapHomeHeader(page?.header, fallback.header),
    intro: mapHomeIntro(page?.intro, fallback.intro),
    originals: pickFirst(stripRichTextSyntax(page?.originals), fallback.originals),
    services: {
      title: pickFirst(fallback.services?.title, "SERVIZI"),
      stickerSrc: pickFirst(fallback.services?.stickerSrc),
      stickerAlt: pickFirst(fallback.services?.stickerAlt),
      items: asArray(page?.servizi).length
        ? mapHomeServiceCards(asArray(page?.servizi), fallback.services?.items || [])
        : asArray(fallback.services?.items),
    },
    seo: {
      title: pickFirst(page?.seo?.metaTitle, fallback.seo?.title),
      description: pickFirst(page?.seo?.metaDescription, fallback.seo?.description),
    },
  };
}

export async function getStudioPageContent({ lang = DEFAULT_LANG, fallback }) {
  const response = await getSingleDocument("pagina-studio", {
    locale: lang,
    status: "published",
    populate: {
      header: {
        populate: {
          mediaBackground: true,
          imgTeam: true,
        },
      },
      intro: {
        populate: {
          media: true,
          pulsante: true,
        },
      },
      sliderProtagonisti: true,
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
  });

  const page = response?.data || {};
  const protagonistsContent = pickFirst(page?.contenutoProtagonisti, asArray(fallback.protagonists?.paragraphs).join("\n\n"));
  const protagonistsImages = asArray(page?.sliderProtagonisti).map((item) => ({
    src: resolveMediaUrl(item, "large"),
    alt: pickFirst(item?.alternativeText, fallback.protagonists?.imageAlt),
  })).filter((item) => item.src);

  return {
    header: mapHeader(page?.header, fallback.header),
    intro: mapStudioIntro(page?.intro, fallback.intro),
    protagonists: {
      title: pickFirst(fallback.protagonists?.title),
      content: protagonistsContent,
      images: protagonistsImages.length ? protagonistsImages : asArray(fallback.protagonists?.images),
    },
    cta: mapStudioCta(page?.cta, fallback.cta),
    seo: {
      title: pickFirst(page?.seo?.metaTitle, fallback.seo?.title),
      description: pickFirst(page?.seo?.metaDescription, fallback.seo?.description),
    },
  };
}

/** @returns {Promise<import("./site-content.types").OscarsPageContent>} */
export async function getOscarsPageContent({ lang = DEFAULT_LANG, fallback }) {
  const response = await getSingleDocument("pagina-vediamo-oscar", {
    locale: lang,
    status: "published",
    populate: {
      header: {
        populate: {
          videoBackground: true,
          imgTeam: true,
        },
      },
      cosaCrediamo: {
        populate: {
          cover: true,
          item: true,
        },
      },
      sezioneWorkflow: true,
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
  });

  const page = response?.data || {};
  const dreamContent = extractMarkdownHeading(page?.cosaSogniamo, 2);
  const workflowItems = mapOscarsWorkflow(page?.sezioneWorkflow);

  return {
    header: mapHeader(page?.header, fallback.header),
    beliefs: mapOscarsBeliefs(page?.cosaCrediamo, fallback.beliefs),
    dream: {
      title: pickFirst(dreamContent.heading),
      content: pickFirst(dreamContent.body),
      imageSrc: pickFirst(fallback.dream?.imageSrc),
      imageAlt: pickFirst(fallback.dream?.imageAlt),
    },
    workflow: {
      title: pickFirst(fallback.workflow?.title),
      subtitle: pickFirst(fallback.workflow?.subtitle),
      items: workflowItems.length ? workflowItems : asArray(fallback.workflow?.items),
    },
    cta: page?.cta ? mapContactBannerCta(page?.cta, fallback.cta) : null,
    seo: {
      title: pickFirst(page?.seo?.metaTitle, fallback.seo?.title),
      description: pickFirst(page?.seo?.metaDescription, fallback.seo?.description),
    },
  };
}

/** @returns {Promise<import("./site-content.types").StoryMutantPageContent>} */
export async function getStoryMutantPageContent({ lang = DEFAULT_LANG, fallback }) {
  const response = await getSingleDocument("pagina-storia-azienda-mutante", {
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
      card: {
        populate: {
          cover: true,
        },
      },
      raccoltaVideo: {
        populate: {
          video: true,
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
  });

  const page = response?.data || {};
  const introContent = pickFirst(page?.intro?.contenuto);
  const timelineContent = pickFirst(page?.contenuto);
  const videoCollection = page?.raccoltaVideo;
  const videos = asArray(videoCollection?.video).map((item, index) => ({
    title: pickFirst(item?.titolo, `${pickFirst(videoCollection?.titolo, "Video")} ${index + 1}`),
    embedSrc: extractEmbedSrc(item?.embed),
  })).filter((item) => item.embedSrc);

  return {
    header: mapHeader(page?.header, fallback.header),
    intro: {
      title: pickFirst(page?.intro?.titolo),
      content: introContent,
      mediaSrc: resolveMediaUrl(page?.intro?.media, "large", fallback.intro?.mediaSrc),
      mediaAlt: pickFirst(page?.intro?.media?.alternativeText, fallback.intro?.mediaAlt),
    },
    timeline: {
      title: pickFirst(page?.titoloStoriaAzienda, fallback.timeline?.title),
      content: timelineContent,
      cards: mapStoryMutantCards(page?.card, fallback.timeline),
    },
    mediaGallery: {
      title: pickFirst(videoCollection?.titolo),
      content: pickFirst(videoCollection?.contenuto),
      videos,
    },
    cta: page?.cta ? mapContactBannerCta(page?.cta, fallback.cta) : null,
    seo: {
      title: pickFirst(page?.seo?.metaTitle, fallback.seo?.title),
      description: pickFirst(page?.seo?.metaDescription, fallback.seo?.description),
    },
  };
}

/** @returns {Promise<import("./site-content.types").PanebarcosPageContent>} */
export async function getPanebarcosPageContent({ lang = DEFAULT_LANG, fallback }) {
  const response = await getSingleDocument("pagina-panebarcos", {
    locale: lang,
    status: "published",
    populate: {
      header: {
        populate: "*",
      },
      intro: {
        populate: "*",
      },
      team: {
        populate: {
          team: {
            populate: "*",
          },
        },
      },
      cta: {
        populate: "*",
      },
      seo: {
        fields: ["metaTitle", "metaDescription"],
      },
    },
  });

  const page = response?.data || {};

  return {
    header: mapHeader(page?.header, fallback.header),
    intro: mapStudioIntro(page?.intro, fallback.intro),
    sections: mapPanebarcosSections(page?.team, fallback.team),
    cta: page?.cta ? mapContactBannerCta(page?.cta, fallback.cta) : null,
    seo: {
      title: pickFirst(page?.seo?.metaTitle, fallback.seo?.title),
      description: pickFirst(page?.seo?.metaDescription, fallback.seo?.description),
    },
  };
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

export async function getPortfolioShowcaseContent({ lang = DEFAULT_LANG, fallback }) {
  const response = await getCollectionDocuments("progetti", {
    locale: lang,
    status: "published",
    filters: {
      inEvidenza: {
        $eq: true,
      },
    },
    sort: ["updatedAt:desc"],
    pagination: {
      page: 1,
      pageSize: asArray(fallback.items).length || 5,
    },
    fields: ["documentId", "titolo", "slug", "intro"],
    populate: {
      cover: true,
      categorie_progetto: {
        fields: ["titolo"],
      },
      tipologie_progetto: {
        fields: ["titolo"],
      },
    },
  });

  const projects = asArray(response?.data);
  const mappedItems = projects.length ? mapPortfolioShowcaseItems(projects, fallback.items) : asArray(fallback.items);
  const isItalian = lang === "it";

  return {
    title: pickFirst(fallback.title, "PORTFOLIO"),
    stickerSrc: pickFirst(fallback.stickerSrc),
    stickerAlt: pickFirst(fallback.stickerAlt),
    ctaLabel: pickFirst(fallback.ctaLabel),
    ctaHref: pickFirst(fallback.ctaHref, buildPath("portfolio", lang)),
    items: mappedItems.map((item) => {
      const href = item.slug ? joinLocalizedPath(pickFirst(fallback.baseHref, buildPath("portfolio", lang)), item.slug) : item.href;

      return {
        ...item,
        href,
        ariaLabel: href ? (isItalian ? `Apri il progetto ${item.title}` : `Open project ${item.title}`) : undefined,
      };
    }),
  };
}

export async function getHomeOriginalsShowcaseContent({ lang = DEFAULT_LANG, fallback }) {
  const response = await getCollectionDocuments("originals", {
    locale: lang,
    status: "published",
    sort: ["updatedAt:desc"],
    pagination: {
      page: 1,
      pageSize: asArray(fallback.items).length || 3,
    },
    fields: ["documentId", "titolo", "slug"],
    populate: {
      cover: true,
    },
  });

  const items = asArray(response?.data);
  const mappedItems = items.length ? mapHomeOriginalsShowcaseItems(items, fallback.items) : asArray(fallback.items);
  const baseHref = pickFirst(fallback.baseHref, buildPath("originals", lang));
  const isItalian = lang === "it";

  return {
    items: mappedItems.map((item) => {
      const link = item.slug ? joinLocalizedPath(baseHref, item.slug) : pickFirst(fallback.items?.[0]?.link, baseHref);

      return {
        title: item.title,
        image: item.image,
        imageAlt: item.imageAlt,
        link,
        ariaLabel: link ? (isItalian ? `Apri l'original ${item.title}` : `Open original ${item.title}`) : undefined,
      };
    }),
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
        : mapContactCards([], fallback.contactSection.cards, fallback.contactDetails),
    },
    formSection: {
      title: formParagraphs[0] || fallback.formSection.title,
      lead: formParagraphs[1] || fallback.formSection.lead,
    },
  };
}
