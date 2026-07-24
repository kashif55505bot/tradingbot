import { Suspense } from 'react';
import AIAnalysisContent from './AIAnalysisContent';
import LoadingState from '@/components/LoadingState';

export default function AIAnalysisPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AIAnalysisContent />
    </Suspense>
  );
}
