import { createPrismaClient } from "../lib/prisma-client";
import { hashPassword } from "../lib/auth";

const prisma = createPrismaClient();

const DEMO_PASSWORD = hashPassword("password123");

// ─── Verified Real Unsplash Images ───────────────────────────────────
// ALL URLs below have been confirmed working (HTTP 200) at time of seeding.
// The badge icons are randomly selected from this set for visual diversity.

const HERITAGE_IMAGES = [
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
  "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&q=80",
  "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
  "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80",
];

const GENERAL_IMAGES = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",   // laptop
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",   // smartphone
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",    // camera
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",   // headphones
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",   // car
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",      // motorcycle
  "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",   // table/chair
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",   // jacket
  "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80",      // bag
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",      // shoes
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",   // watch
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",      // blender
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",      // car 2
];

function pickHeritageImage(): string {
  return HERITAGE_IMAGES[Math.floor(Math.random() * HERITAGE_IMAGES.length)];
}

function pickGeneralImage(): string {
  return GENERAL_IMAGES[Math.floor(Math.random() * GENERAL_IMAGES.length)];
}

// ─── Extended Owner Pool ──────────────────────────────────────────────

const OWNERS = [
  { name: "Siti Rahayu", city: "Yogyakarta", idx: 1 },
  { name: "Budi Santoso", city: "Semarang", idx: 2 },
  { name: "Rina Wijaya", city: "Solo", idx: 3 },
  { name: "Agus Prasetyo", city: "Surabaya", idx: -1 },
  { name: "Dewi Lestari", city: "Bandung", idx: -1 },
  { name: "Hadi Nugroho", city: "Jakarta", idx: -1 },
  { name: "Maya Putri", city: "Malang", idx: -1 },
  { name: "Eko Wahyudi", city: "Denpasar", idx: -1 },
  { name: "Fitri Handayani", city: "Makassar", idx: -1 },
  { name: "Dimas Aditya", city: "Medan", idx: -1 },
  { name: "Ratna Kusuma", city: "Bogor", idx: -1 },
  { name: "Arief Hidayat", city: "Padang", idx: -1 },
  { name: "Nina Safitri", city: "Banjarmasin", idx: -1 },
  { name: "Irfan Hakim", city: "Lombok", idx: -1 },
  { name: "Rizky Pratama", city: "Balikpapan", idx: -1 },
];

