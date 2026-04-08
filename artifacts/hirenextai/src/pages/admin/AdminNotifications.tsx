import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const API = import.meta.env.VITE_API_URL ?? "/api";

interface AdminNotification {
  id: number;
  title: string;
  message: string;
  channel: string;
  audience: string;
  createdAt: string;
}

export default function AdminNotifications() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminNotification[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setItems(await res.json());
    };
    if (token) load();
  }, [token]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Notification Management</h1>
      <div className="space-y-3">
        {items.map((n) => (
          <div key={n.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">{n.title}</h3>
              <span className="text-xs text-white/50">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-white/70 mt-1">{n.message}</p>
            <p className="text-xs text-white/40 mt-2">Audience: {n.audience} · Channel: {n.channel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
