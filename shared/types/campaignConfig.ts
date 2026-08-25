import { FestivalCampaign } from './types';

export const DEFAULT_FESTIVAL_CAMPAIGNS: FestivalCampaign[] = [
  {
    id: "camp-rakhi-2026",
    festivalName: "Rakhi",
    campaignName: "Rakhi Fits Edit",
    startDate: "2026-08-01T00:00:00+05:30",
    endDate: "2026-08-31T23:59:59+05:30",
    orderByDate: "2026-08-25T23:59:59+05:30",
    headline: "🎁 Rakhi Fits Edit — Match the Bond, Wear the Fit",
    subheadline: "Celebrate sibling affection with matching oversized t-shirts, custom hampers, and free silk rakhi threads.",
    ctaText: "SHOP RAKHI FITS",
    ctaUrl: "#/collections/rakhi-fits",
    bannerImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1400",
    mobileBannerImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    collection: "Rakhi Fits",
    campaignMessage: "Every Rakhi Fits order includes a complimentary silk Rakhi thread & custom gift note.",
    priority: 10,
    status: "active",
    seoTitle: "BLACKFAWN Rakhi Fits Edit | Sibling Apparel & Gifts",
    seoDescription: "Shop matching luxury oversized tees, sibling hampers, and custom engraved gifts for Rakhi 2026.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "camp-janmashtami-2026",
    festivalName: "Janmashtami",
    campaignName: "Janmashtami Celebration Drop",
    startDate: "2026-09-01T00:00:00+05:30",
    endDate: "2026-09-10T23:59:59+05:30",
    orderByDate: "2026-09-05T23:59:59+05:30",
    headline: "✨ Janmashtami Celebration Edit",
    subheadline: "Vibrant printed tees and bespoke brass hampers crafted for festive joy.",
    ctaText: "EXPLORE JANMASTHAMI DROPS",
    ctaUrl: "#/collections/trending",
    bannerImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1400",
    mobileBannerImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
    collection: "Trending",
    campaignMessage: "Complimentary air shipping on all festive drops over ₹999.",
    priority: 8,
    status: "scheduled",
    seoTitle: "BLACKFAWN Janmashtami Festive Edit 2026",
    seoDescription: "Artisanal printed tees and luxury gift sets for Janmashtami celebrations.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "camp-diwali-2026",
    festivalName: "Diwali",
    campaignName: "Diwali Royal Gift Edit",
    startDate: "2026-10-15T00:00:00+05:30",
    endDate: "2026-11-15T23:59:59+05:30",
    orderByDate: "2026-11-05T23:59:59+05:30",
    headline: "🪔 Diwali Royal Gift Edit — Celebrate in Luxury",
    subheadline: "Bespoke 14-piece velvet gift trunks, gold etched bottles, and heavyweight cotton essentials.",
    ctaText: "SHOP DIWALI EDIT",
    ctaUrl: "#/collections/festival-gifting",
    bannerImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1400",
    mobileBannerImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
    collection: "Festival Gifting",
    campaignMessage: "Pre-order luxury corporate & personal gift hampers for Diwali.",
    priority: 15,
    status: "scheduled",
    seoTitle: "BLACKFAWN Diwali Luxury Hampers & Gift Edit 2026",
    seoDescription: "Bespoke velvet hampers and customized luxury gifts for Diwali 2026.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Calculates effective status of a campaign based on IST time
 */
export function getEffectiveCampaignStatus(campaign: FestivalCampaign, now = new Date()): 'draft' | 'scheduled' | 'active' | 'expired' | 'disabled' {
  if (campaign.status === 'draft' || campaign.status === 'disabled') {
    return campaign.status;
  }
  const start = new Date(campaign.startDate).getTime();
  const end = new Date(campaign.endDate).getTime();
  const current = now.getTime();

  if (current < start) return 'scheduled';
  if (current > end) return 'expired';
  return 'active';
}

/**
 * Resolves the single highest-priority ACTIVE campaign or nearest UPCOMING campaign.
 * Uses Indian Standard Time (Asia/Kolkata).
 */
export function resolveActiveFestivalCampaign(campaigns: FestivalCampaign[], now = new Date()): FestivalCampaign | null {
  if (!campaigns || campaigns.length === 0) return null;

  const currentMs = now.getTime();

  // 1. Filter currently ACTIVE campaigns (between start and end dates & status not draft/disabled)
  const activeCampaigns = campaigns.filter((c) => {
    if (c.status === 'disabled' || c.status === 'draft') return false;
    const startMs = new Date(c.startDate).getTime();
    const endMs = new Date(c.endDate).getTime();
    return currentMs >= startMs && currentMs <= endMs;
  });

  if (activeCampaigns.length > 0) {
    // Sort by priority (descending) -> highest priority wins
    activeCampaigns.sort((a, b) => b.priority - a.priority);
    return activeCampaigns[0];
  }

  // 2. If no active campaign, find nearest UPCOMING campaign
  const upcomingCampaigns = campaigns.filter((c) => {
    if (c.status === 'disabled' || c.status === 'draft') return false;
    const startMs = new Date(c.startDate).getTime();
    return startMs > currentMs;
  });

  if (upcomingCampaigns.length > 0) {
    // Sort by earliest start date ascending
    upcomingCampaigns.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return upcomingCampaigns[0];
  }

  return null;
}
