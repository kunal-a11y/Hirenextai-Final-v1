import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const API = import.meta.env.VITE_API_URL ?? "/api";

interface UserLite {
  id: number;
  name: string;
  email: string;
}

interface AdminUserApiResponse {
  id: number;
  name: string;
  email: string;
}

export default function AdminEmail() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState<UserLite[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = (await res.json()) as AdminUserApiResponse[];
        setUsers(data.map((u) => ({ id: u.id, name: u.name, email: u.email })));
      }
    };
    if (token) loadUsers();
  }, [token]);

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const sendEmailAnnouncement = async () => {
    if (!title.trim() || !message.trim()) return;
    if (audience === "selected" && selectedUsers.length === 0) {
      toast({ title: "Select at least one user", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API}/admin/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          message,
          audience,
          recipientUserIds: audience === "selected" ? selectedUsers : undefined,
          channels: ["in_app", "email"],
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Announcement sent" });
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
    } catch {
      toast({ title: "Failed to send announcement", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-white">Announcements</h1>
      <div className="glass-card p-5 space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-600" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Message" className="w-full px-3 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-600" />

        <div className="flex items-center gap-3">
          <select value={audience} onChange={(e) => setAudience(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-600">
            <option value="all">All users</option>
            <option value="job_seeker">Job seekers</option>
            <option value="recruiter">Recruiters</option>
            <option value="selected">Selected users</option>
          </select>
          <button onClick={sendEmailAnnouncement} disabled={sending} className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50">{sending ? "Sending..." : "Send Announcement"}</button>
        </div>

        {audience === "selected" && (
          <div className="border border-white/10 rounded-lg p-3 max-h-56 overflow-y-auto space-y-2">
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-2 text-sm text-white/80">
                <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => toggleUser(u.id)} />
                <span>{u.name} ({u.email})</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
