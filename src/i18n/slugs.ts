import type { Lang } from "./config";

export const localizedSlugs = {
  home: {
    it: "",
    en: "",
  },
  studio: {
    it: "studio-creativo-animazione",
    en: "animation-studio",
  },
  studioStory: {
    it: "studio-creativo-animazione/storia-chi-siamo",
    en: "animation-studio/our-story",
  },
  studioTeam: {
    it: "studio-creativo-animazione/team-creativo-panebarco",
    en: "animation-studio/our-team",
  },
  studioOscars: {
    it: "studio-creativo-animazione/visione-creativa",
    en: "animation-studio/our-vision",
  },
  services: {
    it: "servizi-produzione-video",
    en: "animated-video-production",
  },
  servicesCommercials: {
    it: "servizi-produzione-video/produzione-video-promozionali",
    en: "animated-video-production/animated-commercials",
  },
  servicesPost: {
    it: "servizi-produzione-video/post-produzione-video",
    en: "animated-video-production/post-production-vfx",
  },
  servicesService: {
    it: "servizi-produzione-video/service-produzione-esecutiva",
    en: "animated-video-production/animation-service-executive-production",
  },
  servicesMore: {
    it: "servizi-produzione-video/altri-progetti",
    en: "animated-video-production/special-projects",
  },
  portfolio: {
    it: "portfolio",
    en: "portfolio",
  },
  originals: {
    it: "produzioni-originali",
    en: "originals",
  },
  paneblog: {
    it: "paneblog",
    en: "blog",
  },
  paneblogTravelDiary: {
    it: "paneblog/diario-di-viaggio",
    en: "blog/travel-diary",
  },
  contacts: {
    it: "contatti",
    en: "contact-us",
  },
  privacyPolicy: {
    it: "privacy-policy",
    en: "privacy-policy",
  },
  privacyPolicyNewsletter: {
    it: "privacy-policy-newsletter",
    en: "privacy-policy-newsletter",
  },
  privacyPolicyPsl: {
    it: "privacy-policy-social-library",
    en: "privacy-policy-social-library",
  },
  cookiePolicy: {
    it: "cookie-policy",
    en: "cookie-policy",
  },
  socialLibrary: {
    it: "social-library",
    en: "social-library",
  },
} as const;

export type LocalizedSlugKey = keyof typeof localizedSlugs;

export function customSlug(key: LocalizedSlugKey, lang: Lang) {
  return localizedSlugs[key][lang];
}
