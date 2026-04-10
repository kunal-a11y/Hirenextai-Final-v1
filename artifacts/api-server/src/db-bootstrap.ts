import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

async function ensureColumn(
  tableName: string,
  columnName: string,
  columnDefinition: string,
) {
  const result = await db.execute(sql`
    SELECT COUNT(*) AS count
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ${tableName}
      AND COLUMN_NAME = ${columnName}
  `);
  const count = Number((result as any)?.[0]?.count ?? 0);
  if (count === 0) {
    await db.execute(sql.raw(`ALTER TABLE \`${tableName}\` ADD COLUMN ${columnDefinition}`));
  }
}

export async function ensureCoreTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS recruiter_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      company_name VARCHAR(255) NULL,
      website VARCHAR(255) NULL,
      industry VARCHAR(255) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS job_alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      role VARCHAR(255) NULL,
      location VARCHAR(255) NULL,
      frequency VARCHAR(50) NOT NULL DEFAULT 'daily',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX job_alerts_user_idx (user_id)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX notifications_user_idx (user_id),
      INDEX notifications_read_idx (is_read)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS admin_notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      channel TEXT NOT NULL,
      audience TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX admin_notifications_user_idx (user_id),
      INDEX admin_notifications_read_idx (is_read)
    )
  `);

  await ensureColumn("recruiter_profiles", "website", "website VARCHAR(255) NULL");
  await ensureColumn("recruiter_profiles", "industry", "industry VARCHAR(255) NULL");
  await ensureColumn("job_alerts", "frequency", "frequency VARCHAR(50) NOT NULL DEFAULT 'daily'");
  await ensureColumn("job_alerts", "active", "active BOOLEAN NOT NULL DEFAULT TRUE");
  await ensureColumn("notifications", "is_read", "is_read BOOLEAN NOT NULL DEFAULT FALSE");
  await ensureColumn("admin_notifications", "channel", "channel TEXT NOT NULL DEFAULT 'in_app'");
  await ensureColumn("admin_notifications", "audience", "audience TEXT NOT NULL DEFAULT 'all'");
  await ensureColumn("admin_notifications", "is_read", "is_read BOOLEAN NOT NULL DEFAULT FALSE");
}
