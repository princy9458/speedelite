'use client';

import React from 'react';
import { useRouter } from '@/i18n/routing';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Rules from '@/components/landing/Rules';
import Vouchers from '@/components/landing/Vouchers';
import VideoSection from '@/components/landing/VideoSection';
import Testimonials from '@/components/landing/Testimonials';
import Gallery from '@/components/landing/Gallery';
import Benefits from '@/components/landing/Benefits';

export default function LandingPage() {
  const router = useRouter();

  const startBooking = (role: 'lady' | 'gentleman') => {
    router.push(`/apply/select-event?role=${role}`);
  };


  return (
    <div className="min-h-screen font-sans selection:bg-[#F4D693] selection:text-black">
      <Nav onLogin={() => window.location.href = '/login'} />
      <main className="overflow-hidden pt-20">
        <Hero onApply={startBooking} />
        <Features />
        <HowItWorks />
        <Rules />
        <Vouchers onApply={() => startBooking('lady')} />
        <VideoSection />
        <Testimonials />
        <Gallery />
        <Benefits onApply={startBooking} />

      </main>
      <Footer onApply={startBooking} />
    </div>
  );
}
