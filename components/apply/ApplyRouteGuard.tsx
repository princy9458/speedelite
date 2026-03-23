"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { Loader2 } from "lucide-react";

const STEPS = [
  "/apply/select-event",
  "/apply/form",
  "/apply/payment",
  "/apply/verification",
  "/apply/confirmation",
];

export default function ApplyRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { eventId, formData, confirmation } = useBookingStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Basic guard logic
    const path = pathname.replace(/^\/[a-z]{2}/, ""); // Remove locale prefix if present

    if (path === "/apply/form" && !eventId) {
      router.replace("/apply/select-event");
      return;
    }

    if (path === "/apply/payment" && (!eventId || !formData.email)) {
      router.replace(eventId ? "/apply/form" : "/apply/select-event");
      return;
    }

    if ((path === "/apply/verification" || path === "/apply/confirmation") && !confirmation) {
      router.replace("/apply/select-event");
      return;
    }

    setIsAuthorized(true);
  }, [pathname, eventId, formData, confirmation, router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d5ad5b]" />
      </div>
    );
  }

  return <>{children}</>;
}
