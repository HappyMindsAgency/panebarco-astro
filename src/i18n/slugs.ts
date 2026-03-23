import type { Lang } from "./config";

export const localizedSlugs = {
  home: {
    it: "",
    en: "",
  },
  studio: {
    it: "studio",
    en: "studio",
  },
  studioStory: {
    it: "studio/storia-di-un-azienda-mutante",
    en: "studio/storia-di-un-azienda-mutante",
  },
  studioTeam: {
    it: "studio/i-panebarcos",
    en: "studio/i-panebarcos",
  },
  studioOscars: {
    it: "studio/ci-vediamo-agli-oscar",
    en: "studio/ci-vediamo-agli-oscar",
  },
  services: {
    it: "servizi",
    en: "servizi",
  },
  servicesCommercials: {
    it: "servizi/commercials",
    en: "servizi/commercials",
  },
  servicesPost: {
    it: "servizi/post-produzione",
    en: "servizi/post-produzione",
  },
  servicesService: {
    it: "servizi/service",
    en: "servizi/service",
  },
  servicesMore: {
    it: "servizi/e-tanto-altro",
    en: "servizi/e-tanto-altro",
  },
  portfolio: {
    it: "portfolio",
    en: "portfolio",
  },
  originals: {
    it: "originals",
    en: "originals",
  },
  paneblog: {
    it: "paneblog",
    en: "paneblog",
  },
  paneblogTravelDiary: {
    it: "paneblog/diario-di-viaggio",
    en: "paneblog/diario-di-viaggio",
  },
  contacts: {
    it: "contatti",
    en: "contatti",
  },
  privacyPolicy: {
    it: "informativa-privacy-policy",
    en: "informativa-privacy-policy",
  },
  cookiePolicy: {
    it: "informativa-cookies-privacy",
    en: "informativa-cookies-privacy",
  },
} as const;

export type LocalizedSlugKey = keyof typeof localizedSlugs;

export function customSlug(key: LocalizedSlugKey, lang: Lang) {
  return localizedSlugs[key][lang];
}
