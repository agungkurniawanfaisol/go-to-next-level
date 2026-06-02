# EcoSwap

Platform barter berbasis AI appraisal — klasifikasi CNN, EcoSwap Points, dan komunitas barter.

## Development (lokal)

```bash
cp .env.example .env
npm install
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)
- **Tidak perlu database terpisah** — semua data statis dari file `data/*.json`

**Akun demo:** `admin@ecoswap.id` / `password123`

**Panduan demo juri:** [http://localhost:5173/demo](http://localhost:5173/demo) atau baca [`DEMO.md`](./DEMO.md)

## Deploy ke Vercel

Proyek ini sudah siap deploy ke Vercel tanpa database — semua data menggunakan file JSON statis.

1. Push ke GitHub
2. Import repo ke [vercel.com](https://vercel.com)
3. Set environment variables:
   - `JWT_SECRET` — string acak untuk signing session token
   - `COOKIE_SECURE=true`
4. Deploy!

## Reset data ke seed awal

```bash
npx tsx scripts/generate-seed-data.ts
```

Atau hapus file di `/tmp/ecoswap-data/` untuk memaksa reload seed saat server restart.

## Stack

- Next.js 16, React 19, Tailwind v4
- File-based JSON database (zero config)
- Vercel-ready
