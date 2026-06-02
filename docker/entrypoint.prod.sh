#!/bin/sh
set -e

echo "[ecoswap] Menunggu database..."
attempt=0
until npx prisma db push; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    echo "[ecoswap] Gagal konek database setelah 30 percobaan."
    exit 1
  fi
  echo "[ecoswap] Database belum siap, coba lagi ($attempt/30)..."
  sleep 3
done

echo "[ecoswap] Schema siap."

mkdir -p /app/public/uploads/appraisals

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[ecoswap] Menjalankan seed demo..."
  npm run db:seed
fi

echo "[ecoswap] Menjalankan Next.js production..."
exec npm run start -- -H 0.0.0.0
