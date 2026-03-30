import type { Lang } from "../i18n/config";
import { buildPath, joinLocalizedPath } from "../i18n/routing";
import { originalsProjects } from "./originals";
import { portfolioProjects } from "./portfolio";

type LocalizedText = Record<Lang, string>;
type ShowcaseSlot = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "wide";
type ShowcaseLinkKey = "candies" | "bears" | "service";

export interface PortfolioShowcaseItem {
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  slot: ShowcaseSlot;
  tags: string[];
  href?: string;
  ariaLabel?: string;
}

export interface PortfolioShowcaseContent {
  title: string;
  stickerSrc: string;
  stickerAlt: string;
  ctaLabel: string;
  ctaHref: string;
  items: PortfolioShowcaseItem[];
}

interface BaseShowcaseItem {
  title: LocalizedText;
  summary: LocalizedText;
  imageAlt: LocalizedText;
  image: string;
  slot: ShowcaseSlot;
  tags: LocalizedText[];
  linkKey: ShowcaseLinkKey;
  linkedOnHome?: boolean;
}

const showcaseCopy = {
  title: {
    it: "PORTFOLIO",
    en: "PORTFOLIO",
  },
  stickerAlt: {
    it: "",
    en: "",
  },
  ctaLabel: {
    it: "Guarda tutti i progetti",
    en: "View all projects",
  },
} as const;

const baseShowcaseItems: BaseShowcaseItem[] = [
  {
    title: {
      it: "Caramelle",
      en: "Candies",
    },
    summary: {
      it: "Un immaginario morbido e riconoscibile, costruito per tenere insieme tono, personaggi e atmosfera.",
      en: "A soft, recognizable world built to keep tone, characters and atmosphere aligned.",
    },
    imageAlt: {
      it: "Frame del progetto Caramelle",
      en: "Frame from the Candies project",
    },
    image: "/images/portfolio-cover-01-695x391.jpg",
    slot: "top-left",
    tags: [
      { it: "2D", en: "2D" },
      { it: "Animazione", en: "Animation" },
    ],
    linkKey: "candies",
  },
  {
    title: {
      it: "#Nostoppingnora",
      en: "#Nostoppingnora",
    },
    summary: {
      it: "Un progetto pensato per essere immediato, energico e leggibile anche nei formati più veloci.",
      en: "A project designed to be immediate, energetic and readable even in faster formats.",
    },
    imageAlt: {
      it: "Frame del progetto #Nostoppingnora",
      en: "Frame from the #Nostoppingnora project",
    },
    image: "/images/portfolio-cover-02-695x391.jpg",
    slot: "top-right",
    tags: [
      { it: "3D", en: "3D" },
      { it: "VFX", en: "VFX" },
    ],
    linkKey: "candies",
  },
  {
    title: {
      it: "Vita dura per gli Orsi Marsicani",
      en: "A Hard Life for the Marsican Bears",
    },
    summary: {
      it: "Service e intervento digitale integrati dentro uno spot dove la tecnica resta al servizio della scena.",
      en: "Service and digital work integrated into a commercial where the technique stays in service of the scene.",
    },
    imageAlt: {
      it: "Frame del progetto Vita dura per gli Orsi Marsicani",
      en: "Frame from A Hard Life for the Marsican Bears",
    },
    image: "/images/portfolio-cover-03-695x391.jpg",
    slot: "bottom-left",
    tags: [
      { it: "Regia", en: "Direction" },
      { it: "2D", en: "2D" },
    ],
    linkKey: "bears",
    linkedOnHome: true,
  },
  {
    title: {
      it: "Marta e la morte",
      en: "Marta and Death",
    },
    summary: {
      it: "Un frame più autoriale, dove composizione e atmosfera guidano la percezione del racconto.",
      en: "A more authorial frame, where composition and atmosphere drive the perception of the story.",
    },
    imageAlt: {
      it: "Frame del progetto Marta e la morte",
      en: "Frame from Marta and Death",
    },
    image: "/images/portfolio-cover-04-695x391.jpg",
    slot: "bottom-right",
    tags: [
      { it: "Animazione", en: "Animation" },
      { it: "3D", en: "3D" },
    ],
    linkKey: "candies",
  },
  {
    title: {
      it: "Panebarco service",
      en: "Panebarco service",
    },
    summary: {
      it: "Supporto produttivo, pipeline e immagine finale si tengono insieme in un unico spazio visivo.",
      en: "Production support, pipeline and final image stay together inside one visual space.",
    },
    imageAlt: {
      it: "Frame del progetto Panebarco service",
      en: "Frame from the Panebarco service project",
    },
    image: "/images/portfolio-cover-05-695x391.jpg",
    slot: "wide",
    tags: [
      { it: "Regia", en: "Direction" },
      { it: "VFX", en: "VFX" },
      { it: "3D", en: "3D" },
    ],
    linkKey: "service",
  },
] as const;

function getShowcaseLinks(lang: Lang) {
  return {
    candies: joinLocalizedPath(buildPath("originals", lang), originalsProjects[0].slug[lang]),
    bears: joinLocalizedPath(buildPath("portfolio", lang), portfolioProjects[0].slug[lang]),
    service: buildPath("servicesService", lang),
  } as const;
}

export function getPortfolioShowcaseContent(
  lang: Lang,
  options: { linkAll?: boolean } = {}
): PortfolioShowcaseContent {
  const { linkAll = false } = options;
  const links = getShowcaseLinks(lang);
  const isItalian = lang === "it";

  return {
    title: showcaseCopy.title[lang],
    stickerSrc: "/images/cose belle che abbiamo fatto.png",
    stickerAlt: showcaseCopy.stickerAlt[lang],
    ctaLabel: showcaseCopy.ctaLabel[lang],
    ctaHref: buildPath("portfolio", lang),
    items: baseShowcaseItems.map((item) => {
      const href = linkAll || item.linkedOnHome ? links[item.linkKey] : undefined;
      const title = item.title[lang];

      return {
        title,
        summary: item.summary[lang],
        image: item.image,
        imageAlt: item.imageAlt[lang],
        slot: item.slot,
        tags: item.tags.map((tag) => tag[lang]),
        href,
        ariaLabel: href ? (isItalian ? `Apri il progetto ${title}` : `Open project ${title}`) : undefined,
      };
    }),
  };
}
