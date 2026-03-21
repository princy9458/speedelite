<<<<<<< HEAD
import { Check } from "lucide-react";
=======
import { CheckCircle2 } from "lucide-react";
>>>>>>> 31490afb0a8ab539e02129142ec0b15d0a9b92fe
import { cn } from "@/lib/utils";

type ProgressStepsProps = {
  steps: readonly string[];
  currentStep: number;
};

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
<<<<<<< HEAD
    <div className="relative mx-auto w-full max-w-4xl px-10 py-8">
      {/* Background Line */}
      <div className="absolute top-[52px] left-[60px] right-[60px] h-[1px] bg-white/10" />
      
      {/* Active Line (Gradient) */}
      <div 
        className="absolute top-[52px] left-[60px] right-[60px] overflow-hidden transition-all duration-700 ease-in-out"
        style={{ 
          width: `calc((${((currentStep - 1) / (steps.length - 1)) * 100}%))` 
        }}
      >
        <div className="h-[1px] w-[200%] bg-[linear-gradient(to_right,#D4AF37,#C9A227)] shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
      </div>

      <div className="relative flex justify-between items-start w-full">
=======
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
>>>>>>> 31490afb0a8ab539e02129142ec0b15d0a9b92fe
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
<<<<<<< HEAD
            <div key={step} className="flex flex-col items-center z-10">
              {/* Step Circle */}
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] transition-all duration-500",
                  isComplete
                    ? "border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : isActive
                    ? "border-[#D4AF37] bg-[rgba(212,175,55,0.15)] text-[#F2CA50] shadow-[0_0_25px_rgba(212,175,55,0.3)]"
                    : "border-white/5 bg-white/[0.03] text-[#E5E2E1]/20"
                )}
              >
                {isComplete ? (
                  <Check className="h-5 w-5 stroke-[3.5px]" />
                ) : (
                  <span className="text-[14px] font-bold tracking-tight font-serif">{stepNumber}</span>
                )}
                
                {isActive && (
                  <div className="absolute -inset-[5px] animate-pulse rounded-full border border-[#D4AF37]/20" />
                )}
              </div>

              {/* Label */}
              <div className="mt-4 flex flex-col items-center">
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-500 text-center",
                    isActive ? "text-[#F2CA50] scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" : isComplete ? "text-[#E5E2E1]/80" : "text-[#E5E2E1]/20"
                  )}
                >
                  {step}
                </span>
                {isActive && (
                  <div className="mt-2 h-0.5 w-4 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                )}
              </div>
=======
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
>>>>>>> 31490afb0a8ab539e02129142ec0b15d0a9b92fe
            </div>
          );
        })}
      </div>
    </div>
  );
}
