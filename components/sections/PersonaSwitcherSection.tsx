"use client";

import { useCallback } from "react";
import { SectionShell } from "@/components/sections/SectionShell";

const personas = [
  {
    id: "member",
    label: "Sebagai Member",
    targetId: "live-demo",
    desc: "Lihat alur upload, dapat poin, lalu barter.",
  },
  {
    id: "admin",
    label: "Sebagai Admin",
    targetId: "stats",
    desc: "Pantau metrik, proposal, dan operasional barter.",
  },
  {
    id: "judge",
    label: "Sebagai Juri",
    targetId: "impact-counter",
    desc: "Fokus dampak, transparansi AI, dan outcome nyata.",
  },
] as const;

export function PersonaSwitcherSection() {
  const jumpTo = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <SectionShell
      id="persona-switcher"
      eyebrow="Demo Persona"
      title="Pilih Sudut Pandang Demo"
      description="Satu klik untuk lompat ke bagian yang paling relevan sesuai peran audiens."
      className="bg-gradient-to-b from-ivory via-forest/5 to-ivory dark:from-[#0f0e0c] dark:via-[#1f3d32]/8 dark:to-[#0f0e0c]"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {personas.map((persona) => (
          <button
            key={persona.id}
            type="button"
            onClick={() => jumpTo(persona.targetId)}
            className="glass-panel rounded-2xl border border-ink/8 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-card"
          >
            <p className="text-sm font-semibold text-forest">{persona.label}</p>
            <p className="mt-2 text-sm text-ink/60">{persona.desc}</p>
          </button>
        ))}
      </div>
    </SectionShell>
  );
}

