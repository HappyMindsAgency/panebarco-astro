import { strapi } from "@strapi/client";

const client = strapi({
  baseURL: import.meta.env.STRAPI_API_URL,
  auth: import.meta.env.AUTH_READONLY,
});

const responseCache = new Map();
const shouldUseCache = import.meta.env.PROD;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = stableValue(value[key]);
        return accumulator;
      }, {});
  }

  return value;
}

function getCacheKey(type, resource, query = {}) {
  return `${type}:${resource}:${JSON.stringify(stableValue(query))}`;
}

function getCacheEntry(cacheKey) {
  const entry = responseCache.get(cacheKey);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(cacheKey);
    return null;
  }
  return entry.promise;
}

function setCacheEntry(cacheKey, promise) {
  responseCache.set(cacheKey, { promise, timestamp: Date.now() });
  return promise;
}

export function getStrapiClient() {
  return client;
}

export async function getSingleDocument(resource, query = {}) {
  if (!shouldUseCache) {
    return client
      .single(resource)
      .find(query)
      .catch((error) => {
        console.warn(`[strapi] Failed to fetch single "${resource}"`, error);
        return { data: null, meta: {} };
      });
  }

  const cacheKey = getCacheKey("single", resource, query);
  const cached = getCacheEntry(cacheKey);
  if (cached) return cached;

  return setCacheEntry(
    cacheKey,
    client
      .single(resource)
      .find(query)
      .catch((error) => {
        console.warn(`[strapi] Failed to fetch single "${resource}"`, error);
        return { data: null, meta: {} };
      })
  );
}

export async function getCollectionDocuments(resource, query = {}) {
  if (!shouldUseCache) {
    return client
      .collection(resource)
      .find(query)
      .catch((error) => {
        console.warn(`[strapi] Failed to fetch collection "${resource}"`, error);
        return { data: [], meta: {} };
      });
  }

  const cacheKey = getCacheKey("collection", resource, query);
  const cached = getCacheEntry(cacheKey);
  if (cached) return cached;

  return setCacheEntry(
    cacheKey,
    client
      .collection(resource)
      .find(query)
      .catch((error) => {
        console.warn(`[strapi] Failed to fetch collection "${resource}"`, error);
        return { data: [], meta: {} };
      })
  );
}
