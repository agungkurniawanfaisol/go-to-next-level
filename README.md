# EcoSwap

Platform barter berbasis AI appraisal — klasifikasi CNN, EcoSwap Points, dan komunitas barter.

## Development (lokal)

```bash
cp .env.example .env
docker compose up -d
```

- App: [http://localhost:5173](http://localhost:5173)
- MySQL: port `3307` (lihat `.env`)

**Akun demo:** `admin@ecoswap.id` / `password123`

**Panduan demo juri:** [http://localhost:5173/demo](http://localhost:5173/demo) atau baca [`DEMO.md`](./DEMO.md)

## Deploy production (Docker)

Cocok untuk VPS, laptop demo lomba, atau server tim.

```bash
cp .env.production.example .env
# Edit: MYSQL_* passwords, JWT_SECRET (wajib kuat)
nano .env

npm run docker:prod
```

- App di port **80** (ubah `APP_PORT` di `.env` jika perlu)
- Pertama kali: `RUN_SEED=true` mengisi data demo otomatis
- Setelah deploy: buka `/demo` untuk alur presentasi

Perintah lain:

```bash
npm run docker:prod:logs    # lihat log
npm run docker:prod:down    # stop
npm run docker:prod:seed    # seed ulang manual
```

### Deploy ke VPS publik

1. Install Docker di server (Ubuntu/Debian)
2. Clone repo, salin `.env` production
3. `npm run docker:prod`
4. Buka firewall port `80` (atau `APP_PORT`)
5. Opsional: domain + reverse proxy (Caddy/Nginx) + HTTPS

### Catatan keamanan production

- Ganti semua password di `.env`
- Set `JWT_SECRET` acak panjang
- Set `RUN_SEED=false` setelah data demo stabil (hindari reset data tiap restart)

## Stack

- Next.js 16, React 19, Tailwind v4
- Prisma 7 + MySQL 8
- Docker Compose (dev & prod)
