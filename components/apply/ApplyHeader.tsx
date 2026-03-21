"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getDictionary, type AppLanguage } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { cn } from "@/lib/utils";

export default function ApplyHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, role, setLang } = useBookingStore();
  const t = getDictionary(lang);

  const switchLanguage = (nextLang: AppLanguage) => {
    setLang(nextLang);
    if (pathname === "/apply/select-event") {
      const roleParam = role ? `&role=${role}` : "";
      router.replace(`/apply/select-event?lang=${nextLang}${roleParam}`);
    }
  };

  return (
    <header className="relative z-50 py-8" style={{ background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.15), transparent 60%)" }}>
      <div className="mx-auto max-w-7xl px-6 relative flex items-center justify-between">
        {/* Left Spacing for balance (if needed) or App Text */}
        <div className="hidden sm:block w-32">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">
            {t.common.application}
          </span>
        </div>

        {/* Logo Group */}
        <div className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center pt-[12px]">
          <Link href="/" className="flex items-center gap-[12px]">
            <Image
              src="/website/se_logo.png"
              alt="SpeedElite"
              width={44}
              height={44}
              className="object-contain"
            />
            
            {/* TEXT (WHITE ONLY) */}
            <span 
              style={{ 
                fontSize: "30px",
                fontFamily: "serif",
                color: "#FFFFFF",
                fontWeight: 500,
                letterSpacing: "0.5px"
              }}
            >
              SpeedElite
            </span>
          </Link>
        </div>
        
        {/* Language Switcher */}
        <div className="flex items-center gap-2 rounded-full bg-white/[0.03] p-1 border border-white/5">
          {(["hr", "en"] as AppLanguage[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => switchLanguage(code)}
              className={cn(
                "rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500",
                lang === code 
                  ? "bg-[linear-gradient(135deg,#C9A646,#F6E27A)] text-black shadow-[0_0_15px_rgba(201,166,70,0.4)]" 
                  : "text-white/30 hover:text-white/60 hover:bg-white/5"
              )}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
