# Sbarabaus

Sito Astro per Panebarco.

## Binding Strapi
- Il client CMS condiviso e in [src/lib/strapi-client.js](/Users/violaolagrafica/Documents/GitHub/panebarco-astro/src/lib/strapi-client.js).
- Espone:
  - `getSingleDocument(resource, query)`
  - `getCollectionDocuments(resource, query)`
- Legge `STRAPI_API_URL` e `AUTH_READONLY` dalle env e usa `@strapi/client`.
- Le query si passano come oggetto, non come query string concatenata a mano.
- In produzione usa una cache in-memory per richieste identiche.
- Esempio:

```js
const pageResponse = await getSingleDocument("pagina-privacy-policy-newsletter", {
  locale: "it",
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
```

Per le informative:
- l'adapter e in [src/lib/legal-content.js](/Users/violaolagrafica/Documents/GitHub/panebarco-astro/src/lib/legal-content.js)
- la risoluzione lingua parte dalla route con [src/i18n/routing.ts](/Users/violaolagrafica/Documents/GitHub/panebarco-astro/src/i18n/routing.ts)
- i path traducibili stanno in [src/i18n/slugs.ts](/Users/violaolagrafica/Documents/GitHub/panebarco-astro/src/i18n/slugs.ts)
- il modulo `legal-content` usa lo stesso client Strapi del resto del progetto e restituisce dati gia pronti per la pagina
- il rendering del rich text passa da [src/components/cms/CmsContentRenderer.astro](/Users/violaolagrafica/Documents/GitHub/panebarco-astro/src/components/cms/CmsContentRenderer.astro), che oggi usa [src/components/RitchText.astro](/Users/violaolagrafica/Documents/GitHub/panebarco-astro/src/components/RitchText.astro)
- le quattro route legal mantengono il proprio markup e delegano solo dati e query al binding centralizzato

## HeroStyHome (src/components/HeroStyHome.astro)
Props principali:
- `videoSrc`: mp4 di sfondo. Se definito (anche stringa vuota) il video ha priorità.
- `imageSrc`: immagine di sfondo usata solo se non c’è un video valido.
- `show` (default `true`): mostra/nasconde l’intero blocco.
- `showSlider`, `showTitle`, `showSubtitle`, `showCta` (tutti default `true`): abilita le singole parti.
- `className`, `containerClass`, `heroClass`, `id`, `title`, `subtitle`, `ctaLabel`, `ctaHref`: testo e classi.

Comportamento media:
- `videoSrc` definito ➜ mostra il video (fallback di default: `/images/1021768637.mp4`).
- `videoSrc={false}` o `videoSrc={null}` ➜ salta il video.
- Immagine mostrata quando non c’è video: prende `imageSrc`, altrimenti il fallback `/images/hero-dettaglio-fallback.jpg`.

Snippet d’uso:
```astro
<!-- Video di default -->
<HeroStyHome id="studio" className="hero-wrap" />

<!-- Video personalizzato -->
<HeroStyHome videoSrc="/media/hero.mp4" showSlider={false} />

<!-- Solo immagine -->
<HeroStyHome videoSrc={false} imageSrc="/images/hero-static.jpg" showSlider={false} />
```

## Astro Transitions
- Il progetto usa `ClientRouter` di `astro:transitions`.
- È attivato nel layout comune: [src/layouts/Layout.astro](/Users/violaolagrafica/Documents/GitHub/Sbarabaus/src/layouts/Layout.astro).
- Quindi le pagine che passano dal layout navigano in client-side con view transitions abilitate.
- Gli script JS sono inizializzati su `astro:page-load` e fanno cleanup su `astro:before-swap`, così restano compatibili con la navigazione client-side.

## Script
- Globale: [src/scripts/menu.js](/Users/violaolagrafica/Documents/GitHub/Sbarabaus/src/scripts/menu.js)
  Gestisce menu overlay, stato header on-scroll, submenu mobile, hover bubble e link attivo nel menu.
- Homepage only: [src/scripts/main.js](/Users/violaolagrafica/Documents/GitHub/Sbarabaus/src/scripts/main.js)
  Gestisce reveal servizi, reveal portfolio, reveal titoli, typing text, chat slider hero e carousel originals.
- Studio only: [src/scripts/pages/studio.js](/Users/violaolagrafica/Documents/GitHub/Sbarabaus/src/scripts/pages/studio.js)
  Gestisce timeline della pagina Studio e slider immagini Panebarcos.
- Commercials only: [src/scripts/pages/commercials.js](/Users/violaolagrafica/Documents/GitHub/Sbarabaus/src/scripts/pages/commercials.js)
  Gestisce l’animazione/reveal dei blocchi `data-commercial-mode-heading`.

Regola pratica:
- Nel layout lasciare solo script veramente globali.
- Le feature specifiche di pagina vanno richiamate direttamente nella pagina relativa oppure in un file dedicato importato da quella pagina.
- Evitare file omnibus per script eterogenei di più pagine.
