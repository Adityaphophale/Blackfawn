import React, { useState, useEffect } from 'react';
import { Star, Trash2, ShieldCheck } from 'lucide-react';
import { Review } from '../../shared/types';

interface ReviewsPageProps {
  onDeleteReview: (id: string) => Promise<any>;
}

export default function ReviewsPage({ onDeleteReview }: ReviewsPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = () => {
    fetch('/api/admin/reviews', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to moderate/delete this review?')) return;
    const res = await onDeleteReview(id);
    if (res.success) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">User Feedback & Moderation</span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Review Reports</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-slate-950/20">
                <th className="py-3 px-4">Reviewer Details</th>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Feedback Date</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-950/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{rev.userName}</p>
                    <p className="text-[10px] text-gray-500 font-semibold">{rev.userEmail || 'guest@blackfawn.in'}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#f97316] uppercase font-mono">{rev.productId}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-850'}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="text-slate-200 line-clamp-2">{rev.comment}</p>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[8.5px] bg-emerald-950 text-emerald-400 border border-emerald-900/30 px-1.5 py-0.2 rounded font-bold uppercase mt-1">
                        <ShieldCheck size={9} /> Verified buyer
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500">{rev.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 rounded cursor-pointer ml-auto block"
                      title="Moderate Review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
