#!/bin/sh
set -e

echo "[ecoswap] Menyiapkan direktori upload..."
mkdir -p /app/public/uploads/appraisals

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[ecoswap] Menjalankan seed data generator..."
  npx tsx scripts/generate-seed-data.ts
fi

echo "[ecoswap] Menjalankan Next.js production..."
exec npm run start -- -H 0.0.0.0
