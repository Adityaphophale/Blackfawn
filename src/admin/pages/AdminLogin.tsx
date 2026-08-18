import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { BRAND_LOGO } from '../../shared/businessConfig';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@abc.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await onLogin(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials or unauthorized role.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col justify-center items-center px-4 font-sans text-white">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img 
              src={BRAND_LOGO} 
              alt="BLACKFAWN" 
              className="h-16 w-auto object-contain bg-white p-1 rounded-sm shadow-lg" 
            />
          </div>
          <p className="text-[10px] text-[#C9A227] font-semibold uppercase tracking-widest pt-2">Enterprise Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Administrative Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-[#C9A227]" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@blackfawn.in"
                className="w-full bg-[#0B0B0B] border border-[#2A2A2A] pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#C9A227] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Password Credentials</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-[#C9A227]" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0B0B] border border-[#2A2A2A] pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#C9A227] outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-900 text-red-400 p-3 text-[11px] font-semibold flex items-center gap-2">
              <ShieldAlert size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#C9A227] text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-lg transition-all ${
              loading ? 'opacity-50' : ''
            }`}
          >
            {loading ? 'AUTHENTICATING ATELIER PORTAL...' : 'ACCESS ATELIER CONTROL'}
          </button>
        </form>
      </div>
    </div>
  );
}

