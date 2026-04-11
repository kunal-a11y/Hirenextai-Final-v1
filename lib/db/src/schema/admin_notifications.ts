import { sql } from "drizzle-orm";
import { mysqlTable, int, text, boolean, datetime, index } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const adminNotificationsTable = mysqlTable(
  "admin_notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    channel: text("channel").notNull().default("in_app"),
    audience: text("audience").notNull().default("all"),
    deliveryType: text("delivery_type").notNull().default("instant"),
    expiresAt: datetime("expires_at"),
    dismissedAt: datetime("dismissed_at"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("admin_notifications_user_idx").on(t.userId),
    index("admin_notifications_read_idx").on(t.isRead),
    index("admin_notifications_created_idx").on(t.createdAt),
  ]
);
