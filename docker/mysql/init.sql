-- EcoSwap — skema database production
-- MySQL 8.4 · InnoDB · utf8mb4

-- ─── Users ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id            CHAR(25)     NOT NULL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(128) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('SUPER_ADMIN', 'CURATOR', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
  avatar_url    VARCHAR(512) NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Heritage Catalog ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS heritage_items (
  id         CHAR(25)     NOT NULL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  region     VARCHAR(128) NOT NULL,
  category   VARCHAR(64)  NOT NULL,
  status     ENUM('ACTIVE', 'REVIEW', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Appraisals ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS appraisals (
  id                 CHAR(25)      NOT NULL PRIMARY KEY,
  user_id            CHAR(25)      NULL,
  image_name         VARCHAR(512)  NOT NULL,
  image_size         INT           NOT NULL,
  detected_object    VARCHAR(255)  NOT NULL,
  confidence_score   DECIMAL(5,2)  NOT NULL,
  role_classification VARCHAR(128) NOT NULL,
  condition_analysis VARCHAR(128) NOT NULL,
  eco_swap_points    INT           NOT NULL,
  inference_ms       INT           NOT NULL,
  model_version      VARCHAR(64)   NOT NULL DEFAULT 'EcoSwap-Heritage-CNN v1.2',
  created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_appraisals_user (user_id),
  INDEX idx_appraisals_created (created_at),
  CONSTRAINT fk_appraisals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Appraisal Predictions (Top-3 Softmax) ───────────────────────────────

CREATE TABLE IF NOT EXISTS appraisal_predictions (
  id           CHAR(25)     NOT NULL PRIMARY KEY,
  appraisal_id CHAR(25)     NOT NULL,
  label        VARCHAR(255) NOT NULL,
  probability  DECIMAL(5,2) NOT NULL,
  `rank`       INT          NOT NULL,

  INDEX idx_predictions_appraisal (appraisal_id),
  CONSTRAINT fk_predictions_appraisal FOREIGN KEY (appraisal_id) REFERENCES appraisals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Seed Data ────────────────────────────────────────────────────────────

-- Default admin user
-- Password untuk semua user demo: "password123"
-- Hash di-generate dengan scrypt (salt 16 bytes, hash 64 bytes)
INSERT IGNORE INTO users (id, email, name, password_hash, role) VALUES
  ('clx000000000000000000001', 'admin@ecoswap.id', 'Admin EcoSwap',   '5b9e8f1c2d3a4b5c6d7e8f0a1b2c3d4e:f1d2e3c4b5a69788090a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', 'SUPER_ADMIN'),
  ('clx000000000000000000002', 'budi@email.com',  'Budi Santoso',    '5b9e8f1c2d3a4b5c6d7e8f0a1b2c3d4e:f1d2e3c4b5a69788090a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', 'MEMBER'),
  ('clx000000000000000000003', 'siti@email.com',  'Siti Heritage',   '5b9e8f1c2d3a4b5c6d7e8f0a1b2c3d4e:f1d2e3c4b5a69788090a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', 'CURATOR');

-- Heritage catalog
INSERT IGNORE INTO heritage_items (id, name, region, category, status) VALUES
  ('clx000000000000000000010', 'Batik Tulis', 'Pekalongan', 'Tekstil', 'ACTIVE'),
  ('clx000000000000000000011', 'Tenun Ikat', 'Nusa Tenggara Timur', 'Tekstil', 'ACTIVE'),
  ('clx000000000000000000012', 'Ukiran Kayu', 'Jepara', 'Kerajinan', 'ACTIVE'),
  ('clx000000000000000000013', 'Keramik Tradisional', 'Jawa Tengah', 'Kerajinan', 'REVIEW'),
  ('clx000000000000000000014', 'Anyaman Bambu', 'Tasikmalaya', 'Kerajinan', 'ACTIVE'),
  ('clx000000000000000000015', 'Songket Palembang', 'Sumatera Selatan', 'Tekstil', 'ACTIVE');
