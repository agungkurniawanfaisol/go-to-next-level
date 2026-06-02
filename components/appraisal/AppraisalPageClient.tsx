"use client";

import { AI_Appraisal } from "@/components/AI_Appraisal";
import { HowOurAIWorks } from "@/components/appraisal/HowOurAIWorks";

export function AppraisalPageClient({ userName }: { userName: string | null }) {
  return (
    <>
      <div className="mt-10">
        <AI_Appraisal userName={userName} />
      </div>
      <HowOurAIWorks />
    </>
  );
}