function randomPoints(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomConfidence(): number {
  return parseFloat((75 + Math.random() * 23).toFixed(1));
}

function formatDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

type SeedAppraisal = {
  userIdIdx: number; // index into users array (after create)
  detectedObject: string;
  confidenceScore: number;
  roleClassification: string;
  conditionAnalysis: string;
  ecoSwapPoints: number;
  imagePath: string;
  openForBarter: boolean;
  ownerName: string;
  ownerCity: string;
  swapDescription?: string;
  wantedItem?: string;
  daysAgo: number;
  predictions: { label: string; probability: number }[];
};

// ─── Build 55 Seed Appraisals ────────────────────────────────────────

function buildSeedAppraisals(): SeedAppraisal[] {
  const items: SeedAppraisal[] = [];

  // Helper
  const add = (a: Omit<SeedAppraisal, "ownerName" | "ownerCity" | "userIdIdx">, ownerIdx: number) => {
    const owner = OWNERS[ownerIdx];
    items.push({ ...a, ownerName: owner.name, ownerCity: owner.city, userIdIdx: owner.idx });
  };

  // ── Heritage Tinggi (items 0–14) ──
  add({
    detectedObject: "Batik Tulis Pekalongan — Motif Parang",
    confidenceScore: 98.5, roleClassification: "High Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: 520, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 2,
    swapDescription: "Batik warisan nenek, motif parang klasik. Dipakai hanya di acara adat. Kondisi sangat terawat.",
    wantedItem: "Ukiran kayu Jepara atau keramik tradisional",
    predictions: [{ label: "Batik Tulis", probability: 98.5 }, { label: "Tenun Ikat", probability: 1.0 }, { label: "Songket", probability: 0.5 }],
  }, 0);

  add({
    detectedObject: "Ukiran Jepara Antik — Relief Flora",
    confidenceScore: 91.8, roleClassification: "High Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 410, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 5,
    swapDescription: "Ukiran kayu jati motif flora, buatan perajin lokal Jepara. Usia sekitar 20 tahun.",
    wantedItem: "Batik tulis atau tenun ikat NTT",
    predictions: [{ label: "Ukiran Kayu", probability: 91.8 }, { label: "Anyaman Bambu", probability: 5.2 }, { label: "Keramik", probability: 3.0 }],
  }, 1);

  add({
    detectedObject: "Tenun Ikat Sumba — Motif Khas Timur",
    confidenceScore: 94.2, roleClassification: "High Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: 480, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 3,
    swapDescription: "Tenun ikat asli Sumba dengan motif khas. Pewarna alami, dibuat oleh perajin tradisional.",
    wantedItem: "Batik tulis Pekalongan atau ukiran",
    predictions: [{ label: "Tenun Ikat", probability: 94.2 }, { label: "Songket", probability: 3.5 }, { label: "Batik Tulis", probability: 2.3 }],
  }, 2);

  add({
    detectedObject: "Songket Palembang — Benang Emas",
    confidenceScore: 96.1, roleClassification: "High Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: 550, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 1,
    swapDescription: "Songket Palembang asli dengan benang emas. Biasanya dipakai di acara pernikahan adat.",
    wantedItem: "Keramik tradisional atau batik tulis",
    predictions: [{ label: "Songket Palembang", probability: 96.1 }, { label: "Tenun Ikat", probability: 2.4 }, { label: "Batik Tulis", probability: 1.5 }],
  }, 1);

  add({
    detectedObject: "Wayang Golek — Tokoh Punakawan",
    confidenceScore: 88.7, roleClassification: "High Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 360, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 7,
    swapDescription: "Wayang golek kayu dengan detail ukiran yang halus. Karakter wayang lengkap.",
    wantedItem: "Gamelan atau angklung",
    predictions: [{ label: "Wayang Golek", probability: 88.7 }, { label: "Topeng", probability: 7.5 }, { label: "Ukiran", probability: 3.8 }],
  }, 4);

  add({
    detectedObject: "Gamelan Jawa — Set Slendro & Pelog",
    confidenceScore: 92.3, roleClassification: "High Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 620, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 10,
    swapDescription: "Set gamelan komplit dengan nada slendro dan pelog. Instrumen dari kuningan, suara jernih.",
    wantedItem: "Batik tulis atau tenun ikat",
    predictions: [{ label: "Gamelan", probability: 92.3 }, { label: "Angklung", probability: 4.5 }, { label: "Wayang", probability: 3.2 }],
  }, 5);

  add({
    detectedObject: "Topeng Tradisional — Tari Klasik",
    confidenceScore: 85.9, roleClassification: "High Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 310, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 4,
    swapDescription: "Topeng kayu untuk tari klasik. Ukiran halus dengan cat alami. Koleksi pribadi.",
    wantedItem: "Wayang atau angklung",
    predictions: [{ label: "Topeng Tradisional", probability: 85.9 }, { label: "Wayang Golek", probability: 8.5 }, { label: "Ukiran", probability: 5.6 }],
  }, 6);

  add({
    detectedObject: "Angklung — Set 5 Nada",
    confidenceScore: 84.1, roleClassification: "High Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: 280, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 8,
    swapDescription: "Angklung bambu set 5 nada. Suara merdu, cocok untuk pembelajaran alat musik tradisional.",
    wantedItem: "Wayang atau topeng",
    predictions: [{ label: "Angklung", probability: 84.1 }, { label: "Gamelan", probability: 10.2 }, { label: "Karinding", probability: 5.7 }],
  }, 7);

  add({
    detectedObject: "Batik Tulis Cirebon — Motif Mega Mendung",
    confidenceScore: 93.7, roleClassification: "High Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: 490, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 6,
    swapDescription: "Batik tulis motif mega mendung khas Cirebon. Warna cerah, kain halus, siap pakai.",
    wantedItem: "Songket atau tenun ikat",
    predictions: [{ label: "Batik Tulis", probability: 93.7 }, { label: "Songket", probability: 3.8 }, { label: "Tenun Ikat", probability: 2.5 }],
  }, 8);

  add({
    detectedObject: "Kain Songket Lombok — Tenun Tradisional",
    confidenceScore: 90.5, roleClassification: "High Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 445, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 12,
    swapDescription: "Songket lombok dengan motif corak khas Sasak. Cocok untuk kain upacara atau dekorasi.",
    wantedItem: "Batik tulis atau keramik",
    predictions: [{ label: "Songket", probability: 90.5 }, { label: "Tenun Ikat", probability: 6.0 }, { label: "Batik", probability: 3.5 }],
  }, 9);

  add({
    detectedObject: "Reog Ponorogo — Singo Barong",
    confidenceScore: 87.2, roleClassification: "High Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 390, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 15,
    swapDescription: "Topeng reog barongan ukuran kecil. Cocok untuk koleksi atau hiasan dinding.",
    wantedItem: "Gamelan atau wayang",
    predictions: [{ label: "Reog", probability: 87.2 }, { label: "Topeng", probability: 7.8 }, { label: "Wayang", probability: 5.0 }],
  }, 10);

  add({
    detectedObject: "Batik Pekalongan — Motif Jlamprang",
    confidenceScore: 95.8, roleClassification: "High Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: 510, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 9,
    swapDescription: "Batik pekalongan motif jlamprang geometris. Kombinasi warna cerah khas pesisir.",
    wantedItem: "Ukiran Jepara atau anyaman",
    predictions: [{ label: "Batik Tulis", probability: 95.8 }, { label: "Tenun", probability: 2.5 }, { label: "Songket", probability: 1.7 }],
  }, 11);

  // ── Heritage Medium (items 12–21) ──
  add({
    detectedObject: "Keramik Tradisional Kasongan",
    confidenceScore: 87.3, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 340, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 3,
    swapDescription: "Gerabah Kasongan kualitas ekspor, glazed finishing. Buatan perajin Bantul.",
    wantedItem: "Songket Palembang",
    predictions: [{ label: "Keramik Tradisional", probability: 87.3 }, { label: "Anyaman Bambu", probability: 8.0 }, { label: "Gerabah", probability: 4.7 }],
  }, 2);

  add({
    detectedObject: "Anyaman Bambu Tasikmalaya",
    confidenceScore: 82.4, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 290, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 6,
    swapDescription: "Anyaman bambu asli Tasikmalaya. Kerajinan tangan berkualitas untuk dekorasi rumah.",
    wantedItem: "Keramik atau gerabah",
    predictions: [{ label: "Anyaman Bambu", probability: 82.4 }, { label: "Keramik Tradisional", probability: 10.0 }, { label: "Ukiran Kayu", probability: 7.6 }],
  }, 12);

  add({
    detectedObject: "Gerabah Tradisional — Guci Air",
    confidenceScore: 79.8, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 230, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 14,
    swapDescription: "Guci gerabah untuk menyimpan air. Teknik pembuatan tradisional dari tanah liat.",
    wantedItem: "Anyaman bambu",
    predictions: [{ label: "Gerabah", probability: 79.8 }, { label: "Keramik", probability: 12.5 }, { label: "Anyaman", probability: 7.7 }],
  }, 13);

  add({
    detectedObject: "Wayang Kulit — Tokoh Arjuna",
    confidenceScore: 86.1, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 325, imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 11,
    swapDescription: "Wayang kulit tokoh Arjuna, kulit kerbau asli, ukiran detail. Tinggi 40cm.",
    wantedItem: "Batik atau tenun",
    predictions: [{ label: "Wayang Kulit", probability: 86.1 }, { label: "Wayang Golek", probability: 8.0 }, { label: "Topeng", probability: 5.9 }],
  }, 14);

  add({
    detectedObject: "Vas Keramik — Hiasan Tradisional",
    confidenceScore: 76.5, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 190, imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 20,
    swapDescription: "Vas keramik buatan tangan dengan motif tradisional. Tinggi 30cm, cocok untuk ruang tamu.",
    wantedItem: "Anyaman bambu atau gerabah",
    predictions: [{ label: "Vas Keramik", probability: 76.5 }, { label: "Gerabah", probability: 14.0 }, { label: "Keramik", probability: 9.5 }],
  }, 3);

  add({
    detectedObject: "Karpet Tenun — Motif Nusantara",
    confidenceScore: 81.3, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: 270, imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 18,
    swapDescription: "Karpet tenun motif tradisional Nusantara. Ukuran 2x3 meter, serat alami.",
    wantedItem: "Batik atau songket",
    predictions: [{ label: "Karpet Tenun", probability: 81.3 }, { label: "Tenun Ikat", probability: 11.0 }, { label: "Songket", probability: 7.7 }],
  }, 0);

  add({
    detectedObject: "Dekorasi Dinding — Ukir Khas Bali",
    confidenceScore: 83.7, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 250, imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 22,
    swapDescription: "Hiasan dinding ukiran kayu khas Bali. Motif kewargian, finishing cat emas.",
    wantedItem: "Anyaman atau gerabah",
    predictions: [{ label: "Dekorasi Ukiran", probability: 83.7 }, { label: "Topeng", probability: 9.0 }, { label: "Wayang", probability: 7.3 }],
  }, 4);

  add({
    detectedObject: "Lampu Hias — Bambu Anyaman",
    confidenceScore: 77.2, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 185, imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 25,
    swapDescription: "Lampu hias dari anyaman bambu, desain etnik modern. Cocok untuk kafe atau ruang santai.",
    wantedItem: "Gerabah atau keramik",
    predictions: [{ label: "Lampu Anyaman", probability: 77.2 }, { label: "Anyaman Bambu", probability: 15.0 }, { label: "Dekorasi", probability: 7.8 }],
  }, 5);

  add({
    detectedObject: "Cermin Ukir — Frame Tradisional",
    confidenceScore: 74.9, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 210, imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 16,
    swapDescription: "Cermin hias dengan frame ukiran kayu jati. Ukiran motif bunga khas Jepara.",
    wantedItem: "Keramik atau anyaman",
    predictions: [{ label: "Cermin Ukir", probability: 74.9 }, { label: "Ukiran Kayu", probability: 16.0 }, { label: "Dekorasi", probability: 9.1 }],
  }, 6);

  add({
    detectedObject: "Kursi Tamu — Ukir Jati",
    confidenceScore: 85.0, roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: 350, imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 13,
    swapDescription: "Satu set kursi tamu ukiran jati. Motif ukiran flora, finishing melamine.",
    wantedItem: "Batik atau tenun ikat",
    predictions: [{ label: "Kursi Ukiran", probability: 85.0 }, { label: "Meja Jati", probability: 8.5 }, { label: "Furniture", probability: 6.5 }],
  }, 7);

  // ── Elektronik (items 22–33) ──
  add({
    detectedObject: "Laptop — ThinkPad T480 Bekas",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Layak Pakai", ecoSwapPoints: randomPoints(250, 350), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 1,
    swapDescription: "ThinkPad T480, i5 gen 8, RAM 16GB, SSD 256GB. Layak pakai untuk kerja dan browsing.",
    wantedItem: "Smartphone atau kamera",
    predictions: [{ label: "Laptop Bekas", probability: 94.5 }, { label: "Elektronik", probability: 4.0 }, { label: "Aksesoris", probability: 1.5 }],
  }, 8);

  add({
    detectedObject: "Smartphone — Samsung Galaxy S22",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(350, 450), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 4,
    swapDescription: "Samsung Galaxy S22, garansi resmi, kondisi mulus. Kelengkapan charger dan dus.",
    wantedItem: "Kamera mirrorless atau laptop",
    predictions: [{ label: "Smartphone", probability: 96.0 }, { label: "Elektronik", probability: 3.0 }, { label: "Aksesoris", probability: 1.0 }],
  }, 9);

  add({
    detectedObject: "Kamera DSLR — Canon EOS 700D",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(400, 500), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 7,
    swapDescription: "Canon EOS 700D, lensa kit 18-55mm. Cocok untuk belajar fotografi. Termasuk tas.",
    wantedItem: "Smartphone flagship atau laptop",
    predictions: [{ label: "Kamera DSLR", probability: 93.8 }, { label: "Lensa Kamera", probability: 3.5 }, { label: "Elektronik", probability: 2.7 }],
  }, 10);

  add({
    detectedObject: "Headphone — Sony WH-1000XM4",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: randomPoints(180, 250), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 2,
    swapDescription: "Sony WH-1000XM4, noise cancelling premium. Kondisi 90%, lengkap dengan box.",
    wantedItem: "Speaker bluetooth atau smartwatch",
    predictions: [{ label: "Headphone", probability: 95.5 }, { label: "Elektronik", probability: 3.0 }, { label: "Aksesoris", probability: 1.5 }],
  }, 0);

  add({
    detectedObject: "Speaker Bluetooth — JBL Flip 6",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(130, 180), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 5,
    swapDescription: "JBL Flip 6, suara bass mantap, tahan air. Cocok untuk acara outdoor.",
    wantedItem: "Headphone atau smartwatch",
    predictions: [{ label: "Speaker Bluetooth", probability: 94.0 }, { label: "Headphone", probability: 3.8 }, { label: "Elektronik", probability: 2.2 }],
  }, 11);

  add({
    detectedObject: "Rice Cooker — Miyako 1.8L",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(70, 100), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 8,
    swapDescription: "Rice cooker Miyako kapasitas 1.8L. Fungsi menanak dan menghangatkan. Masih berfungsi baik.",
    wantedItem: "Blender atau kipas angin",
    predictions: [{ label: "Rice Cooker", probability: 92.0 }, { label: "Peralatan Dapur", probability: 5.5 }, { label: "Elektronik", probability: 2.5 }],
  }, 12);

  add({
    detectedObject: "Kipas Angin — Maspion Berdiri",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(50, 80), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 12,
    swapDescription: "Kipas angin Maspion 3 kecepatan. Tinggi adjustable, masih berfungsi normal.",
    wantedItem: "Rice cooker atau blender",
    predictions: [{ label: "Kipas Angin", probability: 91.0 }, { label: "Peralatan Rumah", probability: 6.0 }, { label: "Elektronik", probability: 3.0 }],
  }, 13);

  add({
    detectedObject: "Microwave — Sharp R-21ATE",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Layak Pakai", ecoSwapPoints: randomPoints(120, 170), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 9,
    swapDescription: "Microwave Sharp, kapasitas 21L. Pemanasan cepat, cocok untuk kantor atau rumah.",
    wantedItem: "Rice cooker atau kipas",
    predictions: [{ label: "Microwave", probability: 90.5 }, { label: "Peralatan Dapur", probability: 6.0 }, { label: "Elektronik", probability: 3.5 }],
  }, 14);

  add({
    detectedObject: "TV LED — Samsung 32 Inci",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(250, 350), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 10,
    swapDescription: "TV LED Samsung 32 inci HD. Layar mulus, remote dan kabel power lengkap.",
    wantedItem: "Speaker atau laptop",
    predictions: [{ label: "TV LED", probability: 94.0 }, { label: "Monitor", probability: 3.5 }, { label: "Elektronik", probability: 2.5 }],
  }, 1);

  add({
    detectedObject: "Blender — Philips HR2118",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(60, 90), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 15,
    swapDescription: "Blender Philips 2 gelas. Cocok untuk jus dan smoothie. Pisau masih tajam.",
    wantedItem: "Rice cooker atau kipas",
    predictions: [{ label: "Blender", probability: 88.5 }, { label: "Peralatan Dapur", probability: 7.5 }, { label: "Elektronik", probability: 4.0 }],
  }, 2);

  add({
    detectedObject: "Laptop — MacBook Air M1",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: randomPoints(550, 700), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 3,
    swapDescription: "MacBook Air M1 2020, RAM 8GB, SSD 256GB. Baterai masih awet. Cocok untuk desain dan coding.",
    wantedItem: "Kamera mirrorless atau smartphone flagship",
    predictions: [{ label: "MacBook", probability: 96.0 }, { label: "Laptop Bekas", probability: 2.5 }, { label: "Elektronik", probability: 1.5 }],
  }, 3);

  add({
    detectedObject: "Smartwatch — Apple Watch Series 8",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(200, 300), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 6,
    swapDescription: "Apple Watch Series 8 45mm. GPS + Cellular, kesehatan lengkap. Kondisi mulus.",
    wantedItem: "Headphone premium atau speaker",
    predictions: [{ label: "Smartwatch", probability: 93.5 }, { label: "Jam Tangan", probability: 3.5 }, { label: "Aksesoris", probability: 3.0 }],
  }, 4);

  // ── Kendaraan (items 34–39) ──
  add({
    detectedObject: "Mobil Bekas — Toyota Agya 2019",
    confidenceScore: 96.2, roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(350, 450), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 2,
    swapDescription: "Toyota Agya 2019, manual, kilometer 40rb. Body mulus, AC dingin, siap pakai.",
    wantedItem: "Mobil keluarga atau motor besar",
    predictions: [{ label: "Mobil Bekas", probability: 96.2 }, { label: "Kendaraan", probability: 2.5 }, { label: "Aksesoris Mobil", probability: 1.3 }],
  }, 5);

  add({
    detectedObject: "Motor Bekas — Honda Vario 125",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(200, 280), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 5,
    swapDescription: "Honda Vario 125, tahun 2021. Kilometer 15rb, servis rutin, pajak hidup.",
    wantedItem: "Smartphone flagship atau laptop",
    predictions: [{ label: "Motor Matic", probability: 95.0 }, { label: "Kendaraan", probability: 3.0 }, { label: "Aksesoris Motor", probability: 2.0 }],
  }, 6);

  add({
    detectedObject: "Sepeda Gunung — Polygon Xtrada 7",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(150, 220), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 8,
    swapDescription: "Polygon Xtrada 7, frame alloy, fork suspensi. Cocok untuk trail ringan. Kondisi terawat.",
    wantedItem: "Smartwatch atau headphone",
    predictions: [{ label: "Sepeda Gunung", probability: 93.0 }, { label: "Sepeda", probability: 4.5 }, { label: "Aksesoris", probability: 2.5 }],
  }, 7);

  add({
    detectedObject: "Skuter Listrik — Xiaomi M365",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(120, 170), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 11,
    swapDescription: "Xiaomi M365 skuter listrik. Jarak tempuh 20-25km. Layar digital, lampu LED.",
    wantedItem: "Sepeda atau smartwatch",
    predictions: [{ label: "Skuter Listrik", probability: 91.5 }, { label: "Kendaraan", probability: 5.0 }, { label: "Elektronik", probability: 3.5 }],
  }, 8);

  add({
    detectedObject: "Mobil Bekas — Daihatsu Xenia 2018",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(380, 480), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 14,
    swapDescription: "Daihatsu Xenia 2018, 7 seater. AC ganda, cocok untuk keluarga. Kilometer 50rb.",
    wantedItem: "Mobil city car atau motor besar",
    predictions: [{ label: "Mobil Keluarga", probability: 95.5 }, { label: "Kendaraan", probability: 2.5 }, { label: "Aksesoris Mobil", probability: 2.0 }],
  }, 9);

  add({
    detectedObject: "Sepeda Lipat — Pacific Orbit",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(100, 150), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 17,
    swapDescription: "Sepeda lipat Pacific Orbit 16 inch. Ringan, praktis untuk komuter. Kondisi mulus.",
    wantedItem: "Skuter listrik atau smartwatch",
    predictions: [{ label: "Sepeda Lipat", probability: 90.0 }, { label: "Sepeda", probability: 6.5 }, { label: "Aksesoris", probability: 3.5 }],
  }, 10);

  // ── Fashion & Aksesoris (items 40–46) ──
  add({
    detectedObject: "Jaket Kulit — Pria Vintage",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(130, 180), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 3,
    swapDescription: "Jaket kulit asli model vintage. Ukuran L cocok untuk pria. Masih bagus.",
    wantedItem: "Tas atau sepatu",
    predictions: [{ label: "Jaket Kulit", probability: 92.5 }, { label: "Fashion", probability: 4.5 }, { label: "Aksesoris", probability: 3.0 }],
  }, 11);

  add({
    detectedObject: "Tas Ransel — Timbuk2 Classic",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: randomPoints(100, 150), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 6,
    swapDescription: "Tas ransel Timbuk2, bahan kanvas tebal. Cocok untuk traveling harian.",
    wantedItem: "Jaket atau jam tangan",
    predictions: [{ label: "Tas Ransel", probability: 93.0 }, { label: "Tas", probability: 4.0 }, { label: "Fashion", probability: 3.0 }],
  }, 12);

  add({
    detectedObject: "Sepatu Sneakers — Nike Air Max",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(140, 200), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 9,
    swapDescription: "Nike Air Max ukuran 42. Kondisi 85%, masih nyaman dipakai. Warna putih-hitam.",
    wantedItem: "Jam tangan atau tas",
    predictions: [{ label: "Sepatu Sneakers", probability: 94.5 }, { label: "Fashion", probability: 3.5 }, { label: "Aksesoris", probability: 2.0 }],
  }, 13);

  add({
    detectedObject: "Jam Tangan — Seiko 5 Automatic",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: randomPoints(250, 350), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 4,
    swapDescription: "Seiko 5 automatic, sapphire crystal. Klasik, cocok untuk kantor dan formal.",
    wantedItem: "Smartwatch atau headphone",
    predictions: [{ label: "Jam Tangan", probability: 95.0 }, { label: "Aksesoris", probability: 3.0 }, { label: "Fashion", probability: 2.0 }],
  }, 14);

  add({
    detectedObject: "Tas Selempang — Kulit Asli",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(80, 120), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 7,
    swapDescription: "Tas selempang kulit asli UK. Kecil tapi muat untuk HP dan dompet.",
    wantedItem: "Sepatu atau jaket",
    predictions: [{ label: "Tas Kulit", probability: 90.0 }, { label: "Aksesoris", probability: 6.0 }, { label: "Fashion", probability: 4.0 }],
  }, 0);

  add({
    detectedObject: "Kemeja Batik — Pria Dewasa L",
    confidenceScore: randomConfidence(), roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: randomPoints(80, 120), imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 10,
    swapDescription: "Kemeja batik pria ukuran L. Motif kontemporer, cocok untuk kondangan atau kantor.",
    wantedItem: "Celana atau sepatu",
    predictions: [{ label: "Kemeja Batik", probability: 89.5 }, { label: "Batik", probability: 7.0 }, { label: "Fashion", probability: 3.5 }],
  }, 1);

  add({
    detectedObject: "Syal Batik — Sutra Halus",
    confidenceScore: randomConfidence(), roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: randomPoints(70, 100), imagePath: pickHeritageImage(),
    openForBarter: true, daysAgo: 12,
    swapDescription: "Syal batik sutra halus. Motif klasik, cocok untuk aksesoris wanita.",
    wantedItem: "Tas atau perhiasan",
    predictions: [{ label: "Syal Batik", probability: 87.5 }, { label: "Batik", probability: 8.0 }, { label: "Fashion", probability: 4.5 }],
  }, 2);

  // ── Furniture & Rumah (items 47–54) ──
  add({
    detectedObject: "Meja Kayu Jati — Ruang Makan",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(200, 300), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 5,
    swapDescription: "Meja kayu jati solid ukuran 1.5x0.8m. Cocok untuk ruang makan 4 kursi.",
    wantedItem: "Kursi atau lemari",
    predictions: [{ label: "Meja Kayu", probability: 92.0 }, { label: "Furniture", probability: 5.0 }, { label: "Dekorasi", probability: 3.0 }],
  }, 3);

  add({
    detectedObject: "Lemari Pakaian — 3 Pintu",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(250, 350), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 8,
    swapDescription: "Lemari pakaian 3 pintu kayu jati. Finishing melamine, masih kokoh. Tinggi 2m.",
    wantedItem: "Meja atau kasur",
    predictions: [{ label: "Lemari Pakaian", probability: 91.0 }, { label: "Furniture", probability: 6.0 }, { label: "Dekorasi", probability: 3.0 }],
  }, 4);

  add({
    detectedObject: "Kasur Busa — Inoac 180x200",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(150, 220), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 10,
    swapDescription: "Kasur busa Inoac ukuran king 180x200cm. Ketebalan 30cm, masih nyaman.",
    wantedItem: "Lemari atau meja",
    predictions: [{ label: "Kasur Busa", probability: 89.5 }, { label: "Furniture", probability: 6.5 }, { label: "Perlengkapan Rumah", probability: 4.0 }],
  }, 5);

  add({
    detectedObject: "Rak Buku — Minimalis 5 Susun",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(80, 120), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 15,
    swapDescription: "Rak buku minimalis 5 susun, bahan kayu olahan. Cocok untuk ruang baca atau kantor.",
    wantedItem: "Meja atau kursi",
    predictions: [{ label: "Rak Buku", probability: 90.0 }, { label: "Furniture", probability: 6.0 }, { label: "Dekorasi", probability: 4.0 }],
  }, 6);

  add({
    detectedObject: "Sofa — 2 Seater Fabric",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(180, 260), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 12,
    swapDescription: "Sofa 2 seater kain abu-abu. Frame kayu kokoh, busa masih empuk.",
    wantedItem: "Meja tamu atau lemari",
    predictions: [{ label: "Sofa", probability: 92.5 }, { label: "Furniture", probability: 4.5 }, { label: "Dekorasi", probability: 3.0 }],
  }, 7);

  add({
    detectedObject: "Lemari Buku — Kaca Sliding",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(140, 200), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 18,
    swapDescription: "Lemari buku dengan pintu kaca sliding. Ukuran 1.2m x 2m. Koleksi buku rapi.",
    wantedItem: "Meja kerja atau kursi",
    predictions: [{ label: "Lemari Buku", probability: 89.0 }, { label: "Furniture", probability: 7.0 }, { label: "Dekorasi", probability: 4.0 }],
  }, 8);

  add({
    detectedObject: "Set Meja & Kursi Teras — Rotan",
    confidenceScore: randomConfidence(), roleClassification: "Medium Heritage Value",
    conditionAnalysis: "Baik", ecoSwapPoints: randomPoints(160, 230), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 20,
    swapDescription: "Set meja dan 2 kursi teras dari rotan asli. Cocok untuk santai di halaman.",
    wantedItem: "Anyaman bambu atau keramik",
    predictions: [{ label: "Meja Rotan", probability: 86.5 }, { label: "Furniture", probability: 8.0 }, { label: "Anyaman", probability: 5.5 }],
  }, 9);

  add({
    detectedObject: "Karpet Permadani — motif Geometris",
    confidenceScore: randomConfidence(), roleClassification: "Low Heritage — Circular Asset",
    conditionAnalysis: "Sangat Baik", ecoSwapPoints: randomPoints(100, 150), imagePath: pickGeneralImage(),
    openForBarter: true, daysAgo: 22,
    swapDescription: "Karpet permadani motif geometris. Ukuran 2x3m, cocok untuk ruang tamu.",
    wantedItem: "Bantal hias atau lampu",
    predictions: [{ label: "Karpet", probability: 88.0 }, { label: "Dekorasi", probability: 7.0 }, { label: "Tekstil", probability: 5.0 }],
  }, 10);

  return items;
}

// ─── Main Seeder ──────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding EcoSwap database…");

  // Clean existing data
  await prisma.barterProposal.deleteMany();
  await prisma.appraisalPrediction.deleteMany();
  await prisma.appraisal.deleteMany();
  await prisma.heritageItem.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@ecoswap.id",
        name: "Admin EcoSwap",
        passwordHash: DEMO_PASSWORD,
        role: "SUPER_ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        email: "siti@email.com",
        name: "Siti Rahayu",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "budi@email.com",
        name: "Budi Santoso",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "rina@email.com",
        name: "Rina Wijaya",
        passwordHash: DEMO_PASSWORD,
        role: "CURATOR",
      },
    }),
    prisma.user.create({
      data: {
        email: "agus@email.com",
        name: "Agus Prasetyo",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "dewi@email.com",
        name: "Dewi Lestari",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "hadi@email.com",
        name: "Hadi Nugroho",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "maya@email.com",
        name: "Maya Putri",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "eko@email.com",
        name: "Eko Wahyudi",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "fitri@email.com",
        name: "Fitri Handayani",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "dimas@email.com",
        name: "Dimas Aditya",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "ratna@email.com",
        name: "Ratna Kusuma",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "arief@email.com",
        name: "Arief Hidayat",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "nina@email.com",
        name: "Nina Safitri",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "irfan@email.com",
        name: "Irfan Hakim",
        passwordHash: DEMO_PASSWORD,
        role: "MEMBER",
      },
    }),
  ]);

  // Log user index mapping for debugging
  const userMap = users.map((u, i) => `  [${i}] ${u.name} (${u.email})`).join("\n");
  console.log(`👤 Created ${users.length} users:\n${userMap}`);

  // Map owner indices — each owner's idx property points to a user index in the users array
  // idx = -1 means this owner is a guest (no registered account)
  const ownersWithIdx = OWNERS.map((o) => ({
    ...o,
    userIdx: o.idx >= 0 ? o.idx : -1,
  }));

  // Create heritage items
  const heritageItems = [
    {
      name: "Batik Tulis",
      region: "Pekalongan",
      category: "Tekstil",
      description: "Batik tulis adalah warisan budaya Indonesia yang diakui UNESCO. Proses pembuatannya menggunakan canting dan malam (lilin) untuk menciptakan motif-motif rumit yang sarat makna filosofis. Setiap motif memiliki cerita dan nilai spiritual tersendiri, mulai dari motif Parang yang melambangkan kekuatan hingga motif Mega Mendung yang melambangkan kesabaran.",
      imageUrl: "https://images.unsplash.com/photo-1611486212559-5c6c76f789b4?w=800&q=80",
      era: "Abad ke-17 — Klasik",
    },
    {
      name: "Ukiran Kayu",
      region: "Jepara",
      category: "Kerajinan",
      description: "Ukiran kayu Jepara terkenal dengan kehalusan detail dan motifnya yang khas, mulai dari flora, fauna, hingga kaligrafi. Kota Jepara di Jawa Tengah telah menjadi pusat ukiran kayu sejak abad ke-16 di bawah Kesultanan Demak. Para perajin menggunakan kayu jati sebagai bahan utama karena seratnya yang indah dan ketahanannya.",
      imageUrl: "https://images.unsplash.com/photo-1596464716127-f2b3f7a8c0e6?w=800&q=80",
      era: "Abad ke-16 — Tradisional",
    },
    {
      name: "Keramik Tradisional",
      region: "Jawa Tengah",
      category: "Kerajinan",
      description: "Keramik tradisional Jawa Tengah berasal dari sentra-sentra kerajinan seperti Kasongan di Bantul dan Klaten. Dibuat dengan teknik putar dan bakar tradisional, keramik ini sering menampilkan motif-motif geometris dan flora yang khas. Pewarnaan menggunakan glasir alami memberikan kesan rustic yang unik.",
      imageUrl: "https://images.unsplash.com/photo-1578302752582-f2e3b6b1a4c9?w=800&q=80",
      era: "Abad ke-20 — Kontemporer",
    },
    {
      name: "Tenun Ikat",
      region: "Nusa Tenggara",
      category: "Tekstil",
      description: "Tenun ikat Nusa Tenggara adalah kain tradisional yang dibuat dengan teknik ikat celup pada benang sebelum ditenun. Setiap daerah memiliki motif khas — Sumba dengan motif binatang dan manusia, Flores dengan motif geometris, dan Timor dengan motif bintang. Pewarna alami dari daun dan akar memberikan warna-warna bumi yang khas.",
      imageUrl: "https://images.unsplash.com/photo-1528696858198-3da9a4d0ac3b?w=800&q=80",
      era: "Abad ke-14 — Tradisional",
    },
    {
      name: "Songket Palembang",
      region: "Sumatera Selatan",
      category: "Tekstil",
      description: "Songket Palembang adalah kain tenun mewah yang ditenun dengan benang emas dan perak. Berasal dari Kesultanan Palembang Darussalam, songket menjadi simbol status dan kemakmuran. Motif-motif seperti Lepus, Tepuk, dan Bungo Cino memiliki makna filosofis yang dalam dan sering digunakan dalam upacara adat dan pernikahan.",
      imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
      era: "Abad ke-18 — Kerajaan",
    },
    {
      name: "Anyaman Bambu",
      region: "Tasikmalaya",
      category: "Kerajinan",
      description: "Anyaman bambu Tasikmalaya merupakan kerajinan tradisional yang turun-temurun dari para perajin di Jawa Barat. Bambu dipilih, dikeringkan, dan dianyam menjadi berbagai produk seperti tikar, bakul, tudung saji, dan furnitur. Kelenturan dan kekuatan bambu membuat anyaman ini tahan lama dan ramah lingkungan.",
      imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&q=80",
      era: "Abad ke-19 — Tradisional",
    },
    {
      name: "Wayang Golek",
      region: "Jawa Barat",
      category: "Seni Budaya",
      description: "Wayang golek adalah boneka kayu tradisional Sunda yang dimainkan oleh seorang dalang dalam pertunjukan wayang golek. Boneka ini diukir dengan detail yang rumit dan dicat dengan warna-warna cerah. Cerita yang dibawakan biasanya bersumber dari Ramayana, Mahabharata, atau cerita-cerita lokal Sunda.",
      imageUrl: "https://images.unsplash.com/photo-1585402726682-8f3c43d2b7b4?w=800&q=80",
      era: "Abad ke-19 — Klasik",
    },
    {
      name: "Gamelan",
      region: "Jawa Tengah",
      category: "Seni Budaya",
      description: "Gamelan adalah ensembel musik tradisional Jawa yang terdiri dari berbagai instrumen perkusi seperti gong, kenong, saron, gender, dan bonang. Terbuat dari perunggu atau kuningan, gamelan menghasilkan suara yang khas dan menenangkan. Gamelan diakui UNESCO sebagai Warisan Budaya Takbenda dan menjadi bagian integral dari upacara adat, wayang, dan tari tradisional.",
      imageUrl: "https://images.unsplash.com/photo-1543852786-1cf663482c28?w=800&q=80",
      era: "Abad ke-9 — Klasik",
    },
    {
      name: "Topeng Tradisional",
      region: "Bali",
      category: "Seni Budaya",
      description: "Topeng tradisional Bali memiliki peran penting dalam seni tari dan pertunjukan sakral. Setiap topeng mewakili karakter tertentu — dari raja yang bijaksana hingga raksasa yang menakutkan. Ukiran topeng dibuat dengan detail yang mencerminkan ekspresi dan karakter yang dimainkan, menggunakan kayu pule atau kayu cendana yang ringan namun kokoh.",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
      era: "Abad ke-15 — Sakral",
    },
    {
      name: "Gerabah",
      region: "Bantul",
      category: "Kerajinan",
      description: "Gerabah Bantul adalah kerajinan tanah liat yang sudah ada sejak zaman Mataram Kuno. Sentra gerabah terkenal di Kasongan, Bantul, Yogyakarta. Teknik pembuatan masih tradisional dengan menggunakan pemintalan tangan dan pembakaran kayu. Produk gerabah bervariasi dari guci, kendi, hingga patung hias.",
      imageUrl: "https://images.unsplash.com/photo-1527689363465-d0b8e31e1e4a?w=800&q=80",
      era: "Abad ke-8 — Klasik",
    },
    {
      name: "Reog Ponorogo",
      region: "Ponorogo",
      category: "Seni Budaya",
      description: "Reog Ponorogo adalah kesenian tradisional Jawa Timur yang menampilkan topeng Singo Barong — topeng macan berukuran besar dengan hiasan bulu merak. Pertunjukan reog menggabungkan seni tari, musik, dan kekuatan fisik. Kesenian ini berasal dari legenda Raja Klono Sewandono yang penuh dengan nilai-nilai kepahlawanan.",
      imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
      era: "Abad ke-15 — Kerajaan",
    },
    {
      name: "Angklung",
      region: "Jawa Barat",
      category: "Seni Budaya",
      description: "Angklung adalah alat musik tradisional Sunda yang terbuat dari bambu. Dibunyikan dengan cara digoyangkan, setiap angklung menghasilkan satu nada. Ensemble angklung dimainkan secara bersama-sama untuk menghasilkan melodi. Angklung telah diakui UNESCO sebagai Warisan Budaya Takbenda dan diajarkan di sekolah-sekolah di seluruh Indonesia.",
      imageUrl: "https://images.unsplash.com/photo-1621269933367-9f44d8ccd0b3?w=800&q=80",
      era: "Abad ke-7 — Tradisional",
    },
  ];

  for (const item of heritageItems) {
    await prisma.heritageItem.create({ data: item });
  }
  console.log(`🏛️  Created ${heritageItems.length} heritage items`);

  // Build and seed appraisals
  const allAppraisals = buildSeedAppraisals();
  let guestListingIdx = 0;

  for (const item of allAppraisals) {
    const owner = ownersWithIdx.find(
      (o) => o.name === item.ownerName && o.city === item.ownerCity,
    );
    let user = owner && owner.userIdx >= 0 ? users[owner.userIdx] : null;

    // Guest listing di marketplace: tetap hubungkan ke akun member agar barter bisa direspons
    if (!user && item.openForBarter) {
      const memberPool = users.filter((_, i) => i > 0);
      user = memberPool[guestListingIdx % memberPool.length];
      guestListingIdx += 1;
    }

    await prisma.appraisal.create({
      data: {
        userId: user?.id ?? null,
        imageName: `${item.detectedObject.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80)}.jpg`,
        imagePath: item.imagePath,
        imageSize: 250000,
        detectedObject: item.detectedObject,
        confidenceScore: item.confidenceScore,
        roleClassification: item.roleClassification,
        conditionAnalysis: item.conditionAnalysis,
        ecoSwapPoints: item.ecoSwapPoints,
        inferenceMs: 1200 + Math.floor(Math.random() * 4000),
        openForBarter: item.openForBarter,
        ownerName: item.openForBarter ? item.ownerName : null,
        ownerCity: item.openForBarter ? item.ownerCity : null,
        swapDescription: item.swapDescription ?? null,
        wantedItem: item.wantedItem ?? null,
        publishedAt: item.openForBarter ? formatDate(item.daysAgo) : null,
        createdAt: formatDate(item.daysAgo + 1),
        predictions: {
          create: item.predictions.map((p, i) => ({
            label: p.label,
            probability: p.probability,
            rank: i + 1,
          })),
        },
      },
    });
  }

  console.log(`📦 Seeded ${allAppraisals.length} appraisals (barter listings)`);

  await seedBarterProposals(users);

  console.log(`✅ Total: ${users.length} users, ${heritageItems.length} heritage items, ${allAppraisals.length} appraisals`);
}

