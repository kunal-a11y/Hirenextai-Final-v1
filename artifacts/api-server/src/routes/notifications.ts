import { Router } from "express";
import { db, adminNotificationsTable } from "@workspace/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middlewares/authenticate.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rows = await db
    .select()
    .from(adminNotificationsTable)
    .where(eq(adminNotificationsTable.userId, userId))
    .orderBy(desc(adminNotificationsTable.createdAt));

  // Lightweight expiry handling from encoded audience value: "<audience>|expires:<iso>"
  const activeRows = rows.filter((row: (typeof rows)[number]) => {
    const token = String(row.audience || "").split("|expires:")[1];
    if (!token) return true;
    const expires = new Date(token);
    return !Number.isNaN(expires.getTime()) && expires.getTime() > Date.now();
  });

  res.json(activeRows);
});

router.get("/unread-count", async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(adminNotificationsTable)
    .where(and(eq(adminNotificationsTable.userId, userId), eq(adminNotificationsTable.isRead, false)));

  res.json({ count: Number(row?.count ?? 0) });
});

router.post("/:id/read", async (req: AuthRequest, res) => {
  const userId = req.userId;
  const id = Number(req.params.id);
  if (!userId || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  await db
    .update(adminNotificationsTable)
    .set({ isRead: true })
    .where(and(eq(adminNotificationsTable.id, id), eq(adminNotificationsTable.userId, userId)));

  res.json({ success: true });
});

router.post("/read-all", async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  await db
    .update(adminNotificationsTable)
    .set({ isRead: true })
    .where(eq(adminNotificationsTable.userId, userId));

  res.json({ success: true });
});

export default router;
