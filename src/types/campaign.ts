export interface SubjectLineVariant {
  subject: string;
  previewText: string;
  openRateEstimate: number; // e.g. 72%
  style: string; // e.g. "Urgency & FOMO", "Curiosity Loop", "Benefit-Driven"
  spamRisk: 'Very Low' | 'Low' | 'Medium' | 'High';
}

export interface VisualBannerConfig {
  title: string;
  subtitle: string;
  badgeText: string;
  visualType: 'hero-gradient' | 'product-spotlight' | 'voucher-sale' | 'announcement-badge';
  accentColor: string;
  secondaryColor: string;
  svgMarkup?: string;
  imageUrl?: string;
}

export interface EmailMessage {
  id: string;
  stepName: string;
  recommendedSendDelay: string;
  subjectLineVariants: SubjectLineVariant[];
  selectedSubjectIndex: number;
  headline: string;
  subheadline: string;
  bodyHtml: string;
  bodyPlaintext: string;
  bodyMarkdown: string;
  cta: {
    text: string;
    url: string;
  };
  visualBanner: VisualBannerConfig;
  keyTakeaways: string[];
}

export interface CampaignData {
  id: string;
  createdAt: string;
  prompt: string;
  campaignTitle: string;
  campaignType: 'single' | 'welcome-sequence' | 'product-launch' | 'cart-abandonment' | 'black-friday' | 'newsletter';
  audience: string;
  goal: string;
  tone: string;
  brandName: string;
  brandColor: string;
  ctaText: string;
  ctaUrl: string;
  senderName: string;
  senderEmail: string;
  companyAddress: string;
  summary: string;
  strategyNotes: string;
  emails: EmailMessage[];
}

export interface CampaignPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  campaignType: CampaignData['campaignType'];
  audience: string;
  goal: string;
  tone: string;
  brandName: string;
  brandColor: string;
  ctaText: string;
  ctaUrl: string;
  senderName: string;
}
