"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ApplyHeader() {
  const t = useTranslations('common');

  return (
    <header className="relative z-50 py-8" style={{ background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.15), transparent 60%)" }}>
      <div className="mx-auto max-w-7xl px-6 relative flex items-center min-h-[60px]">
        {/* Left Section: APPLICATION text */}
        <div className="flex-1 hidden sm:block">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold whitespace-nowrap">
            {t('application')}
          </span>
        </div>

        {/* Center Section: Logo (Absolute Centering) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center gap-[12px] whitespace-nowrap">
            {/* <Image
              src="/website/se_logo.png"
              alt="SpeedElite"
              width={44}
              height={44}
              className="object-contain"
            /> */}
          <img src="/Images/se_logo.png" alt="logo" className=" h-10"></img>
            
            {/* TEXT (WHITE ONLY) */}
           
          </Link>
        </div>
        
        {/* Right Section: Language Switcher */}
        <div className="flex-1 flex justify-end">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
