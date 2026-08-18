import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Sparkles, ArrowRight, ShieldCheck, Truck, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FestivalCampaign } from '../../shared/types';
import { resolveActiveFestivalCampaign, getEffectiveCampaignStatus } from '../../shared/campaignConfig';

interface FestivalCampaignBannerProps {
  campaigns?: FestivalCampaign[];
  onCtaClick?: (ctaUrl: string) => void;
}

export default function FestivalCampaignBanner({ campaigns = [], onCtaClick }: FestivalCampaignBannerProps) {
  // Resolve active/upcoming campaign dynamically
  const activeCampaign = useMemo(() => {
    return resolveActiveFestivalCampaign(campaigns);
  }, [campaigns]);

  // Real-time IST countdown calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });

  useEffect(() => {
    if (!activeCampaign) return;

    const targetDate = new Date(activeCampaign.endDate).getTime();

    const updateCountdown = () => {
      // Calculate current IST timestamp
      const nowMs = Date.now();
      const diffMs = targetDate - nowMs;

      if (diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeCampaign]);

  // If no campaign or expired, do not render banner (or render standard hero fallback)
  if (!activeCampaign || timeLeft.isExpired) {
    return null;
  }

  // Format Order-By Date for Display e.g. "Aug 25"
  const formattedOrderBy = activeCampaign.orderByDate
    ? new Date(activeCampaign.orderByDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' })
    : null;

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick(activeCampaign.ctaUrl);
    } else {
      window.location.hash = activeCampaign.ctaUrl;
    }
  };

  return (
    <div id="festival-campaign-banner" className="w-full bg-[#0B0B0B] text-white border-y border-[#C9A227]/30 relative overflow-hidden my-6">
      
      {/* Background Banner Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-25 overflow-hidden">
        <img
          src={activeCampaign.bannerImage}
          alt={activeCampaign.campaignName}
          className="w-full h-full object-cover hidden sm:block scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <img
          src={activeCampaign.mobileBannerImage || activeCampaign.bannerImage}
          alt={activeCampaign.campaignName}
          className="w-full h-full object-cover sm:hidden"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/85 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Festival Badge, Headline & Subheadline */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A227]/15 border border-[#C9A227]/40 rounded-full">
              <Sparkles size={13} className="text-[#C9A227] animate-pulse" />
              <span className="text-[10px] font-serif font-bold tracking-widest text-[#C9A227] uppercase">
                {activeCampaign.festivalName} FESTIVAL EDITION
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide uppercase leading-tight">
              {activeCampaign.headline}
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-xl leading-relaxed">
              {activeCampaign.subheadline}
            </p>

            {/* Special Campaign Message */}
            {activeCampaign.campaignMessage && (
              <div className="inline-flex items-center gap-2 text-[11px] font-medium text-[#C9A227] bg-[#161616] px-3 py-1.5 rounded-lg border border-slate-800">
                <Gift size={13} />
                <span>{activeCampaign.campaignMessage}</span>
              </div>
            )}
          </div>

          {/* Right Column: Real-Time IST Countdown & Order-By Callout */}
          <div className="lg:col-span-5 bg-[#141414]/90 border border-[#C9A227]/30 p-5 sm:p-6 rounded-2xl shadow-2xl space-y-5 text-center">
            
            <div className="space-y-1">
              <span className="text-[10px] font-serif font-bold text-gray-400 tracking-widest uppercase flex items-center justify-center gap-1.5">
                <Clock size={12} className="text-[#C9A227]" /> COUNTDOWN TO {activeCampaign.festivalName.toUpperCase()}
              </span>
              <p className="text-xs font-semibold text-[#C9A227]">Indian Standard Time (IST)</p>
            </div>

            {/* Digital Countdown Timer Boxes */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#0B0B0B] border border-slate-800 p-2.5 rounded-xl">
                <span className="text-xl sm:text-2xl font-serif font-extrabold text-white block">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">DAYS</span>
              </div>
              <div className="bg-[#0B0B0B] border border-slate-800 p-2.5 rounded-xl">
                <span className="text-xl sm:text-2xl font-serif font-extrabold text-white block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">HOURS</span>
              </div>
              <div className="bg-[#0B0B0B] border border-slate-800 p-2.5 rounded-xl">
                <span className="text-xl sm:text-2xl font-serif font-extrabold text-[#C9A227] block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">MINS</span>
              </div>
              <div className="bg-[#0B0B0B] border border-slate-800 p-2.5 rounded-xl">
                <span className="text-xl sm:text-2xl font-serif font-extrabold text-[#C9A227] block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">SECS</span>
              </div>
            </div>

            {/* Order-By Delivery Deadline Callout */}
            {formattedOrderBy && (
              <div className="text-[11px] font-bold text-gray-300 bg-[#0B0B0B] py-2 px-3 rounded-lg border border-slate-800 flex items-center justify-center gap-2">
                <Truck size={14} className="text-[#C9A227]" />
                <span>Order by <span className="text-[#C9A227]">{formattedOrderBy}</span> for guaranteed festival delivery</span>
              </div>
            )}

            {/* Main CTA Button */}
            <button
              onClick={handleCta}
              className="w-full py-3.5 bg-[#C9A227] text-black hover:bg-yellow-500 font-bold text-xs uppercase tracking-widest border border-[#C9A227] rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>{activeCampaign.ctaText}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}
