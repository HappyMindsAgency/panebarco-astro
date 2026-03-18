import { DEFAULT_LANG, isLang, type Lang } from "./config";
import { customSlug, localizedSlugs, type LocalizedSlugKey } from "./slugs";

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

export function normalizePath(pathname: string) {
  const [cleanPath] = pathname.split(/[?#]/, 1);
  const normalized = `/${trimSlashes(cleanPath || "/")}`.replace(/\/+/g, "/");

  if (normalized === "//") return "/";
  if (normalized !== "/" && normalized.endsWith("/")) return normalized.slice(0, -1);

  return normalized;
}

export function getLangFromPath(pathname: string): Lang {
  const normalized = normalizePath(pathname);

  if (normalized === "/en" || normalized.startsWith("/en/")) {
    return "en";
  }

  return DEFAULT_LANG;
}

export function stripLangPrefix(pathname: string) {
  const normalized = normalizePath(pathname);

  if (normalized === "/en") {
    return "/";
  }

  if (normalized.startsWith("/en/")) {
    return normalized.slice(3) || "/";
  }

  return normalized;
}

export function getPrefix(lang: Lang) {
  return lang === DEFAULT_LANG ? "/" : `/${lang}/`;
}

export function buildPath(key: LocalizedSlugKey, lang: Lang = DEFAULT_LANG) {
  const slug = customSlug(key, lang);

  if (!slug) {
    return lang === DEFAULT_LANG ? "/" : normalizePath(`/${lang}`);
  }

  return normalizePath(`${getPrefix(lang)}${slug}`);
}

export function joinLocalizedPath(basePath: string, slug: string) {
  return normalizePath(`${normalizePath(basePath)}/${trimSlashes(slug)}`);
}

export function switchLanguagePath(pathname: string, targetLang: Lang) {
  const normalized = normalizePath(pathname);
  const currentLang = getLangFromPath(normalized);
  const stripped = stripLangPrefix(normalized);

  if (currentLang === targetLang) {
    return normalized;
  }

  return targetLang === DEFAULT_LANG ? stripped : normalizePath(`/${targetLang}${stripped}`);
}

export function parseLang(value: string | undefined) {
  if (value && isLang(value)) {
    return value;
  }

  return DEFAULT_LANG;
}

export function getLocalizedSlugMap() {
  return localizedSlugs;
}
