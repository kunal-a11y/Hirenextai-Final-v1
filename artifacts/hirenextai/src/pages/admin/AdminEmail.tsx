import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

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
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [deliveryType, setDeliveryType] = useState<"popup" | "notification">("notification");
  const [durationHours, setDurationHours] = useState("24");
  const [sendEmail, setSendEmail] = useState(true);
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
      const expiry = Number(durationHours);
      const expiresAt = Number.isFinite(expiry) && expiry > 0
        ? new Date(Date.now() + expiry * 60 * 60 * 1000).toISOString()
        : undefined;
      const res = await fetch(`${API}/admin/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          message,
          audience,
          deliveryType,
          expiresAt,
          recipientUserIds: audience === "selected" ? selectedUsers : undefined,
          channels: sendEmail ? ["in_app", "email"] : ["in_app"],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to send announcement");
      toast({ title: t("admin.announcements"), description: `${data?.sent ?? 0} recipients` });
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
    } catch (error: any) {
      toast({ title: "Failed to send announcement", description: error?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-white">{t("admin.announcements")}</h1>
      <div className="card space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("admin.title")} className="w-full px-3 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-600" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder={t("admin.message")} className="w-full px-3 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-600" />

        <div className="flex items-center gap-3">
          <select value={audience} onChange={(e) => setAudience(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-600">
            <option value="all">{t("admin.allUsers")}</option>
            <option value="job_seeker">{t("admin.jobSeekers")}</option>
            <option value="recruiter">{t("admin.recruiters")}</option>
            <option value="selected">{t("admin.selectedUsers")}</option>
          </select>
          <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value as "popup" | "notification")} className="px-3 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-600">
            <option value="notification">{t("admin.inAppNotification")}</option>
            <option value="popup">{t("admin.popup")}</option>
          </select>
          <input
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            placeholder={t("admin.durationHours")}
            className="w-40 px-3 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-600"
          />
          <label className="text-sm text-white/80 flex items-center gap-2">
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
            {t("admin.sendEmail")}
          </label>
          <button onClick={sendEmailAnnouncement} disabled={sending} className="btn-primary px-4 py-2 text-sm disabled:opacity-50 transition-transform hover:scale-[1.02]">{sending ? t("admin.sending") : t("admin.sendAnnouncement")}</button>
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
