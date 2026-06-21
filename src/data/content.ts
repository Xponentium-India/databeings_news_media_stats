/** Centralized copy + imagery so the redesign mirrors the original site content. */

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1920&q=80",
  about: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  project: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
  servicesHero: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80",
  contactHero: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1920&q=80",
} as const;

export interface ServiceColumn {
  title: string;
  points: string[];
}

/** "Hire Us For" (home) / "How can we help you?" (services). */
export const SERVICE_COLUMNS: ServiceColumn[] = [
  {
    title: "Social Media Insights",
    points: [
      "Insights for YouTube publishers on views, market share & popular topics",
      "Twitter, Facebook, Instagram trend analytics for publishers and B2C brands",
      "Digital advertising spend effectiveness for B2C brands — leading influencers, user demographics by social media platforms",
    ],
  },
  {
    title: "Data Analytics & Reporting",
    points: [
      "Customer & marketing analytics to improve lead conversion efficiency",
      "Service analytics — text analytics on customer queries to identify gaps",
      "Reporting automation — existing reports & automated reports on social media with periodic insights on trends",
    ],
  },
  {
    title: "Market & Competitive Research",
    points: [
      "Market sizing & competitive benchmarking",
      "Digital assets & other customer touchpoint assessment",
    ],
  },
];

export interface ChannelStat {
  channel: string;
  subscribers: number;
  views: number;
  share: string;
}

export const NEWS_STATS_TITLE = "English News YouTube Monthly Stats — September, 2024";

export const NEWS_STATS: ChannelStat[] = [
  { channel: "Firstpost", subscribers: 5.8, views: 91.0, share: "18%" },
  { channel: "CNN-News18", subscribers: 8.3, views: 73.8, share: "14%" },
  { channel: "NDTV 24x7", subscribers: 14.0, views: 66.2, share: "13%" },
  { channel: "ANI news", subscribers: 6.9, views: 60.2, share: "12%" },
  { channel: "WION", subscribers: 9.2, views: 52.2, share: "10%" },
  { channel: "Times Now", subscribers: 5.7, views: 49.1, share: "10%" },
  { channel: "India Today", subscribers: 9.7, views: 42.1, share: "8%" },
  { channel: "Crux", subscribers: 2.7, views: 21.3, share: "4%" },
  { channel: "Mirror Now", subscribers: 1.2, views: 21.1, share: "4%" },
  { channel: "Republic TV", subscribers: 6.3, views: 19.9, share: "4%" },
  { channel: "NewsX", subscribers: 1.1, views: 7.3, share: "1%" },
  { channel: "The Wire", subscribers: 5.5, views: 5.0, share: "1%" },
];

export const NEWS_STATS_TOTAL = { subscribers: 76.4, views: 509.2, share: "100%" };
