import ResultContent from "@/components/ResultContent";
import { Suspense } from "react";


export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