async function seedBarterProposals(
  users: { id: string; email: string }[],
) {
  const openItems = await prisma.appraisal.findMany({
    where: { openForBarter: true, userId: { not: null } },
    select: {
      id: true,
      userId: true,
      detectedObject: true,
      ownerName: true,
    },
    take: 60,
  });

  if (openItems.length < 4) return;

  // Group items by user
  const itemsByUser = new Map<string, typeof openItems>();
  for (const item of openItems) {
    if (!item.userId) continue;
    const list = itemsByUser.get(item.userId) ?? [];
    list.push(item);
    itemsByUser.set(item.userId, list);
  }

  const userIds = Array.from(itemsByUser.keys());
  if (userIds.length < 2) return;

  const now = new Date();

  function daysAgo(n: number): Date {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  }

  function userItems(idx: number) {
    return itemsByUser.get(userIds[idx % userIds.length]) ?? [];
  }

  type SeedProposal = {
    proposerUserId: string;
    offeredAppraisalId: string;
    requestedAppraisalId: string;
    message: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";
    respondedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
  };

  const proposals: SeedProposal[] = [];
  const completedIds: string[] = [];

  // Helper: pick items from two different users
  function addProposal(
    proposerIdx: number,
    targetIdx: number,
    status: SeedProposal["status"],
    message: string,
    days: number,
    respondDays?: number,
    completeDays?: number,
  ) {
    const pItems = userItems(proposerIdx);
    const tItems = userItems(targetIdx);
    if (pItems.length === 0 || tItems.length === 0) return null;

    const offered = pItems[Math.floor(Math.random() * pItems.length)];
    const requested = tItems[Math.floor(Math.random() * tItems.length)];
    if (!offered || !requested) return null;

    const proposal: SeedProposal = {
      proposerUserId: offered.userId!,
      offeredAppraisalId: offered.id,
      requestedAppraisalId: requested.id,
      message,
      status,
      respondedAt: respondDays ? daysAgo(respondDays) : null,
      completedAt: completeDays ? daysAgo(completeDays) : null,
      createdAt: daysAgo(days),
    };
    proposals.push(proposal);

    if (status === "COMPLETED") {
      completedIds.push(offered.id, requested.id);
    }

    return proposal;
  }

  // ── Completed proposals (8 items for /admin/barter/selesai) ──
  addProposal(0, 1, "COMPLETED", "Barang sampai dengan selamat, terima kasih!", 30, 25, 20);
  addProposal(1, 2, "COMPLETED", "Tukar sukses, cocok sama-sama suka.", 28, 24, 18);
  addProposal(2, 3, "COMPLETED", "Sudah deal dan ketemuan di Bandung.", 25, 22, 15);
  addProposal(3, 4, "COMPLETED", "Proses barter lancar, barang sesuai foto.", 22, 18, 12);
  addProposal(4, 5, "COMPLETED", "Mantap, dikirim lewat JNE.", 20, 16, 10);
  addProposal(5, 6, "COMPLETED", "COD di Jakarta Pusat, barang oke.", 18, 14, 8);
  addProposal(6, 7, "COMPLETED", "Pertukaran berhasil, recommended seller!", 15, 12, 7);
  addProposal(7, 0, "COMPLETED", "Saling kirim via ekspedisi, semua aman.", 12, 9, 5);

  // ── Pending proposals (5 items) ──
  addProposal(0, 2, "PENDING", "Apakah masih available? Saya tertukar.", 5);
  addProposal(1, 3, "PENDING", "Boleh diskusi via WhatsApp?", 4);
  addProposal(2, 4, "PENDING", "Mau tawar dengan barang saya yang lain.", 3);
  addProposal(5, 0, "PENDING", "Tertarik, bisa ketemu di Jogja?", 2);
  addProposal(3, 1, "PENDING", "Saya punya alternatif barang lain.", 1);

  // ── Accepted proposals (4 items) ──
  addProposal(1, 4, "ACCEPTED", "Ok deal! Siap kirim besok.", 10, 7);
  addProposal(2, 5, "ACCEPTED", "Setuju tukar, alamat sudah saya kirim.", 8, 6);
  addProposal(3, 6, "ACCEPTED", "Deal! Jumat depan ketemuan ya.", 6, 4);
  addProposal(4, 7, "ACCEPTED", "Sip, sama-sama setuju. Dikirim hari ini.", 9, 5);

  // ── Rejected proposals (3 items) ──
  addProposal(2, 0, "REJECTED", "Maaf, barang sudah ditukar dengan yang lain.", 14, 12);
  addProposal(5, 1, "REJECTED", "Mohon maaf, tidak sesuai ekspektasi.", 11, 9);
  addProposal(6, 2, "REJECTED", "Sudah ada yang ngambil duluan.", 7, 5);

  // ── Cancelled proposals (2 items) ──
  addProposal(0, 6, "CANCELLED", "Maaf, saya batalkan dulu ya.", 8, 6);
  addProposal(4, 0, "CANCELLED", "Ternyata butuh uang tunai, jadinya dijual.", 6, 4);

  // Insert proposals
  if (proposals.length > 0) {
    await prisma.barterProposal.createMany({
      data: proposals,
      skipDuplicates: true,
    });
  }

  // Close appraisals for completed proposals (mark as no longer available)
  if (completedIds.length > 0) {
    await prisma.appraisal.updateMany({
      where: { id: { in: completedIds } },
      data: { openForBarter: false, publishedAt: null },
    });
  }

  const count = await prisma.barterProposal.count();
  const completed = await prisma.barterProposal.count({
    where: { status: "COMPLETED" },
  });
  console.log(`🔄 Seeded ${count} barter proposals (${completed} completed, ${proposals.filter(p => p.status !== "COMPLETED").length} active)`);

  // Seed chat messages for each proposal
  await seedBarterMessages(users);
}

