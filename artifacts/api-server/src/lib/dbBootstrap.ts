import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

export async function ensureDatabaseConsistency() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS recruiter_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      company_name TEXT NOT NULL,
      company_logo_url TEXT NULL,
      company_website TEXT NULL,
      company_size TEXT NULL,
      industry TEXT NULL,
      recruiter_name TEXT NOT NULL,
      recruiter_position TEXT NULL,
      work_email TEXT NOT NULL,
      phone TEXT NULL,
      linkedin_url TEXT NULL,
      description TEXT NULL,
      company_location TEXT NULL,
      setup_completed TEXT NOT NULL DEFAULT 'false',
      recruiter_plan TEXT NOT NULL DEFAULT 'free',
      job_boost_credits INT NOT NULL DEFAULT 0,
      featured_jobs_credits INT NOT NULL DEFAULT 0,
      plan_valid_till DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT recruiter_profiles_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.execute(sql`
    ALTER TABLE recruiter_profiles
      ADD COLUMN IF NOT EXISTS recruiter_plan TEXT NOT NULL DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS job_boost_credits INT NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS featured_jobs_credits INT NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS plan_valid_till DATETIME NULL
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS recruiter_profiles_user_id_idx ON recruiter_profiles(user_id)
  `);

  await db.execute(sql`
    ALTER TABLE admin_notifications
      ADD COLUMN IF NOT EXISTS delivery_type TEXT NOT NULL DEFAULT 'instant',
      ADD COLUMN IF NOT EXISTS expires_at DATETIME NULL,
      ADD COLUMN IF NOT EXISTS dismissed_at DATETIME NULL
  `);
}
