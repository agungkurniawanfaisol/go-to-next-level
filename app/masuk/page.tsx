import { Suspense } from "react";
import { MasukPageClient } from "@/components/masuk/MasukPageClient";

function MasukLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
    </div>
  );
}

export default function MasukPage() {
  return (
    <Suspense fallback={<MasukLoading />}>
      <MasukPageClient />
    </Suspense>
  );
}