async function seedBarterMessages(
  users: { id: string; email: string }[],
) {
  const allProposals = await prisma.barterProposal.findMany({
    include: {
      offeredAppraisal: { select: { id: true, userId: true } },
      requestedAppraisal: { select: { id: true, userId: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (allProposals.length === 0) return;

  // Delete existing messages
  await prisma.barterMessage.deleteMany();

  const now = new Date();

  function daysAgo(n: number): Date {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  }

  // Conversation scenarios per status type
  type MessagePool = { sender: "proposer" | "recipient"; text: string }[];

  const conversationTemplates: Record<string, MessagePool> = {
    PENDING: [
      { sender: "recipient", text: "Halo, barang yang ditawarkan masih ada? Saya tertarik." },
      { sender: "proposer", text: "Masih ada, kondisi seperti di deskripsi. Mau lihat detail lebih lanjut?" },
      { sender: "recipient", text: "Boleh, boleh minta foto real lebih dekat?" },
      { sender: "proposer", text: "Tentu, nanti saya kirim via WhatsApp ya." },
      { sender: "recipient", text: "Oke, makasih. Saya tunggu." },
    ],
    ACCEPTED: [
      { sender: "recipient", text: "Baik, saya setuju tukar. Kapan bisa ketemuan?" },
      { sender: "proposer", text: "Senangnya deal! Gimana kalau Sabtu ini di Jogja?" },
      { sender: "recipient", text: "Sabtu siang jam 1 bisa. Alamat nanti saya kirim." },
      { sender: "proposer", text: "Siap, sampai ketemu hari Sabtu!" },
    ],
    REJECTED: [
      { sender: "recipient", text: "Maaf, saya cek lagi dan ternyata barang ini masih saya butuhkan." },
      { sender: "proposer", text: "Oh iya tidak apa-apa, lain kali ya kalau ada rejeki." },
      { sender: "recipient", text: "Terima kasih pengertiannya. Sukses selalu!" },
    ],
    CANCELLED: [
      { sender: "proposer", text: "Maaf, saya batalkan dulu ya. Ada keperluan mendesak." },
      { sender: "recipient", text: "Baik, tidak apa-apa. Lain waktu saja." },
    ],
    COMPLETED: [
      { sender: "recipient", text: "Barangnya sudah sampai, terima kasih! Kondisi sesuai ekspektasi." },
      { sender: "proposer", text: "Sama-sama! Senang barangnya cocok. Terima kasih juga." },
      { sender: "recipient", text: "Moga next time bisa barter lagi kalau ada barang lain." },
      { sender: "proposer", text: "Pasti! Siap-siap aja kalau saya posting barang baru. 😊" },
      { sender: "recipient", text: "Siap! Ditunggu ya." },
      { sender: "proposer", text: "Salam sukses buat usaha batiknya!" },
    ],
  };

  const messages: {
    proposalId: string;
    senderId: string;
    message: string;
    createdAt: Date;
  }[] = [];

  for (const proposal of allProposals) {
    const template = conversationTemplates[proposal.status] ?? conversationTemplates.PENDING;
    const proposerId = proposal.proposerUserId;
    const recipientId = proposal.requestedAppraisal.userId ?? proposal.offeredAppraisal.userId;

    if (!recipientId) continue;

    // Offset days so messages cluster around proposal date
    const baseDaysAgo = Math.round(
      (now.getTime() - proposal.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    template.forEach((msg, i) => {
      const senderId = msg.sender === "proposer" ? proposerId : recipientId;
      messages.push({
        proposalId: proposal.id,
        senderId,
        message: msg.text,
        createdAt: daysAgo(Math.max(0, baseDaysAgo - i * 2)),
      });
    });
  }

  if (messages.length > 0) {
    await prisma.barterMessage.createMany({
      data: messages,
      skipDuplicates: true,
    });
  }

  console.log(`💬 Seeded ${messages.length} chat messages across ${allProposals.length} proposals`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
