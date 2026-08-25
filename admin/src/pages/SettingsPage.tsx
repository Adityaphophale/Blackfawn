import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, MapPin, Mail, Phone, Building, Sparkles } from 'lucide-react';
import { BusinessInfo, DEFAULT_BUSINESS_INFO } from '../../../shared/types/businessConfig';

interface SettingsPageProps {
  businessInfo?: BusinessInfo;
  onUpdateBusinessInfo?: (info: Partial<BusinessInfo>) => Promise<any>;
}

export default function SettingsPage({
  businessInfo,
  onUpdateBusinessInfo,
}: SettingsPageProps) {
  const [name, setName] = useState(businessInfo?.name || DEFAULT_BUSINESS_INFO.name);
  const [addressLine1, setAddressLine1] = useState(businessInfo?.addressLine1 || DEFAULT_BUSINESS_INFO.addressLine1);
  const [addressLine2, setAddressLine2] = useState(businessInfo?.addressLine2 || DEFAULT_BUSINESS_INFO.addressLine2);
  const [addressLine3, setAddressLine3] = useState(businessInfo?.addressLine3 || DEFAULT_BUSINESS_INFO.addressLine3);
  const [cityState, setCityState] = useState(businessInfo?.cityState || DEFAULT_BUSINESS_INFO.cityState);
  const [email, setEmail] = useState(businessInfo?.email || DEFAULT_BUSINESS_INFO.email);
  const [phone, setPhone] = useState(businessInfo?.phone || DEFAULT_BUSINESS_INFO.phone);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (businessInfo) {
      setName(businessInfo.name || DEFAULT_BUSINESS_INFO.name);
      setAddressLine1(businessInfo.addressLine1 || DEFAULT_BUSINESS_INFO.addressLine1);
      setAddressLine2(businessInfo.addressLine2 || DEFAULT_BUSINESS_INFO.addressLine2);
      setAddressLine3(businessInfo.addressLine3 || DEFAULT_BUSINESS_INFO.addressLine3);
      setCityState(businessInfo.cityState || DEFAULT_BUSINESS_INFO.cityState);
      setEmail(businessInfo.email || DEFAULT_BUSINESS_INFO.email);
      setPhone(businessInfo.phone || DEFAULT_BUSINESS_INFO.phone);
    }
  }, [businessInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      if (onUpdateBusinessInfo) {
        await onUpdateBusinessInfo({
          name,
          addressLine1,
          addressLine2,
          addressLine3,
          cityState,
          email,
          phone,
        });
      } else {
        await fetch('/api/admin/business-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('blackfawn_admin_token') || ''}`,
          },
          body: JSON.stringify({ name, addressLine1, addressLine2, addressLine3, cityState, email, phone }),
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to update business information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white max-w-4xl">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#C9A227] tracking-widest uppercase flex items-center gap-1.5">
            <Building size={13} /> Enterprise Brand Settings
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">
            Business Information
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-[#C9A227]" /> Centralized Contact Blueprint
          </h2>
          <p className="text-[11px] text-gray-400 mt-1">
            Updating these parameters synchronizes official contact information across the customer Footer, Header, Concierge, Checkout & Confirmation screens.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-lg flex items-center gap-2 text-xs font-bold">
            <CheckCircle size={15} /> Business Information updated successfully across central store configuration.
          </div>
        )}

        {/* Business Name */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Name</label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 text-gray-500" size={14} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
            />
          </div>
        </div>

        {/* Address Lines */}
        <div className="space-y-3 p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
          <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin size={13} /> Official Registered Address
          </label>

          <div className="space-y-2">
            <div>
              <label className="block text-[9.5px] text-gray-400 uppercase mb-1">Address Line 1</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="block text-[9.5px] text-gray-400 uppercase mb-1">Address Line 2</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="block text-[9.5px] text-gray-400 uppercase mb-1">Address Line 3</label>
              <input
                type="text"
                value={addressLine3}
                onChange={(e) => setAddressLine3(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="block text-[9.5px] text-gray-400 uppercase mb-1">City & State</label>
              <input
                type="text"
                required
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-500" size={14} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#C9A227] font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Support Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-500" size={14} />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#C9A227] font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#C9A227] hover:bg-yellow-600 text-black text-xs font-bold uppercase rounded-lg flex items-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <Save size={14} /> {loading ? 'Saving...' : 'Save Business Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
