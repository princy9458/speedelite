"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getDictionary, type AppLanguage } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";

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
    <header className="border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/website/se_logo.png"
            alt={t.common.brand}
            width={180}
            height={48}
            className="h-9 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs uppercase tracking-[0.35em] text-white/40 sm:block">
            {t.common.application}
          </span>
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
            {(["hr", "en"] as AppLanguage[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLanguage(code)}
                className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.3em] transition ${
                  lang === code ? "bg-[#d5ad5b] text-black" : "text-white/55 hover:text-white"
                }`}
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
