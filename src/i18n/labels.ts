import type { Lang } from "./config";

export const localizedLabels = {
  menu: {
    studio: {
      it: "Studio",
      en: "Studio",
    },
    studioStory: {
      it: "storia di un'azienda mutante",
      en: "story of a mutant company",
    },
    studioTeam: {
      it: "i panebarcos",
      en: "the panebarcos",
    },
    studioOscars: {
      it: "ci vediamo agli oscar",
      en: "see you at the oscars",
    },
    services: {
      it: "Servizi",
      en: "Services",
    },
    servicesCommercials: {
      it: "commercials",
      en: "commercials",
    },
    servicesPost: {
      it: "post-produzione",
      en: "post-production",
    },
    servicesService: {
      it: "service",
      en: "service",
    },
    servicesMore: {
      it: "...e tanto altro",
      en: "...and much more",
    },
    portfolio: {
      it: "Portfolio",
      en: "Portfolio",
    },
    originals: {
      it: "Originals",
      en: "Originals",
    },
    paneblog: {
      it: "Paneblog",
      en: "Paneblog",
    },
    paneblogTravelDiary: {
      it: "diario di viaggio",
      en: "travel diary",
    },
    contacts: {
      it: "Contatti",
      en: "Contacts",
    },
  },
  footer: {
    heading: {
      it: "Hai un progetto in mente?",
      en: "Do you have a project in mind?",
    },
    headingStrong: {
      it: "Lo animiamo noi.",
      en: "We bring it to life.",
    },
    contactCta: {
      it: "CONTATTACI",
      en: "CONTACT US",
    },
    privacy: {
      it: "Privacy Policy",
      en: "Privacy Policy",
    },
    cookies: {
      it: "Cookie Policy",
      en: "Cookie Policy",
    },
    signature: {
      it: "Prodotto originale frutto delle menti felici e creative di",
      en: "An original product created by the happy and creative minds of",
    },
  },
  a11y: {
    openMenu: {
      it: "Apri menu",
      en: "Open menu",
    },
    closeMenu: {
      it: "Chiudi menu",
      en: "Close menu",
    },
    mainMenu: {
      it: "Menu principale",
      en: "Main menu",
    },
    openStudioSubmenu: {
      it: "Mostra sottovoci Studio",
      en: "Show Studio submenu",
    },
    studioSubmenu: {
      it: "Sottovoci Studio",
      en: "Studio submenu",
    },
    openServicesSubmenu: {
      it: "Mostra sottovoci Servizi",
      en: "Show Services submenu",
    },
    servicesSubmenu: {
      it: "Sottovoci Servizi",
      en: "Services submenu",
    },
    openPaneblogSubmenu: {
      it: "Mostra sottovoci Paneblog",
      en: "Show Paneblog submenu",
    },
    paneblogSubmenu: {
      it: "Sottovoci Paneblog",
      en: "Paneblog submenu",
    },
    languageSwitch: {
      it: "Cambio lingua",
      en: "Language switch",
    },
    switchToEnglish: {
      it: "Passa a inglese",
      en: "Switch to English",
    },
    switchToItalian: {
      it: "Passa a italiano",
      en: "Switch to Italian",
    },
  },
} as const;

type LabelGroups = typeof localizedLabels;
type GroupName = keyof LabelGroups;

type GroupLabelKey<T extends GroupName> = `${T}.${keyof LabelGroups[T] & string}`;

export type LabelKey =
  | GroupLabelKey<"menu">
  | GroupLabelKey<"footer">
  | GroupLabelKey<"a11y">;

export function customLabel(key: LabelKey, lang: Lang) {
  const [group, item] = key.split(".") as [GroupName, string];
  return localizedLabels[group][item as keyof LabelGroups[typeof group]][lang];
}
