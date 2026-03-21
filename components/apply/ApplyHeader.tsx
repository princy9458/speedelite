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
    <header className="relative z-50 bg-[#131313]/40 backdrop-blur-2xl transition-all duration-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 font-medium">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex items-center gap-2.5">
            <Image
              src="/website/se_logo.png"
              alt=""
              width={40}
              height={40}
              className="h-8 w-auto object-contain brightness-0 invert opacity-90 group-hover:scale-110 transition-transform duration-500"
              priority
            />
            <span className="text-2xl font-serif tracking-tight bg-gradient-to-br from-[#D4AF37] via-[#F2CA50] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-500">
              {t.common.brand}
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-8">
          <span className="hidden text-[10px] uppercase tracking-[0.4em] text-[#E5E2E1]/40 font-bold sm:block">
            {t.common.application}
          </span>
          
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 p-1 px-1.5">
            {(["hr", "en"] as AppLanguage[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLanguage(code)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-500",
                  lang === code 
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                    : "text-[#E5E2E1]/40 hover:text-[#E5E2E1] hover:bg-white/5"
                )}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
