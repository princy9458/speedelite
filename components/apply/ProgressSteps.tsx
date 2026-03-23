import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ProgressStepsProps = {
  steps: readonly string[];
  currentStep: number;
};

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 py-12 z-0">
      {/* Background Line */}
      <div className="absolute top-[68px] left-[10%] right-[10%] h-[1px] bg-white/10" />
      
      {/* Active Line (Gradient) */}
      <div 
        className="absolute top-[68px] left-[10%] border-t border-[linear-gradient(to_right,#C9A646,#F6E27A)] transition-all duration-700 ease-in-out z-0"
        style={{ 
          width: `calc(${((currentStep - 1) / (steps.length - 1)) * 80}%)`,
          borderImage: "linear-gradient(to right, #C9A646, #F6E27A) 1"
        }}
      />

      <div className="relative flex justify-between items-start w-full z-10 px-[5%]">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber <= currentStep;

          return (
            <div key={step} className="flex flex-col items-center group">
              {/* Step Circle */}
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-700",
                  isComplete
                    ? "border-[#C9A646] bg-[#C9A646] text-black shadow-[0_0_15px_rgba(201,166,70,0.3)]"
                    : isActive
                    ? "border-[#C9A646] bg-black text-[#F6E27A] shadow-[0_0_20px_rgba(201,166,70,0.2)]"
                    : "border-white/10 bg-[#1a1a1a] text-white/20"
                )}
              >
                {isComplete ? (
                  <Check className="h-5 w-5 stroke-[3px]" />
                ) : (
                  <span className="text-sm font-bold">{stepNumber}</span>
                )}
                
                {isActive && (
                  <div className="absolute -inset-1 animate-pulse rounded-full border border-[#C9A646]/20" />
                )}
              </div>

              {/* Label */}
              <div className="mt-4 flex flex-col items-center min-w-[80px]">
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500",
                    isActive ? "text-[#F6E27A]" : isComplete ? "text-white/60" : "text-white/20"
                  )}
                >
                  {step}
                </span>
                {isActive && (
                   <motion.div 
                     layoutId="activeTab"
                     className="mt-2 h-[2px] w-4 rounded-full bg-[#C9A646] shadow-[0_0_8px_#C9A646]" 
                   />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
