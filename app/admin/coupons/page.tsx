"use client";

import { useEffect, useState } from 'react';
import GlassCard from '@/components/admin/GlassCard';
import Badge from '@/components/admin/Badge';

type Coupon = {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  amount: number;
  isActive: boolean;
  usedCount?: number;
};

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    amount: 10,
    isActive: true,
  });

  const loadCoupons = () => {
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => setCoupons(data.data || []));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormData({ code: '', discountType: 'percentage', amount: 10, isActive: true });
      loadCoupons();
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    await fetch(`/api/coupons/${coupon._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    loadCoupons();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Discounts</p>
        <h1 className="text-4xl font-serif gold-text">Coupon Management</h1>
      </div>

      <GlassCard className="p-6 space-y-4 max-w-3xl">
        <h2 className="text-xl font-serif">Create New Coupon</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Code (ELITE20)"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm uppercase"
            required
          />
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
            className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed (EUR)</option>
          </select>
          <input
            type="number"
            min={0}
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm"
            required
          />
          <button type="submit" className="gold-gradient text-black font-bold rounded-xl text-sm uppercase tracking-widest">
            Add Coupon
          </button>
        </form>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50 uppercase tracking-widest text-xs">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Used</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-t border-white/5">
                <td className="p-4 font-semibold tracking-wider">{coupon.code}</td>
                <td className="p-4 text-white/60">{coupon.discountType === 'percentage' ? '%' : 'Fixed'}</td>
                <td className="p-4 text-white/60">
                  {coupon.discountType === 'percentage' ? `${coupon.amount}%` : `EUR ${coupon.amount}`}
                </td>
                <td className="p-4">
                  <button onClick={() => toggleStatus(coupon)}>
                    <Badge label={coupon.isActive ? 'active' : 'inactive'} variant={coupon.isActive ? 'success' : 'danger'} />
                  </button>
                </td>
                <td className="p-4 text-white/60">{coupon.usedCount || 0}</td>
              </tr>
            ))}
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/50">
                  No coupons yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
