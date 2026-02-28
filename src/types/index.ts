// ==================== PAGE TYPES ====================

export interface Page {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

// ==================== PROJECT TYPES ====================

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  location: string;
  date?: string;
  heroImage: string;
  heroVideo?: string;
  images: string[];
  description: string;
  fullDescription?: string;
  sections: Section[];
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SECTION TYPES ====================

export type SectionType = 
  | 'hero'
  | 'hero-video'
  | 'pinned'
  | 'zoom-gallery'
  | 'snap-slider'
  | 'text-block'
  | 'parallax-image'
  | 'panels'
  | 'pinned-gallery'
  | 'contact-info'
  | 'footer-info';

export interface BaseSection {
  id: string;
  type: SectionType;
  order: number;
  backgroundColor?: string;
  darkSection?: boolean;
  paddingTop?: boolean;
  paddingBottom?: boolean;
}

export interface HeroSection extends BaseSection {
  type: 'hero';
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  infoTextBefore?: string;
  infoTextAfter?: string;
}

export interface HeroVideoSection extends BaseSection {
  type: 'hero-video';
  title: string;
  videoUrl: string;
  infoTextBefore?: string;
  infoTextAfter?: string;
}

export interface PinnedSection extends BaseSection {
  type: 'pinned';
  title: string;
  paragraphs: string[];
  image: string;
  imagePosition: 'left' | 'right';
}

export interface ZoomGallerySection extends BaseSection {
  type: 'zoom-gallery';
  images: string[];
  heightRatio?: number;
}

export interface SnapSliderSection extends BaseSection {
  type: 'snap-slider';
  slides: {
    image: string;
    title: string;
    subtitle: string;
    link?: string;
  }[];
}

export interface TextBlockSection extends BaseSection {
  type: 'text-block';
  title?: string;
  content: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ParallaxImageSection extends BaseSection {
  type: 'parallax-image';
  image: string;
  title?: string;
  subtitle?: string;
}

export interface PanelsSection extends BaseSection {
  type: 'panels';
  images: string[];
  widthRatio?: number;
}

export interface PinnedGallerySection extends BaseSection {
  type: 'pinned-gallery';
  title?: string;
  description?: string;
  images: string[];
}

export interface ContactInfoSection extends BaseSection {
  type: 'contact-info';
  address: {
    street: string;
    city: string;
  };
  phone: string;
  email: string;
  companyName: string;
}

export interface FooterInfoSection extends BaseSection {
  type: 'footer-info';
  socialLinks: {
    platform: string;
    url: string;
    label: string;
  }[];
  copyright: string;
}

export type Section = 
  | HeroSection
  | HeroVideoSection
  | PinnedSection
  | ZoomGallerySection
  | SnapSliderSection
  | TextBlockSection
  | ParallaxImageSection
  | PanelsSection
  | PinnedGallerySection
  | ContactInfoSection
  | FooterInfoSection;

// ==================== SITE SETTINGS ====================

export interface SiteSettings {
  id: string;
  siteName: string;
  logo: string;
  logoWhite: string;
  primaryColor: string;
  navigation: {
    label: string;
    href: string;
  }[];
  footer: {
    address: {
      street: string;
      city: string;
    };
    phone: string;
    email: string;
    socialLinks: {
      platform: string;
      url: string;
      label: string;
    }[];
  };
  updatedAt: Date;
}

// ==================== MEDIA TYPES ====================

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  path: string;
  type: 'image' | 'video';
  size: number;
  createdAt: Date;
}
