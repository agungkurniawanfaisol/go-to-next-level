/**
 * EcoSwap — Deterministic Seed Data Generator
 *
 * Generates static JSON files for the file-based database.
 * Run: npx tsx scripts/generate-seed-data.ts
 *
 * Outputs to data/ directory.
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { scryptSync, randomBytes } from "crypto";
import path from "path";

const DATA_DIR = path.join(import.meta.dirname, "..", "data");

// ─── Deterministic helpers ────────────────────────────────────────────────

let _counter = 0;
function cuid(): string {
  _counter++;
  const ts = Date.now().toString(36);
  const seq = _counter.toString(36).padStart(4, "0");
  return `cld${ts}${seq}`;
}

function hashPassword(password: string): string {
  // Use a fixed salt so the output is deterministic
  const salt = "ecoswap-demo-salt-16byte";
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const DEMO_PASSWORD = hashPassword("password123");

function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

// ─── Helpers for seed data ────────────────────────────────────────────────

const HERITAGE_IMAGES = [
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
  "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&q=80",
  "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
  "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80",
];

const GENERAL_IMAGES = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
  "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
];

function pickHeritageImage(): string {
  return HERITAGE_IMAGES[Math.floor(Math.random() * HERITAGE_IMAGES.length)];
}

function pickGeneralImage(): string {
  return GENERAL_IMAGES[Math.floor(Math.random() * GENERAL_IMAGES.length)];
}

const OWNERS = [
  { name: "Siti Rahayu", city: "Yogyakarta" },
  { name: "Budi Santoso", city: "Semarang" },
  { name: "Rina Wijaya", city: "Solo" },
  { name: "Agus Prasetyo", city: "Surabaya" },
  { name: "Dewi Lestari", city: "Bandung" },
  { name: "Hadi Nugroho", city: "Jakarta" },
  { name: "Maya Putri", city: "Malang" },
  { name: "Eko Wahyudi", city: "Denpasar" },
  { name: "Fitri Handayani", city: "Makassar" },
  { name: "Dimas Aditya", city: "Medan" },
  { name: "Ratna Kusuma", city: "Bogor" },
  { name: "Arief Hidayat", city: "Padang" },
  { name: "Nina Safitri", city: "Banjarmasin" },
  { name: "Irfan Hakim", city: "Lombok" },
  { name: "Rizky Pratama", city: "Balikpapan" },
];

function randomPoints(min: number, max: number): number {
  // Deterministic pseudo-random using counter
  const seed = _counter * 9301 + 49297;
  const r = ((seed % 10000) / 10000) * (max - min + 1);
  return Math.floor(r) + min;
}

// ─── Build Data ──────────────────────────────────────────────────────────

function buildUsers() {
  return [
    { id: cuid(), email: "admin@ecoswap.id", name: "Admin EcoSwap", passwordHash: DEMO_PASSWORD, role: "SUPER_ADMIN", avatarUrl: null, createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), email: "siti@email.com", name: "Siti Rahayu", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(55), updatedAt: formatDate(1) },
    { id: cuid(), email: "budi@email.com", name: "Budi Santoso", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(55), updatedAt: formatDate(1) },
    { id: cuid(), email: "rina@email.com", name: "Rina Wijaya", passwordHash: DEMO_PASSWORD, role: "CURATOR", avatarUrl: null, createdAt: formatDate(55), updatedAt: formatDate(1) },
    { id: cuid(), email: "agus@email.com", name: "Agus Prasetyo", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(50), updatedAt: formatDate(1) },
    { id: cuid(), email: "dewi@email.com", name: "Dewi Lestari", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(50), updatedAt: formatDate(1) },
    { id: cuid(), email: "hadi@email.com", name: "Hadi Nugroho", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(45), updatedAt: formatDate(1) },
    { id: cuid(), email: "maya@email.com", name: "Maya Putri", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(45), updatedAt: formatDate(1) },
    { id: cuid(), email: "eko@email.com", name: "Eko Wahyudi", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(40), updatedAt: formatDate(1) },
    { id: cuid(), email: "fitri@email.com", name: "Fitri Handayani", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(40), updatedAt: formatDate(1) },
    { id: cuid(), email: "dimas@email.com", name: "Dimas Aditya", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(35), updatedAt: formatDate(1) },
    { id: cuid(), email: "ratna@email.com", name: "Ratna Kusuma", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(35), updatedAt: formatDate(1) },
    { id: cuid(), email: "arief@email.com", name: "Arief Hidayat", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(30), updatedAt: formatDate(1) },
    { id: cuid(), email: "nina@email.com", name: "Nina Safitri", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(30), updatedAt: formatDate(1) },
    { id: cuid(), email: "irfan@email.com", name: "Irfan Hakim", passwordHash: DEMO_PASSWORD, role: "MEMBER", avatarUrl: null, createdAt: formatDate(25), updatedAt: formatDate(1) },
  ];
}

function buildHeritageItems() {
  return [
    { id: cuid(), name: "Batik Tulis", region: "Pekalongan", category: "Tekstil", description: "Batik tulis adalah warisan budaya Indonesia yang diakui UNESCO.", imageUrl: HERITAGE_IMAGES[0], era: "Abad ke-17 — Klasik", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Ukiran Kayu", region: "Jepara", category: "Kerajinan", description: "Ukiran kayu Jepara terkenal dengan kehalusan detail.", imageUrl: HERITAGE_IMAGES[1], era: "Abad ke-16 — Tradisional", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Keramik Tradisional", region: "Jawa Tengah", category: "Kerajinan", description: "Keramik tradisional dari sentra Kasongan.", imageUrl: HERITAGE_IMAGES[2], era: "Abad ke-20 — Kontemporer", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Tenun Ikat", region: "Nusa Tenggara", category: "Tekstil", description: "Tenun ikat Nusa Tenggara dengan teknik ikat celup.", imageUrl: HERITAGE_IMAGES[3], era: "Abad ke-14 — Tradisional", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Songket Palembang", region: "Sumatera Selatan", category: "Tekstil", description: "Songket Palembang ditenun dengan benang emas.", imageUrl: HERITAGE_IMAGES[4], era: "Abad ke-18 — Kerajaan", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Anyaman Bambu", region: "Tasikmalaya", category: "Kerajinan", description: "Anyaman bambu Tasikmalaya, kerajinan turun-temurun.", imageUrl: GENERAL_IMAGES[6], era: "Abad ke-19 — Tradisional", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Wayang Golek", region: "Jawa Barat", category: "Seni Budaya", description: "Wayang golek boneka kayu tradisional Sunda.", imageUrl: GENERAL_IMAGES[7], era: "Abad ke-19 — Klasik", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Gamelan", region: "Jawa Tengah", category: "Seni Budaya", description: "Gamelan ensembel musik tradisional Jawa.", imageUrl: GENERAL_IMAGES[8], era: "Abad ke-9 — Klasik", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Topeng Tradisional", region: "Bali", category: "Seni Budaya", description: "Topeng tradisional Bali untuk seni tari sakral.", imageUrl: GENERAL_IMAGES[9], era: "Abad ke-15 — Sakral", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Gerabah", region: "Bantul", category: "Kerajinan", description: "Gerabah Bantul, kerajinan tanah liat sejak Mataram Kuno.", imageUrl: GENERAL_IMAGES[10], era: "Abad ke-8 — Klasik", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Reog Ponorogo", region: "Ponorogo", category: "Seni Budaya", description: "Reog Ponorogo dengan topeng Singo Barong.", imageUrl: GENERAL_IMAGES[11], era: "Abad ke-15 — Kerajaan", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
    { id: cuid(), name: "Angklung", region: "Jawa Barat", category: "Seni Budaya", description: "Angklung alat musik bambu tradisional Sunda.", imageUrl: GENERAL_IMAGES[12], era: "Abad ke-7 — Tradisional", status: "ACTIVE", createdAt: formatDate(60), updatedAt: formatDate(1) },
  ];
}

// ─── Build Appraisals & Predictions ──────────────────────────────────────

type SeedAppraisal = {
  id: string;
  userId: string | null;
  imageName: string;
  imagePath: string | null;
  imageSize: number;
  detectedObject: string;
  confidenceScore: number;
  roleClassification: string;
  conditionAnalysis: string;
  ecoSwapPoints: number;
  inferenceMs: number;
  modelVersion: string;
  openForBarter: boolean;
  ownerName: string | null;
  ownerCity: string | null;
  swapDescription: string | null;
  wantedItem: string | null;
  publishedAt: string | null;
  createdAt: string;
};

type SeedPrediction = {
  id: string;
  appraisalId: string;
  label: string;
  probability: number;
  rank: number;
};

function buildAppraisals(userIds: string[]): { appraisals: SeedAppraisal[]; predictions: SeedPrediction[] } {
  const appraisals: SeedAppraisal[] = [];
  const predictions: SeedPrediction[] = [];

  // Map some owners to real user IDs
  const memberUsers = userIds.filter((_, i) => i > 0);

  const add = (
    opts: {
      detectedObject: string;
      confidenceScore: number;
      roleClassification: string;
      conditionAnalysis: string;
      ecoSwapPoints: number;
      imagePath: string;
      openForBarter: boolean;
      daysAgo: number;
      swapDescription?: string;
      wantedItem?: string;
      predLabels: string[];
      predProbs: number[];
    },
    ownerIdx: number,
  ) => {
    const id = cuid();
    const owner = OWNERS[ownerIdx];
    // Assign a user ID — cycle through member users
    const assignUser = memberUsers[appraisals.length % memberUsers.length];
    const imageName = opts.detectedObject.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80) + ".jpg";

    appraisals.push({
      id,
      userId: assignUser,
      imageName,
      imagePath: opts.imagePath,
      imageSize: 250000,
      detectedObject: opts.detectedObject,
      confidenceScore: opts.confidenceScore,
      roleClassification: opts.roleClassification,
      conditionAnalysis: opts.conditionAnalysis,
      ecoSwapPoints: opts.ecoSwapPoints,
      inferenceMs: 1200 + Math.floor(Math.random() * 4000),
      modelVersion: "EcoSwap-Heritage-CNN v1.2",
      openForBarter: opts.openForBarter,
      ownerName: opts.openForBarter ? owner.name : null,
      ownerCity: opts.openForBarter ? owner.city : null,
      swapDescription: opts.swapDescription ?? null,
      wantedItem: opts.wantedItem ?? null,
      publishedAt: opts.openForBarter ? formatDate(opts.daysAgo) : null,
      createdAt: formatDate(opts.daysAgo + 1),
    });

    opts.predLabels.forEach((label, i) => {
      predictions.push({
        id: cuid(),
        appraisalId: id,
        label,
        probability: opts.predProbs[i] ?? 0,
        rank: i + 1,
      });
    });
  };

  // Confirm function signature: add(opts, ownerIdx)
  // Heritage Tinggi (0–10)
  add({ detectedObject: "Batik Tulis Pekalongan — Motif Parang", confidenceScore: 98.5, roleClassification: "High Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 520, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 2, swapDescription: "Batik warisan nenek, motif parang klasik.", wantedItem: "Ukiran kayu Jepara atau keramik tradisional", predLabels: ["Batik Tulis", "Tenun Ikat", "Songket"], predProbs: [98.5, 1.0, 0.5] }, 0);
  add({ detectedObject: "Ukiran Jepara Antik — Relief Flora", confidenceScore: 91.8, roleClassification: "High Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 410, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 5, swapDescription: "Ukiran kayu jati motif flora.", wantedItem: "Batik tulis atau tenun ikat NTT", predLabels: ["Ukiran Kayu", "Anyaman Bambu", "Keramik"], predProbs: [91.8, 5.2, 3.0] }, 1);
  add({ detectedObject: "Tenun Ikat Sumba — Motif Khas Timur", confidenceScore: 94.2, roleClassification: "High Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 480, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 3, swapDescription: "Tenun ikat asli Sumba motif khas.", wantedItem: "Batik tulis Pekalongan atau ukiran", predLabels: ["Tenun Ikat", "Songket", "Batik Tulis"], predProbs: [94.2, 3.5, 2.3] }, 2);
  add({ detectedObject: "Songket Palembang — Benang Emas", confidenceScore: 96.1, roleClassification: "High Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 550, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 1, swapDescription: "Songket Palembang asli benang emas.", wantedItem: "Keramik tradisional atau batik tulis", predLabels: ["Songket Palembang", "Tenun Ikat", "Batik Tulis"], predProbs: [96.1, 2.4, 1.5] }, 1);
  add({ detectedObject: "Wayang Golek — Tokoh Punakawan", confidenceScore: 88.7, roleClassification: "High Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 360, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 7, swapDescription: "Wayang golek kayu ukiran halus.", wantedItem: "Gamelan atau angklung", predLabels: ["Wayang Golek", "Topeng", "Ukiran"], predProbs: [88.7, 7.5, 3.8] }, 4);
  add({ detectedObject: "Gamelan Jawa — Set Slendro & Pelog", confidenceScore: 92.3, roleClassification: "High Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 620, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 10, swapDescription: "Set gamelan komplit.", wantedItem: "Batik tulis atau tenun ikat", predLabels: ["Gamelan", "Angklung", "Wayang"], predProbs: [92.3, 4.5, 3.2] }, 5);
  add({ detectedObject: "Topeng Tradisional — Tari Klasik", confidenceScore: 85.9, roleClassification: "High Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 310, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 4, swapDescription: "Topeng kayu untuk tari klasik.", wantedItem: "Wayang atau angklung", predLabels: ["Topeng Tradisional", "Wayang Golek", "Ukiran"], predProbs: [85.9, 8.5, 5.6] }, 6);
  add({ detectedObject: "Angklung — Set 5 Nada", confidenceScore: 84.1, roleClassification: "High Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 280, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 8, swapDescription: "Angklung bambu set 5 nada.", wantedItem: "Wayang atau topeng", predLabels: ["Angklung", "Gamelan", "Karinding"], predProbs: [84.1, 10.2, 5.7] }, 7);
  add({ detectedObject: "Batik Tulis Cirebon — Motif Mega Mendung", confidenceScore: 93.7, roleClassification: "High Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 490, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 6, swapDescription: "Batik tulis motif mega mendung.", wantedItem: "Songket atau tenun ikat", predLabels: ["Batik Tulis", "Songket", "Tenun Ikat"], predProbs: [93.7, 3.8, 2.5] }, 8);
  add({ detectedObject: "Kain Songket Lombok — Tenun Tradisional", confidenceScore: 90.5, roleClassification: "High Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 445, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 12, swapDescription: "Songket lombok motif Sasak.", wantedItem: "Batik tulis atau keramik", predLabels: ["Songket", "Tenun Ikat", "Batik"], predProbs: [90.5, 6.0, 3.5] }, 9);
  add({ detectedObject: "Reog Ponorogo — Singo Barong", confidenceScore: 87.2, roleClassification: "High Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 390, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 15, swapDescription: "Topeng reog barongan mini.", wantedItem: "Gamelan atau wayang", predLabels: ["Reog", "Topeng", "Wayang"], predProbs: [87.2, 7.8, 5.0] }, 10);
  add({ detectedObject: "Batik Pekalongan — Motif Jlamprang", confidenceScore: 95.8, roleClassification: "High Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 510, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 9, swapDescription: "Batik pekalongan motif jlamprang.", wantedItem: "Ukiran Jepara atau anyaman", predLabels: ["Batik Tulis", "Tenun", "Songket"], predProbs: [95.8, 2.5, 1.7] }, 11);

  // Heritage Medium (12–21)
  add({ detectedObject: "Keramik Tradisional Kasongan", confidenceScore: 87.3, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 340, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 3, swapDescription: "Gerabah Kasongan kualitas ekspor.", wantedItem: "Songket Palembang", predLabels: ["Keramik Tradisional", "Anyaman Bambu", "Gerabah"], predProbs: [87.3, 8.0, 4.7] }, 2);
  add({ detectedObject: "Anyaman Bambu Tasikmalaya", confidenceScore: 82.4, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 290, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 6, swapDescription: "Anyaman bambu asli Tasikmalaya.", wantedItem: "Keramik atau gerabah", predLabels: ["Anyaman Bambu", "Keramik Tradisional", "Ukiran Kayu"], predProbs: [82.4, 10.0, 7.6] }, 12);
  add({ detectedObject: "Gerabah Tradisional — Guci Air", confidenceScore: 79.8, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 230, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 14, swapDescription: "Guci gerabah tradisional.", wantedItem: "Anyaman bambu", predLabels: ["Gerabah", "Keramik", "Anyaman"], predProbs: [79.8, 12.5, 7.7] }, 13);
  add({ detectedObject: "Wayang Kulit — Tokoh Arjuna", confidenceScore: 86.1, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 325, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 11, swapDescription: "Wayang kulit tokoh Arjuna.", wantedItem: "Batik atau tenun", predLabels: ["Wayang Kulit", "Wayang Golek", "Topeng"], predProbs: [86.1, 8.0, 5.9] }, 14);
  add({ detectedObject: "Vas Keramik — Hiasan Tradisional", confidenceScore: 76.5, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 190, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 20, swapDescription: "Vas keramik buatan tangan.", wantedItem: "Anyaman bambu atau gerabah", predLabels: ["Vas Keramik", "Gerabah", "Keramik"], predProbs: [76.5, 14.0, 9.5] }, 3);
  add({ detectedObject: "Karpet Tenun — Motif Nusantara", confidenceScore: 81.3, roleClassification: "Medium Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 270, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 18, swapDescription: "Karpet tenun motif Nusantara.", wantedItem: "Batik atau songket", predLabels: ["Karpet Tenun", "Tenun Ikat", "Songket"], predProbs: [81.3, 11.0, 7.7] }, 0);
  add({ detectedObject: "Dekorasi Dinding — Ukir Khas Bali", confidenceScore: 83.7, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 250, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 22, swapDescription: "Hiasan dinding ukiran Bali.", wantedItem: "Anyaman atau gerabah", predLabels: ["Dekorasi Ukiran", "Topeng", "Wayang"], predProbs: [83.7, 9.0, 7.3] }, 4);
  add({ detectedObject: "Lampu Hias — Bambu Anyaman", confidenceScore: 77.2, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 185, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 25, swapDescription: "Lampu hias dari anyaman bambu.", wantedItem: "Gerabah atau keramik", predLabels: ["Lampu Anyaman", "Anyaman Bambu", "Dekorasi"], predProbs: [77.2, 15.0, 7.8] }, 5);
  add({ detectedObject: "Cermin Ukir — Frame Tradisional", confidenceScore: 74.9, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 210, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 16, swapDescription: "Cermin hias frame ukiran jati.", wantedItem: "Keramik atau anyaman", predLabels: ["Cermin Ukir", "Ukiran Kayu", "Dekorasi"], predProbs: [74.9, 16.0, 9.1] }, 6);
  add({ detectedObject: "Kursi Tamu — Ukir Jati", confidenceScore: 85.0, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 350, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 13, swapDescription: "Set kursi tamu ukiran jati.", wantedItem: "Batik atau tenun ikat", predLabels: ["Kursi Ukiran", "Meja Jati", "Furniture"], predProbs: [85.0, 8.5, 6.5] }, 7);

  // Elektronik (22–33)
  add({ detectedObject: "Laptop — ThinkPad T480 Bekas", confidenceScore: 94.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Layak Pakai", ecoSwapPoints: 300, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 1, swapDescription: "ThinkPad T480, i5 gen 8.", wantedItem: "Smartphone atau kamera", predLabels: ["Laptop Bekas", "Elektronik", "Aksesoris"], predProbs: [94.5, 4.0, 1.5] }, 8);
  add({ detectedObject: "Smartphone — Samsung Galaxy S22", confidenceScore: 96.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 400, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 4, swapDescription: "Samsung Galaxy S22 garansi resmi.", wantedItem: "Kamera mirrorless atau laptop", predLabels: ["Smartphone", "Elektronik", "Aksesoris"], predProbs: [96.0, 3.0, 1.0] }, 9);
  add({ detectedObject: "Kamera DSLR — Canon EOS 700D", confidenceScore: 93.8, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 450, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 7, swapDescription: "Canon EOS 700D lensa kit.", wantedItem: "Smartphone flagship atau laptop", predLabels: ["Kamera DSLR", "Lensa Kamera", "Elektronik"], predProbs: [93.8, 3.5, 2.7] }, 10);
  add({ detectedObject: "Headphone — Sony WH-1000XM4", confidenceScore: 95.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 200, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 2, swapDescription: "Sony WH-1000XM4 noise cancelling.", wantedItem: "Speaker bluetooth atau smartwatch", predLabels: ["Headphone", "Elektronik", "Aksesoris"], predProbs: [95.5, 3.0, 1.5] }, 0);
  add({ detectedObject: "Speaker Bluetooth — JBL Flip 6", confidenceScore: 94.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 150, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 5, swapDescription: "JBL Flip 6 suara bass mantap.", wantedItem: "Headphone atau smartwatch", predLabels: ["Speaker Bluetooth", "Headphone", "Elektronik"], predProbs: [94.0, 3.8, 2.2] }, 11);
  add({ detectedObject: "Rice Cooker — Miyako 1.8L", confidenceScore: 92.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 85, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 8, swapDescription: "Rice cooker Miyako 1.8L.", wantedItem: "Blender atau kipas angin", predLabels: ["Rice Cooker", "Peralatan Dapur", "Elektronik"], predProbs: [92.0, 5.5, 2.5] }, 12);
  add({ detectedObject: "Kipas Angin — Maspion Berdiri", confidenceScore: 91.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 65, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 12, swapDescription: "Kipas angin Maspion 3 kecepatan.", wantedItem: "Rice cooker atau blender", predLabels: ["Kipas Angin", "Peralatan Rumah", "Elektronik"], predProbs: [91.0, 6.0, 3.0] }, 13);
  add({ detectedObject: "Microwave — Sharp R-21ATE", confidenceScore: 90.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Layak Pakai", ecoSwapPoints: 145, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 9, swapDescription: "Microwave Sharp 21L.", wantedItem: "Rice cooker atau kipas", predLabels: ["Microwave", "Peralatan Dapur", "Elektronik"], predProbs: [90.5, 6.0, 3.5] }, 14);
  add({ detectedObject: "TV LED — Samsung 32 Inci", confidenceScore: 94.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 300, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 10, swapDescription: "TV LED Samsung 32 inci HD.", wantedItem: "Speaker atau laptop", predLabels: ["TV LED", "Monitor", "Elektronik"], predProbs: [94.0, 3.5, 2.5] }, 1);
  add({ detectedObject: "Blender — Philips HR2118", confidenceScore: 88.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 75, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 15, swapDescription: "Blender Philips 2 gelas.", wantedItem: "Rice cooker atau kipas", predLabels: ["Blender", "Peralatan Dapur", "Elektronik"], predProbs: [88.5, 7.5, 4.0] }, 2);
  add({ detectedObject: "Laptop — MacBook Air M1", confidenceScore: 96.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 620, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 3, swapDescription: "MacBook Air M1 2020.", wantedItem: "Kamera mirrorless atau smartphone flagship", predLabels: ["MacBook", "Laptop Bekas", "Elektronik"], predProbs: [96.0, 2.5, 1.5] }, 3);
  add({ detectedObject: "Smartwatch — Apple Watch Series 8", confidenceScore: 93.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 250, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 6, swapDescription: "Apple Watch Series 8 45mm.", wantedItem: "Headphone premium atau speaker", predLabels: ["Smartwatch", "Jam Tangan", "Aksesoris"], predProbs: [93.5, 3.5, 3.0] }, 4);

  // Kendaraan (34–39)
  add({ detectedObject: "Mobil Bekas — Toyota Agya 2019", confidenceScore: 96.2, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 400, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 2, swapDescription: "Toyota Agya 2019 manual.", wantedItem: "Mobil keluarga atau motor besar", predLabels: ["Mobil Bekas", "Kendaraan", "Aksesoris Mobil"], predProbs: [96.2, 2.5, 1.3] }, 5);
  add({ detectedObject: "Motor Bekas — Honda Vario 125", confidenceScore: 95.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 240, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 5, swapDescription: "Honda Vario 125 2021.", wantedItem: "Smartphone flagship atau laptop", predLabels: ["Motor Matic", "Kendaraan", "Aksesoris Motor"], predProbs: [95.0, 3.0, 2.0] }, 6);
  add({ detectedObject: "Sepeda Gunung — Polygon Xtrada 7", confidenceScore: 93.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 180, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 8, swapDescription: "Polygon Xtrada 7 frame alloy.", wantedItem: "Smartwatch atau headphone", predLabels: ["Sepeda Gunung", "Sepeda", "Aksesoris"], predProbs: [93.0, 4.5, 2.5] }, 7);
  add({ detectedObject: "Skuter Listrik — Xiaomi M365", confidenceScore: 91.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 145, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 11, swapDescription: "Xiaomi M365 skuter listrik.", wantedItem: "Sepeda atau smartwatch", predLabels: ["Skuter Listrik", "Kendaraan", "Elektronik"], predProbs: [91.5, 5.0, 3.5] }, 8);
  add({ detectedObject: "Mobil Bekas — Daihatsu Xenia 2018", confidenceScore: 95.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 430, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 14, swapDescription: "Daihatsu Xenia 2018 7 seater.", wantedItem: "Mobil city car atau motor besar", predLabels: ["Mobil Keluarga", "Kendaraan", "Aksesoris Mobil"], predProbs: [95.5, 2.5, 2.0] }, 9);
  add({ detectedObject: "Sepeda Lipat — Pacific Orbit", confidenceScore: 90.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 125, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 17, swapDescription: "Sepeda lipat Pacific Orbit 16 inch.", wantedItem: "Skuter listrik atau smartwatch", predLabels: ["Sepeda Lipat", "Sepeda", "Aksesoris"], predProbs: [90.0, 6.5, 3.5] }, 10);

  // Fashion & Aksesoris (40–46)
  add({ detectedObject: "Jaket Kulit — Pria Vintage", confidenceScore: 92.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 150, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 3, swapDescription: "Jaket kulit asli model vintage.", wantedItem: "Tas atau sepatu", predLabels: ["Jaket Kulit", "Fashion", "Aksesoris"], predProbs: [92.5, 4.5, 3.0] }, 11);
  add({ detectedObject: "Tas Ransel — Timbuk2 Classic", confidenceScore: 93.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 125, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 6, swapDescription: "Tas ransel Timbuk2 kanvas.", wantedItem: "Jaket atau jam tangan", predLabels: ["Tas Ransel", "Tas", "Fashion"], predProbs: [93.0, 4.0, 3.0] }, 12);
  add({ detectedObject: "Sepatu Sneakers — Nike Air Max", confidenceScore: 94.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 170, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 9, swapDescription: "Nike Air Max ukuran 42.", wantedItem: "Jam tangan atau tas", predLabels: ["Sepatu Sneakers", "Fashion", "Aksesoris"], predProbs: [94.5, 3.5, 2.0] }, 13);
  add({ detectedObject: "Jam Tangan — Seiko 5 Automatic", confidenceScore: 95.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 300, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 4, swapDescription: "Seiko 5 automatic sapphire crystal.", wantedItem: "Smartwatch atau headphone", predLabels: ["Jam Tangan", "Aksesoris", "Fashion"], predProbs: [95.0, 3.0, 2.0] }, 14);
  add({ detectedObject: "Tas Selempang — Kulit Asli", confidenceScore: 90.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 100, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 7, swapDescription: "Tas selempang kulit asli.", wantedItem: "Sepatu atau jaket", predLabels: ["Tas Kulit", "Aksesoris", "Fashion"], predProbs: [90.0, 6.0, 4.0] }, 0);
  add({ detectedObject: "Kemeja Batik — Pria Dewasa L", confidenceScore: 89.5, roleClassification: "Medium Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 100, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 10, swapDescription: "Kemeja batik pria ukuran L.", wantedItem: "Celana atau sepatu", predLabels: ["Kemeja Batik", "Batik", "Fashion"], predProbs: [89.5, 7.0, 3.5] }, 1);
  add({ detectedObject: "Syal Batik — Sutra Halus", confidenceScore: 87.5, roleClassification: "Medium Heritage Value", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 85, imagePath: pickHeritageImage(), openForBarter: true, daysAgo: 12, swapDescription: "Syal batik sutra halus.", wantedItem: "Tas atau perhiasan", predLabels: ["Syal Batik", "Batik", "Fashion"], predProbs: [87.5, 8.0, 4.5] }, 2);

  // Furniture & Rumah (47–54)
  add({ detectedObject: "Meja Kayu Jati — Ruang Makan", confidenceScore: 92.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 250, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 5, swapDescription: "Meja kayu jati solid 1.5x0.8m.", wantedItem: "Kursi atau lemari", predLabels: ["Meja Kayu", "Furniture", "Dekorasi"], predProbs: [92.0, 5.0, 3.0] }, 3);
  add({ detectedObject: "Lemari Pakaian — 3 Pintu", confidenceScore: 91.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 300, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 8, swapDescription: "Lemari pakaian 3 pintu jati.", wantedItem: "Meja atau kasur", predLabels: ["Lemari Pakaian", "Furniture", "Dekorasi"], predProbs: [91.0, 6.0, 3.0] }, 4);
  add({ detectedObject: "Kasur Busa — Inoac 180x200", confidenceScore: 89.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 180, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 10, swapDescription: "Kasur busa Inoac king size.", wantedItem: "Lemari atau meja", predLabels: ["Kasur Busa", "Furniture", "Perlengkapan Rumah"], predProbs: [89.5, 6.5, 4.0] }, 5);
  add({ detectedObject: "Rak Buku — Minimalis 5 Susun", confidenceScore: 90.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 100, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 15, swapDescription: "Rak buku minimalis 5 susun.", wantedItem: "Meja atau kursi", predLabels: ["Rak Buku", "Furniture", "Dekorasi"], predProbs: [90.0, 6.0, 4.0] }, 6);
  add({ detectedObject: "Sofa — 2 Seater Fabric", confidenceScore: 92.5, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 220, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 12, swapDescription: "Sofa 2 seater kain abu-abu.", wantedItem: "Meja tamu atau lemari", predLabels: ["Sofa", "Furniture", "Dekorasi"], predProbs: [92.5, 4.5, 3.0] }, 7);
  add({ detectedObject: "Lemari Buku — Kaca Sliding", confidenceScore: 89.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Baik", ecoSwapPoints: 170, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 18, swapDescription: "Lemari buku pintu kaca sliding.", wantedItem: "Meja kerja atau kursi", predLabels: ["Lemari Buku", "Furniture", "Dekorasi"], predProbs: [89.0, 7.0, 4.0] }, 8);
  add({ detectedObject: "Set Meja & Kursi Teras — Rotan", confidenceScore: 86.5, roleClassification: "Medium Heritage Value", conditionAnalysis: "Baik", ecoSwapPoints: 190, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 20, swapDescription: "Set meja dan 2 kursi rotan.", wantedItem: "Anyaman bambu atau keramik", predLabels: ["Meja Rotan", "Furniture", "Anyaman"], predProbs: [86.5, 8.0, 5.5] }, 9);
  add({ detectedObject: "Karpet Permadani — motif Geometris", confidenceScore: 88.0, roleClassification: "Low Heritage — Circular Asset", conditionAnalysis: "Sangat Baik", ecoSwapPoints: 125, imagePath: pickGeneralImage(), openForBarter: true, daysAgo: 22, swapDescription: "Karpet permadani motif geometris.", wantedItem: "Bantal hias atau lampu", predLabels: ["Karpet", "Dekorasi", "Tekstil"], predProbs: [88.0, 7.0, 5.0] }, 10);

  return { appraisals, predictions };
}

// Build Barter Proposals
function buildProposals(
  appraisals: SeedAppraisal[],
  userIds: string[],
): { proposals: any[]; messages: any[] } {
  const proposals: any[] = [];
  const messages: any[] = [];
  const memberIds = userIds.filter((_, i) => i > 0);

  const openItems = appraisals.filter(a => a.openForBarter && a.userId);

  const groupByUser = new Map<string, SeedAppraisal[]>();
  for (const item of openItems) {
    if (!item.userId) continue;
    const list = groupByUser.get(item.userId) ?? [];
    list.push(item);
    groupByUser.set(item.userId, list);
  }

  const userKeys = Array.from(groupByUser.keys());
  if (userKeys.length < 2) return { proposals, messages };

  const pickItems = (idx: number) => groupByUser.get(userKeys[idx % userKeys.length]) ?? [];
  const rng = (max: number) => Math.floor((_counter * 7919 + 1) % max);

  function addProposal(
    proposerIdx: number,
    targetIdx: number,
    status: string,
    msg: string,
    days: number,
    respondDays?: number,
    completeDays?: number,
  ): string | null {
    const pItems = pickItems(proposerIdx);
    const tItems = pickItems(targetIdx);
    if (!pItems.length || !tItems.length) return null;

    const offered = pItems[rng(pItems.length)];
    const requested = tItems[rng(tItems.length)];
    if (!offered || !requested) return null;

    const id = cuid();
    const proposal = {
      id,
      proposerUserId: offered.userId,
      offeredAppraisalId: offered.id,
      requestedAppraisalId: requested.id,
      message: msg,
      status,
      respondedAt: respondDays != null ? formatDate(respondDays) : null,
      completedAt: completeDays != null ? formatDate(completeDays) : null,
      createdAt: formatDate(days),
      updatedAt: formatDate(days),
    };
    proposals.push(proposal);

    if (status === "COMPLETED") {
      // Mark appraisals as no longer open
      const oIdx = appraisals.findIndex(a => a.id === offered.id);
      const rIdx = appraisals.findIndex(a => a.id === requested.id);
      if (oIdx >= 0) { appraisals[oIdx].openForBarter = false; appraisals[oIdx].publishedAt = null; }
      if (rIdx >= 0) { appraisals[rIdx].openForBarter = false; appraisals[rIdx].publishedAt = null; }
    }

    return id;
  }

  // Completed
  addProposal(0, 1, "COMPLETED", "Barang sampai dengan selamat, terima kasih!", 30, 25, 20);
  addProposal(1, 2, "COMPLETED", "Tukar sukses, cocok sama-sama suka.", 28, 24, 18);
  addProposal(2, 3, "COMPLETED", "Sudah deal dan ketemuan di Bandung.", 25, 22, 15);
  addProposal(3, 4, "COMPLETED", "Proses barter lancar, barang sesuai foto.", 22, 18, 12);
  addProposal(4, 5, "COMPLETED", "Mantap, dikirim lewat JNE.", 20, 16, 10);
  addProposal(5, 6, "COMPLETED", "COD di Jakarta Pusat, barang oke.", 18, 14, 8);
  addProposal(6, 7, "COMPLETED", "Pertukaran berhasil, recommended seller!", 15, 12, 7);
  addProposal(7, 0, "COMPLETED", "Saling kirim via ekspedisi, semua aman.", 12, 9, 5);
  // Pending
  addProposal(0, 2, "PENDING", "Apakah masih available? Saya tertukar.", 5);
  addProposal(1, 3, "PENDING", "Boleh diskusi via WhatsApp?", 4);
  addProposal(2, 4, "PENDING", "Mau tawar dengan barang saya yang lain.", 3);
  addProposal(5, 0, "PENDING", "Tertarik, bisa ketemu di Jogja?", 2);
  addProposal(3, 1, "PENDING", "Saya punya alternatif barang lain.", 1);
  // Accepted
  addProposal(1, 4, "ACCEPTED", "Ok deal! Siap kirim besok.", 10, 7);
  addProposal(2, 5, "ACCEPTED", "Setuju tukar, alamat sudah saya kirim.", 8, 6);
  addProposal(3, 6, "ACCEPTED", "Deal! Jumat depan ketemuan ya.", 6, 4);
  addProposal(4, 7, "ACCEPTED", "Sip, sama-sama setuju. Dikirim hari ini.", 9, 5);
  // Rejected
  addProposal(2, 0, "REJECTED", "Maaf, barang sudah ditukar dengan yang lain.", 14, 12);
  addProposal(5, 1, "REJECTED", "Mohon maaf, tidak sesuai ekspektasi.", 11, 9);
  addProposal(6, 2, "REJECTED", "Sudah ada yang ngambil duluan.", 7, 5);
  // Cancelled
  addProposal(0, 6, "CANCELLED", "Maaf, saya batalkan dulu ya.", 8, 6);
  addProposal(4, 0, "CANCELLED", "Ternyata butuh uang tunai, jadinya dijual.", 6, 4);

  // Generate messages for each proposal
  const templates: Record<string, { sender: string; text: string }[]> = {
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

  for (const proposal of proposals) {
    const template = templates[proposal.status] ?? templates.PENDING;
    const proposerId = proposal.proposerUserId;
    // Find the requested appraisal to get the owner user ID
    const requestedAppraisal = appraisals.find(a => a.id === proposal.requestedAppraisalId);
    const recipientId = requestedAppraisal?.userId ?? memberIds[0];

    const baseDays = Math.round(
      (Date.now() - new Date(proposal.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    template.forEach((msg, i) => {
      const senderId = msg.sender === "proposer" ? proposerId : recipientId;
      messages.push({
        id: cuid(),
        proposalId: proposal.id,
        senderId,
        message: msg.text,
        createdAt: formatDate(Math.max(0, baseDays - i * 2)),
      });
    });
  }

  return { proposals, messages };
}

// ─── Main ─────────────────────────────────────────────────────────────────

function main() {
  console.log("📦 Generating EcoSwap seed data...");

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  // Generate users
  const users = buildUsers();
  const userIds = users.map(u => u.id);
  writeFileSync(path.join(DATA_DIR, "users.json"), JSON.stringify(users, null, 2));
  console.log(`✅ users.json (${users.length} users)`);

  // Generate heritage items
  const heritageItems = buildHeritageItems();
  writeFileSync(path.join(DATA_DIR, "heritage-items.json"), JSON.stringify(heritageItems, null, 2));
  console.log(`✅ heritage-items.json (${heritageItems.length} items)`);

  // Generate appraisals & predictions
  const { appraisals, predictions } = buildAppraisals(userIds);
  writeFileSync(path.join(DATA_DIR, "appraisals.json"), JSON.stringify(appraisals, null, 2));
  writeFileSync(path.join(DATA_DIR, "appraisal-predictions.json"), JSON.stringify(predictions, null, 2));
  console.log(`✅ appraisals.json (${appraisals.length} appraisals)`);
  console.log(`✅ appraisal-predictions.json (${predictions.length} predictions)`);

  // Generate proposals & messages
  const { proposals, messages } = buildProposals(appraisals, userIds);
  writeFileSync(path.join(DATA_DIR, "barter-proposals.json"), JSON.stringify(proposals, null, 2));
  writeFileSync(path.join(DATA_DIR, "barter-messages.json"), JSON.stringify(messages, null, 2));
  console.log(`✅ barter-proposals.json (${proposals.length} proposals)`);
  console.log(`✅ barter-messages.json (${messages.length} messages)`);

  console.log("\n🎉 Seed data generated successfully!");
}

main();
