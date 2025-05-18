import { Suspense } from "react";
import ResultContent from "../components/ResultContent";

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
