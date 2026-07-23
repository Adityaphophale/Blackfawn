import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, RefreshCw } from 'lucide-react';
import { ReturnRequest } from '../../shared/types';

export default function ReturnRequestsPage() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);

  const fetchRequests = () => {
    fetch('/api/admin/returns', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'resolved') => {
    try {
      const res = await fetch(`/api/admin/returns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Return status set to ${newStatus}.`);
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Reverse logistics & refunds</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Return Requests</h1>
        </div>
        <button
          onClick={fetchRequests}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-slate-950/20">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Return Item & Reason</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Request Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{req.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{req.orderId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-300">{req.customerName}</td>
                  <td className="py-3.5 px-4">
                    {req.items.map((item, idx) => (
                      <div key={idx}>
                        <p className="font-bold text-orange-500 font-mono text-[10.5px]">SKU: {item.sku} (Qty: {item.qty})</p>
                        <p className="text-gray-400 italic text-[10px] mt-0.5">"Reason: {item.reason}"</p>
                      </div>
                    ))}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px] font-bold">
                    <span className={`px-2 py-0.5 rounded ${req.type === 'return' ? 'bg-red-950 text-red-400' : 'bg-blue-950 text-blue-400'}`}>
                      {req.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      req.status === 'resolved' ? 'bg-emerald-950 text-emerald-400' : req.status === 'approved' ? 'bg-blue-950 text-blue-400' : 'bg-orange-950 text-orange-400'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'approved')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'rejected')}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status === 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'resolved')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold cursor-pointer"
                      >
                        Resolve / Close
                      </button>
                    )}
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
