"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";

const ROLE_BADGE = {
  BUYER: "text-neutral-300 bg-white/5",
  MANUFACTURER: "text-blue-300 bg-blue-500/10",
  ADMIN: "text-amber-300 bg-amber-500/10",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (role) params.set("role", role);
    const r = await fetch(`/api/admin/users?${params}`);
    const d = await r.json();
    setUsers(d.users || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminGuard active="/admin/users">
      <h1 className="text-2xl font-black tracking-tight mb-4">Users</h1>
      <div className="flex gap-2 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search name / phone / email"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-brand,#F97316)]"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
        >
          <option value="">All roles</option>
          <option value="BUYER">Buyer</option>
          <option value="MANUFACTURER">Manufacturer</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button onClick={load} className="px-4 h-10 rounded-lg bg-[var(--color-brand,#F97316)] text-black font-semibold text-sm">Search</button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Phone</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Orders</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Wallet</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-neutral-400 font-mono text-xs hidden sm:table-cell">{u.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">{u._count?.orders ?? 0}</td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">₹{u.walletBalance?.toFixed(0)}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminGuard>
  );
}
