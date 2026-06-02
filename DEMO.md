# Panduan Demo EcoSwap (untuk Juri)

**URL panduan interaktif:** `/demo` (mis. `https://domain-anda.com/demo`)

## Akun demo

| Peran | Email | Password |
|-------|-------|----------|
| Admin | `admin@ecoswap.id` | `password123` |
| Member | `siti@email.com` | `password123` |

---

## Alur demo (~7 menit)

### 1. AI Appraisal + EcoSwap Points (2 menit) — **highlight untuk juri**

1. Buka **AI Appraisal** → `/appraisal`
2. Upload foto barang (batik, keramik, atau elektronik)
3. Tunggu pipeline CNN sampai langkah terakhir **Automated Appraisal**
4. **Perhatikan:** kartu emas **EcoSwap Points** muncul (status *Menghitung…*)
5. Setelah selesai: angka poin + panorama 360° + hasil klasifikasi

### 2. Publikasi barter (1 menit)

1. Di halaman hasil, isi form **Publikasikan ke Barter**
2. Buka **List Barter** → `/barter` — barang baru tampil

### 3. Komunitas & barter selesai (2 menit)

1. **Komunitas Barter** → `/barter/riwayat`
2. Klik satu kartu → detail: dua pihak, barang, percakapan
3. Opsional: **Statistik** → `/barter/stats`

### 4. Admin (2 menit)

1. **Masuk** → `/masuk` sebagai `admin@ecoswap.id`
2. **Admin** → dashboard, heritage, appraisals
3. **Barter** (sidebar): permintaan, selesai, detail proposal

---

## Poin yang perlu ditekankan ke juri

- Pipeline CNN 6 langkah (bukan sekadar upload foto)
- Langkah terakhir: **EcoSwap Points** sebagai nilai tukar digital
- Barter berbasis komunitas + transparansi (riwayat & chat)

---

## Deploy cepat (VPS / laptop demo)

```bash
cp .env.production.example .env
# Edit .env: password & JWT_SECRET

docker compose -f docker-compose.prod.yml up --build -d
```

Buka `http://IP-SERVER:80` (atau port di `APP_PORT`).

Seed ulang: `RUN_SEED=true docker compose -f docker-compose.prod.yml up -d --force-recreate app`
