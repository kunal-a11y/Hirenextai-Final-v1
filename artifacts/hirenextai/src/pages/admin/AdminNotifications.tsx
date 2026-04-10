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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load notifications.");
      setItems(await res.json());
    } catch (e: any) {
      setError(e?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Notification Management</h1>
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-24" />
          ))}
        </div>
      )}
      {!!error && !loading && (
        <div className="card space-y-3">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={load} className="btn-secondary px-4 py-2 text-sm">Retry</button>
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <div className="card text-sm text-muted-foreground">No notifications yet.</div>
      )}
      {!loading && !error && items.length > 0 && <div className="space-y-3">
        {items.map((n) => (
          <div key={n.id} className="card card-hover">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{n.title}</h3>
              <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
            <p className="text-xs text-muted-foreground mt-2">Audience: {n.audience} · Channel: {n.channel}</p>
          </div>
        ))}
      </div>}
    </div>
  );
}
