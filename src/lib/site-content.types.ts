export interface ContentButton {
  label: string;
  href: string;
  title?: string;
  targetBlank?: boolean;
}

export interface SeoContent {
  title: string;
  description: string;
}

export interface PageHeaderContent {
  bgWord: string;
  title: string;
  subtitle: string;
  backgroundVideoSrc: string;
  sideImageSrc: string;
  sideImageAlt: string;
  showSideImage: boolean;
}

export interface StudioIntroContent {
  title: string;
  content: string;
  mediaSrc: string;
  mediaAlt: string;
}

export interface PanebarcosMemberContent {
  name: string;
  role: string;
  roleTana: string;
  intro: string;
  linkedin: string;
  imageSrc: string;
  imageAlt: string;
}

export interface PanebarcosSectionContent {
  title: string;
  subtitle: string;
  content: string;
  members: PanebarcosMemberContent[];
}

export interface ContactBannerContent {
  kicker: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  background: string;
  button: ContentButton;
}

export interface PanebarcosPageContent {
  header: PageHeaderContent;
  intro: StudioIntroContent;
  sections: PanebarcosSectionContent[];
  cta: ContactBannerContent | null;
  seo: SeoContent;
}

export interface OscarsBeliefItemContent {
  title: string;
  subtitle: string;
  theme: string;
  bgColor: string;
}

export interface OscarsBeliefsContent {
  title: string;
  imageSrc: string;
  imageAlt: string;
  items: OscarsBeliefItemContent[];
}

export interface OscarsDreamContent {
  title: string;
  content: string;
  imageSrc: string;
  imageAlt: string;
}

export interface OscarsWorkflowItemContent {
  kicker: string;
  title: string;
  content: string;
}

export interface OscarsWorkflowContent {
  title: string;
  subtitle: string;
  items: OscarsWorkflowItemContent[];
}

export interface OscarsPageContent {
  header: PageHeaderContent;
  beliefs: OscarsBeliefsContent;
  dream: OscarsDreamContent;
  workflow: OscarsWorkflowContent;
  cta: ContactBannerContent | null;
  seo: SeoContent;
}

export interface StoryTimelineCardContent {
  title: string;
  content: string;
  imageSrc: string;
  imageAlt: string;
}

export interface StoryTimelineContent {
  title: string;
  content: string;
  cards: StoryTimelineCardContent[];
}

export interface StoryMediaVideoContent {
  title: string;
  embedSrc: string;
}

export interface StoryMediaGalleryContent {
  title: string;
  content: string;
  videos: StoryMediaVideoContent[];
}

export interface StoryMutantPageContent {
  header: PageHeaderContent;
  intro: StudioIntroContent;
  timeline: StoryTimelineContent;
  mediaGallery: StoryMediaGalleryContent;
  cta: ContactBannerContent | null;
  seo: SeoContent;
}
