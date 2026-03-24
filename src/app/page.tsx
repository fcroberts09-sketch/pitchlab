import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PitchingCoach } from "@/components/PitchingCoach";

export default function Home() {
  return (
    <ErrorBoundary>
      <PitchingCoach />
    </ErrorBoundary>
  );
}
