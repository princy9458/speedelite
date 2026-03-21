import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ProgressStepsProps = {
  steps: readonly string[];
  currentStep: number;
};

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 py-8">
      {/* Connecting Lines Container */}
      <div className="absolute left-0 right-0 top-[60px] flex items-center justify-between px-[10%]">
        {steps.slice(0, -1).map((_, i) => (
          <div
            key={`line-${i}`}
            className={cn(
              "h-[1px] flex-1 transition-colors duration-500",
              i + 1 < currentStep ? "bg-[#d5ad5b]" : "bg-white/10"
            )}
          />
        ))}
      </div>

      <div className="relative flex items-start justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
            <div key={step} className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500",
                  isComplete
                    ? "border-[#d5ad5b] bg-[#d5ad5b] text-black shadow-[0_0_15px_rgba(213,173,91,0.3)]"
                    : isActive
                    ? "border-[#d5ad5b] bg-black text-[#f0ca7d] shadow-[0_0_20px_rgba(213,173,91,0.2)]"
                    : "border-white/20 bg-black/40 text-white/30"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
                ) : (
                  <span className="text-sm font-bold tracking-tighter">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "mt-4 block text-[11px] font-medium uppercase tracking-[0.25em] transition-colors duration-500",
                  isActive ? "text-[#f0ca7d]" : isComplete ? "text-white/80" : "text-white/30"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
