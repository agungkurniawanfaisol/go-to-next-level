# Panduan Demo EcoSwap (untuk Juri)

**URL panduan interaktif:** `/demo` (mis. `https://domain-anda.com/demo`)

## Akun demo

| Peran | Email | Password |
|-------|-------|----------|
| Admin | `admin@ecoswap.id` | `password123` |
| Member | `siti@email.com` | `password123` |

---

## Alur demo wow (~3-5 menit)

### 0) Pembuka 20 detik (narasi juri)

- "EcoSwap mengubah barang bekas jadi nilai tukar digital berbasis AI, lalu langsung dipertukarkan di komunitas."
- "Yang akan saya tunjukkan: **AI menilai**, **poin keluar transparan**, **barter selesai**, dan **dampak lingkungan terukur**."

### 1) Impact Counter real-time (30 detik)

1. Buka beranda `/`
2. Tunjukkan section **Dampak Nyata EcoSwap**:
   - Barang Terselamatkan
   - Poin Beredar
   - Barter Sukses
   - Estimasi Limbah Dicegah (kg)
3. Tekankan: angka ini langsung dari database lokal, bukan gambar statis.

### 2) AI Appraisal + EcoSwap Points (2 menit) — **momen utama**

1. Buka **AI Appraisal** → `/appraisal`
2. Upload foto barang (batik, keramik, atau elektronik)
3. Tunggu pipeline CNN sampai langkah terakhir **Automated Appraisal**
4. **Perhatikan:** kartu emas **EcoSwap Points** muncul (status *Menghitung…*)
5. Setelah selesai: angka poin + panorama 360° + hasil klasifikasi
6. Tunjukkan panel **Kenapa poin ini keluar?** (transparansi faktor):
   - kondisi barang
   - klasifikasi heritage
   - confidence CNN
   - skor poin akhir

### 3) Publikasi + barter (1-1.5 menit)

1. Di halaman hasil, isi form **Publikasikan ke Barter**
2. Buka **List Barter** → `/barter` — barang baru tampil
3. Masuk ke `/barter/permintaan` lalu **tandai barter selesai**
4. Tunjukkan modal: **"Points Anda berkurang"** + total poin terbaru

### 4) Komunitas & bukti sosial (45 detik)

1. **Komunitas Barter** → `/barter/riwayat`
2. Klik satu kartu → detail: dua pihak, barang, percakapan
3. Opsional: **Statistik** → `/barter/stats`

### 4. Admin (2 menit)

1. **Masuk** → `/masuk` sebagai `admin@ecoswap.id`
2. **Admin** → dashboard, heritage, appraisals
3. **Barter** (sidebar): permintaan, selesai, detail proposal

---

## Kalimat kunci untuk juri (pakai ini saat presentasi)

- "Bukan marketplace biasa: ada *AI appraisal pipeline* yang memberi nilai tukar."
- "Poin tidak black-box, faktor pembentuknya kami tampilkan langsung."
- "Saat barter selesai, sistem langsung sinkron: status barang, poin, dan riwayat komunitas."
- "Dampak lingkungan diterjemahkan ke metrik yang bisa diaudit juri."

---

## Deploy cepat (VPS / laptop demo)

```bash
cp .env.production.example .env
# Edit .env: password & JWT_SECRET

docker compose -f docker-compose.prod.yml up --build -d
```

Buka `http://IP-SERVER:80` (atau port di `APP_PORT`).

Seed ulang: `RUN_SEED=true docker compose -f docker-compose.prod.yml up -d --force-recreate app`
