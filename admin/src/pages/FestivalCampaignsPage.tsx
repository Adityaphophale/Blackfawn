import React, { useState } from 'react';
import { FestivalCampaign } from '../../../shared/types/types.ts';
import { getEffectiveCampaignStatus } from '../../../shared/types/campaignConfig';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Save, 
  Calendar, 
  Clock, 
  Check, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Tag,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';

interface FestivalCampaignsPageProps {
  campaigns: FestivalCampaign[];
  onSaveCampaigns: (campaigns: FestivalCampaign[]) => Promise<any>;
}

const PRESET_FESTIVALS = [
  'Rakhi',
  'Janmashtami',
  'Ganesh Chaturthi',
  'Navratri',
  'Dussehra',
  'Diwali',
  'Christmas',
  'New Year',
  'Valentine\'s Day',
  'Holi',
  'Eid',
  'Independence Day',
  'Republic Day',
  'Mother\'s Day',
  'Father\'s Day'
];

export default function FestivalCampaignsPage({ campaigns, onSaveCampaigns }: FestivalCampaignsPageProps) {
  const [campaignList, setCampaignList] = useState<FestivalCampaign[]>(campaigns || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState<string>(campaigns?.[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State for editing
  const selectedCampaign = campaignList.find((c) => c.id === selectedId) || campaignList[0];

  const handleSaveAll = async (updatedList = campaignList) => {
    setSaving(true);
    setMessage('');
    try {
      await onSaveCampaigns(updatedList);
      setMessage('Festival campaigns saved successfully!');
    } catch (err) {
      setMessage('Failed to save festival campaigns.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = campaignList.map((c) => {
      if (c.id === id) {
        const nextStatus = c.status === 'disabled' ? 'active' : 'disabled';
        return { ...c, status: nextStatus as any, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setCampaignList(updated);
    handleSaveAll(updated);
  };

  const handleDuplicate = (c: FestivalCampaign) => {
    const dupe: FestivalCampaign = {
      ...c,
      id: `camp-${Math.random().toString(36).substring(2, 9)}`,
      campaignName: `${c.campaignName} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [dupe, ...campaignList];
    setCampaignList(updated);
    setSelectedId(dupe.id);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this festival campaign?')) return;
    const updated = campaignList.filter((c) => c.id !== id);
    setCampaignList(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id || '');
    }
    handleSaveAll(updated);
  };

  const handleCreateNew = () => {
    const newCamp: FestivalCampaign = {
      id: `camp-${Math.random().toString(36).substring(2, 9)}`,
      festivalName: 'Rakhi',
      campaignName: 'New Festive Edit 2026',
      startDate: new Date().toISOString().substring(0, 16),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16),
      orderByDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      headline: '🎁 Celebrate in BLACKFAWN Luxury',
      subheadline: 'Exclusive handcrafted drops and bespoke gift hampers.',
      ctaText: 'SHOP FESTIVE EDIT',
      ctaUrl: '#/collections/festival-gifting',
      bannerImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1400',
      mobileBannerImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
      collection: 'Festival Gifting',
      campaignMessage: 'Includes complimentary silk Rakhi thread & custom gift note.',
      priority: 10,
      status: 'active',
      seoTitle: 'BLACKFAWN Festive Celebration 2026',
      seoDescription: 'Bespoke apparel and luxury hampers for festive celebrations.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newCamp, ...campaignList];
    setCampaignList(updated);
    setSelectedId(newCamp.id);
  };

  const handleFieldChange = (field: keyof FestivalCampaign, value: any) => {
    if (!selectedCampaign) return;
    const updated = campaignList.map((c) => (c.id === selectedCampaign.id ? { ...c, [field]: value, updatedAt: new Date().toISOString() } : c));
    setCampaignList(updated);
  };

  return (
    <div className="space-y-6 text-white max-w-6xl">
      
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#C9A227] tracking-wider uppercase flex items-center gap-1">
            <Sparkles size={12} /> Marketing Automation & Campaign Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">
            Festival Campaigns & IST Countdown
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <Plus size={14} className="text-[#C9A227]" /> New Campaign
          </button>
          <button
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="px-5 py-2 bg-[#C9A227] hover:bg-yellow-600 text-black text-xs font-bold uppercase rounded-lg flex items-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <Save size={15} /> {saving ? 'Saving Engine...' : 'Save Campaigns'}
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-2">
          <Check size={14} /> {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Campaigns List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase text-[#C9A227] tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
            <span>Configured Festival Campaigns</span>
            <span className="text-[10px] font-mono text-gray-400">{campaignList.length} Total</span>
          </h2>

          <div className="space-y-2.5">
            {campaignList.map((c) => {
              const effStatus = getEffectiveCampaignStatus(c);
              const isSelected = selectedId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-[#C9A227] shadow-md'
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30 uppercase">
                      {c.festivalName}
                    </span>

                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded uppercase ${
                        effStatus === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : effStatus === 'scheduled'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : effStatus === 'expired'
                          ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                          : 'bg-slate-800 text-gray-400'
                      }`}
                    >
                      {effStatus}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-white truncate">{c.campaignName}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{c.headline}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-slate-800/80">
                    <span className="font-mono">Priority: {c.priority}</span>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleStatus(c.id)}
                        className="p-1 hover:text-white cursor-pointer"
                        title={c.status === 'disabled' ? 'Enable' : 'Disable'}
                      >
                        {c.status === 'disabled' ? <EyeOff size={12} className="text-red-400" /> : <Eye size={12} className="text-emerald-400" />}
                      </button>
                      <button onClick={() => handleDuplicate(c)} className="p-1 hover:text-white cursor-pointer" title="Duplicate">
                        <Copy size={12} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1 text-red-400 hover:text-red-300 cursor-pointer" title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Campaign Inspector & Form Editor */}
        {selectedCampaign && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Campaign Status Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase text-white tracking-wider">
                  Campaign Inspector: <span className="text-[#C9A227]">{selectedCampaign.campaignName}</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">ID: #{selectedCampaign.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Effective Status</span>
                  <span className="text-sm font-extrabold text-[#C9A227] uppercase mt-0.5 block">
                    {getEffectiveCampaignStatus(selectedCampaign)}
                  </span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Engine Priority</span>
                  <span className="text-sm font-extrabold text-white uppercase mt-0.5 block">
                    Level {selectedCampaign.priority}
                  </span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Linked Collection</span>
                  <span className="text-xs font-bold text-emerald-400 truncate mt-0.5 block">
                    {selectedCampaign.collection}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Form Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-white tracking-wider border-b border-slate-800 pb-2">
                Campaign Information & Scheduling
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Festival Target</label>
                  <select
                    value={selectedCampaign.festivalName}
                    onChange={(e) => handleFieldChange('festivalName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  >
                    {PRESET_FESTIVALS.map((fest) => (
                      <option key={fest} value={fest}>{fest}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Campaign Title</label>
                  <input
                    type="text"
                    value={selectedCampaign.campaignName}
                    onChange={(e) => handleFieldChange('campaignName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Start Date (IST)</label>
                  <input
                    type="datetime-local"
                    value={selectedCampaign.startDate ? new Date(selectedCampaign.startDate).toISOString().substring(0, 16) : ''}
                    onChange={(e) => handleFieldChange('startDate', new Date(e.target.value).toISOString())}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">End Date (IST)</label>
                  <input
                    type="datetime-local"
                    value={selectedCampaign.endDate ? new Date(selectedCampaign.endDate).toISOString().substring(0, 16) : ''}
                    onChange={(e) => handleFieldChange('endDate', new Date(e.target.value).toISOString())}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Order-By Delivery Date</label>
                  <input
                    type="date"
                    value={selectedCampaign.orderByDate ? new Date(selectedCampaign.orderByDate).toISOString().substring(0, 10) : ''}
                    onChange={(e) => handleFieldChange('orderByDate', new Date(e.target.value).toISOString())}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Engine Priority (Higher Overlaps)</label>
                  <input
                    type="number"
                    value={selectedCampaign.priority}
                    onChange={(e) => handleFieldChange('priority', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Copy & Banners */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Homepage Headline</label>
                  <input
                    type="text"
                    value={selectedCampaign.headline}
                    onChange={(e) => handleFieldChange('headline', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Homepage Subheadline</label>
                  <textarea
                    rows={2}
                    value={selectedCampaign.subheadline}
                    onChange={(e) => handleFieldChange('subheadline', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">CTA Button Label</label>
                    <input
                      type="text"
                      value={selectedCampaign.ctaText}
                      onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">CTA Target URL</label>
                    <input
                      type="text"
                      value={selectedCampaign.ctaUrl}
                      onChange={(e) => handleFieldChange('ctaUrl', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Desktop Banner Image URL</label>
                    <input
                      type="text"
                      value={selectedCampaign.bannerImage}
                      onChange={(e) => handleFieldChange('bannerImage', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Mobile Banner Image URL</label>
                    <input
                      type="text"
                      value={selectedCampaign.mobileBannerImage || ''}
                      onChange={(e) => handleFieldChange('mobileBannerImage', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Special Campaign Offer Message</label>
                  <input
                    type="text"
                    value={selectedCampaign.campaignMessage || ''}
                    onChange={(e) => handleFieldChange('campaignMessage', e.target.value)}
                    placeholder="e.g. Free silk Rakhi thread with every order"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
