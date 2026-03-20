import { CheckCircle2 } from "lucide-react";

type ProgressStepsProps = {
  steps: readonly string[];
  currentStep: number;
};

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;
        return (
          <div key={step} className="flex min-w-[86px] flex-1 items-center gap-3 md:flex-none">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm ${
                isComplete
                  ? "border-[#d5ad5b] bg-[#d5ad5b] text-black"
                  : isActive
                  ? "border-[#d5ad5b] bg-[#d5ad5b]/10 text-[#f0ca7d]"
                  : "border-white/10 text-white/30"
              }`}
            >
              {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <span>{stepNumber}</span>}
            </div>
            <div className="space-y-1">
              <span
                className={`block text-[10px] uppercase tracking-[0.28em] ${
                  isActive ? "text-[#f0ca7d]" : "text-white/40"
                }`}
              >
                {step}
              </span>
              <div className="hidden h-px w-14 bg-white/10 md:block" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
