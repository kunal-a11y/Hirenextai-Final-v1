ALTER TABLE `admin_notifications`
  ADD COLUMN IF NOT EXISTS `delivery_type` TEXT NOT NULL DEFAULT 'instant',
  ADD COLUMN IF NOT EXISTS `expires_at` DATETIME NULL,
  ADD COLUMN IF NOT EXISTS `dismissed_at` DATETIME NULL;

CREATE INDEX IF NOT EXISTS `admin_notifications_expires_idx` ON `admin_notifications` (`expires_at`);
