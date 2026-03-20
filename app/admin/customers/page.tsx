"use client";

import { useEffect, useState } from 'react';
import GlassCard from '@/components/admin/GlassCard';
import Badge from '@/components/admin/Badge';

type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  role: string;
  createdAt: string;
  bookings?: number;
};

export default function CustomersAdmin() {
  const [users, setUsers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('/api/users?includeBookings=true')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Customers</p>
        <h1 className="text-4xl font-serif gold-text">Customer Management</h1>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50 uppercase tracking-widest text-xs">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Bookings</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-white/5">
                <td className="p-4 font-semibold">{user.firstName} {user.lastName}</td>
                <td className="p-4 text-white/60">{user.email}</td>
                <td className="p-4 text-white/60">{user.phone || '-'}</td>
                <td className="p-4 text-white/60 capitalize">{user.gender || '-'}</td>
                <td className="p-4 text-white/60">{user.bookings || 0}</td>
                <td className="p-4">
                  <Badge label={user.role} variant={user.role === 'admin' ? 'info' : 'neutral'} />
                </td>
                <td className="p-4 text-white/50 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-white/50">
                  No customers yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
