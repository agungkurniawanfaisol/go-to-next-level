import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default function AdminSettingsPage() {
  return (
    <>
      <AdminTopBar
        title="Pengaturan"
        description="Konfigurasi model CNN & platform (demo)"
      />
      <div className="max-w-xl space-y-6 p-6 lg:p-8 dark:text-[#f0ebe3]">
        <fieldset className="glass-panel rounded-2xl border border-ink/8 bg-surface/80 p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Model CNN
          </legend>
          <label className="mt-4 block text-sm text-ink/70">
            Durasi scanning (detik)
            <input
              type="number"
              defaultValue={2}
              disabled
              className="mt-1 w-full rounded-lg border border-ink/20 bg-ivory px-3 py-2 text-ink opacity-70"
            />
          </label>
          <label className="mt-4 block text-sm text-ink/70">
            Threshold confidence (%)
            <input
              type="number"
              defaultValue={85}
              disabled
              className="mt-1 w-full rounded-lg border border-ink/20 bg-ivory px-3 py-2 text-ink opacity-70"
            />
          </label>
        </fieldset>
        <p className="text-xs text-ink/50">
          Pengaturan dinonaktifkan pada mode demo lomba.
        </p>
      </div>
    </>
  );
}
