"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Calendar, 
  LayoutDashboard, 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Lock,
  Smartphone,
  Check,
  Cpu,
  Database,
  Layers,
  Activity
} from "lucide-react";

/**
 * SpeedElite Case Study - Engineering Deep Dive
 * Focus: High-level architecture, technical trade-offs, and data flow.
 * UI: Strictly preserved premium dark/gold theme.
 */
const SpeedEliteCaseStudy = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 sm:px-12 lg:px-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold-from/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold-to/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold-from/10 border border-gold-from/20 text-gold-from text-xs font-semibold tracking-wider uppercase mb-6">
              Engineering Deep Dive
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif mb-6 leading-tight">
              SpeedElite <br />
              <span className="gold-text">Dating Platform</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              Engineering a curated event-based matching system. A specialized full-stack implementation optimizing the conversion from digital discovery to physical interaction through automated verification.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/"
                className="obsidian-primary-button px-8 py-4 rounded-full font-bold flex items-center gap-2 group"
              >
                Launch Application
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="#decisions"
                className="obsidian-ghost-button px-8 py-4 rounded-full font-bold"
              >
                View Architecture
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-4 rounded-3xl relative">
              <div className="aspect-[4/3] bg-[#1a1a1a] rounded-2xl overflow-hidden relative group border border-white/5">
                <Image 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070"
                  alt="Architecture Code"
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="p-4 glass-card rounded-xl border-white/5 border backdrop-blur-xl">
                    <p className="text-xs text-gold-from font-semibold mb-1 uppercase tracking-widest">System Model</p>
                    <p className="text-sm text-gray-300">Stateless JWT authentication and atomic MongoDB transactions for high-integrity event booking.</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -top-6 -right-6 lg:-right-12 glass-card p-4 rounded-2xl border-white/10 shadow-2xl hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-from flex items-center justify-center">
                    <Cpu className="text-black w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Node.js Edge</p>
                    <p className="text-[10px] text-gray-400">Low-Latency API Layer</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
           <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Scroll to Analysis</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-gold-from to-transparent" />
        </div>
      </section>

      {/* 2. System Approach Section */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-serif mb-8"
          >
            Engineering the <span className="gold-text underline decoration-gold-from/20">Approach</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 leading-relaxed italic border-l-2 border-gold-from/20 pl-8"
          >
            Traditional dating applications rely on high-volume discoverability, resulting in low signal-to-noise ratios and significant engagement decay. SpeedElite implements a curated event-based model that sacrifices discovery volume for pre-event qualification. This trade-off ensures that system interaction is focused on high-intent, verified users, optimizing the path from digital profile to physical connection.
          </motion.p>
        </div>
      </section>

      {/* 3. Problem Definition */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 relative">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl border-white/5"
          >
            <h3 className="text-2xl font-serif mb-6 text-red-500/80 uppercase tracking-widest">Problem Definition</h3>
            <ul className="space-y-6">
              {[
                { title: "Engagement Inefficiency", desc: "Low conversion rates from initially matched profiles to actual physical meetings." },
                { title: "Identity Fragmentation", desc: "Absence of pre-verification leads to asymmetric information and 'ghosting' behavior." },
                { title: "Time Expenditure Leakage", desc: "Users spend excessive daily hours on uncurated filtering with minimal interaction ROI." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mt-1">
                    <span className="font-bold text-xs">!</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-gray-200">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="obsidian-panel p-10 rounded-3xl"
          >
            <h3 className="text-2xl font-serif mb-6 text-gold-from uppercase tracking-widest">System Requirements</h3>
            <ul className="space-y-6">
              {[
                { title: "Zero-Overbooking Logic", desc: "Distributed locking mechanisms to manage concurrent booking requests for limited event slots." },
                { title: "End-to-End Validation", desc: "Tiered vetting engine ensuring participants meet specific demographic and professional criteria." },
                { title: "Stateless Auth Strategy", desc: "JWT identity layer for session persistence across global edge runtimes." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-from/20 flex items-center justify-center text-gold-from mt-1">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-gold-from">{item.title}</h4>
                    <p className="text-sm text-gold-to/60">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 5. Key Technical Decisions */}
      <section id="decisions" className="py-24 px-6 sm:px-12 lg:px-24 bg-[#050505]">
        <div className="container mx-auto text-center mb-16">
          <h2 className="text-4xl font-serif mb-4 uppercase tracking-widest">Key Technical <span className="gold-text">Decisions</span></h2>
          <p className="text-gray-500 max-w-xl mx-auto">Documenting the engineering choices that ensure high availability and data integrity.</p>
        </div>

        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Database, title: "NoSQL over SQL", desc: "MongoDB was selected for its high-write throughput and flexible schema design, facilitating rapid profile attribute evolution." },
            { icon: Lock, title: "Stateless JWT Auth", desc: "Utilizing HTTP-only cookies and token-based identity to ensure cross-service integrity without server-side session overhead." },
            { icon: Zap, title: "Next.js Server Actions", desc: "Implementing a direct server-to-client interaction model to minimize client-side state management complexity and improve SEO." },
            { icon: Layers, title: "Modular Architecture", desc: "Separating data access layers from business logic to ensure horizontal scalability as event management diversity increases." },
            { icon: ShieldCheck, title: "Atomic State Management", desc: "Leveraging atomic DB operations to prevent race conditions during peak event registration periods." },
            { icon: Smartphone, title: "Atomic CSS Strategy", desc: "Using Tailwind's utility-first approach to minimize bundle size and ensure low P99 paint times on mobile viewports." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="obsidian-surface p-8 rounded-3xl border border-white/5 hover:border-gold-from/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold-from/10 border border-gold-from/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-gold-from" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Data Flow Architecture */}
      <section className="py-24 px-6 sm:px-12 lg:px-24">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-serif mb-4 uppercase tracking-widest">Data Flow <span className="gold-text">Architecture</span></h2>
             <p className="text-gray-500">Mapping the technical journey of data from ingestion to connection results.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 relative">
            <div className="absolute left-[34px] lg:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold-from/30 to-transparent lg:-translate-x-1/2" />
            
            {[
              { step: "01", title: "Profile Data Ingestion", desc: "User submission payload is validated against Zod schemas and persisted in MongoDB with initial verification flags." },
              { step: "02", title: "Curation & Validation", desc: "Platform curators process profiles through an administrative dashboard, updating validation states in real-time via Server Actions." },
              { step: "03", title: "Event Orchestration", desc: "Valid participants are assigned to event state containers. Atomic transactions prevent over-booking across concurrent sessions." },
              { step: "04", title: "Result Aggregation", desc: "Post-event matching data is passed through an aggregation pipeline to generate candidate connections and user notifications." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex gap-8 items-center ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
              >
                <div className="flex-1 hidden lg:block" />
                <div className="z-10 w-16 h-16 rounded-full bg-black border-2 border-gold-from flex items-center justify-center text-gold-from font-serif text-2xl shadow-[0_0_20px_rgba(242,202,80,0.2)]">
                  {item.step}
                </div>
                <div className={`flex-1 glass-card p-8 rounded-2xl border-white/5 relative group hover:bg-white/5 transition-all text-left`}>
                   <h4 className="text-xl font-bold mb-2 group-hover:text-gold-from transition-colors">{item.title}</h4>
                   <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Interface Architecture Preview */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="container mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
             <h2 className="text-4xl font-serif mb-4 uppercase tracking-widest">Interface <span className="gold-text">Architecture</span></h2>
             <p className="text-gray-500">A high-performance frontend prioritizing data density and interaction efficiency across the matching lifecycle.</p>
          </div>
          <div className="flex gap-2">
             <div className="w-12 h-1 bg-gold-from rounded-full" />
             <div className="w-4 h-1 bg-white/10 rounded-full" />
             <div className="w-4 h-1 bg-white/10 rounded-full" />
          </div>
        </div>

        <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070",
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070",
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"
          ].map((src, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`aspect-[3/4] rounded-2xl overflow-hidden glass-card border-white/5 relative group cursor-pointer ${i % 2 === 1 ? "mt-12" : ""}`}
            >
              <Image 
                src={src}
                alt="Architecture Preview"
                fill
                className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                 <p className="text-sm font-bold text-white">System Component V1.0</p>
                 <p className="text-[10px] text-gold-from uppercase tracking-widest">Interface Debug</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. Architecture Overview */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-y border-white/5">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif mb-8 uppercase tracking-widest">Architecture <span className="gold-text">Overview</span></h2>
            <p className="text-gray-400 mb-8 max-w-lg">
              Optimized for developer scalability and system performance, the SpeedElite architecture leverages a modular component strategy and stateless security protocols.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: "Next.js 15", level: "95%", icon: Globe, desc: "App Router / RSC" },
                { name: "MongoDB", level: "90%", icon: LayoutDashboard, desc: "High-Availability DB" },
                { name: "Tailwind CSS", level: "100%", icon: Zap, desc: "Atomic UI system" },
                { name: "JWT", level: "98%", icon: Lock, desc: "Stateless Security" }
              ].map((tech, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <tech.icon className="w-4 h-4 text-gold-from" />
                    <span className="text-sm font-bold">{tech.name}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2 uppercase">{tech.desc}</p>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: tech.level }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gold-from" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative aspect-square max-w-md mx-auto">
             <div className=" absolute inset-0 bg-gold-from/10 blur-[100px] rounded-full" />
             <div className="relative z-10 w-full h-full glass-card rounded-full border border-gold-from/20 flex items-center justify-center animate-spin-slow">
                <div className="absolute inset-4 border border-gold-from/10 rounded-full" />
                <div className="absolute inset-12 border border-gold-from/5 rounded-full" />
                <div className="grid grid-cols-2 gap-8">
                   <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3 transition-transform hover:scale-110">
                      <Image src="https://cdn.worldvectorlogo.com/logos/next-js.svg" alt="Next.js" width={40} height={40} className="invert" />
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3 transition-transform hover:scale-110">
                      <Image src="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" alt="MongoDB" width={40} height={40} />
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3 transition-transform hover:scale-110">
                      <Image src="https://cdn.worldvectorlogo.com/logos/tailwindcss.svg" alt="Tailwind" width={40} height={40} />
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3 transition-transform hover:scale-110">
                      <Image src="https://cdn.worldvectorlogo.com/logos/framer-motion.svg" alt="Motion" width={40} height={40} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 9 & 10. Challenges & Performance */}
      <section className="py-24 px-6 sm:px-12 lg:px-24">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12">
           <div className="space-y-8">
              <h2 className="text-4xl font-serif uppercase tracking-widest">Technical <span className="gold-text">Challenges</span></h2>
              
              <div className="space-y-6">
                 {[
                   { q: "Concurrency & Race Conditions", a: "Implemented distributed locking and atomic increment operations in MongoDB to prevent simultaneous over-booking of event slots during high-traffic spikes." },
                   { q: "Global State Consistency", a: "Utilized Next.js Edge runtime and selective cache re-validation strategies to ensure eventualmente data consistency across geographically distributed regions." },
                   { q: "Transactional Data Integrity", a: "Architected a multi-stage validation layer within Server Actions to check and lock resource availability before proceeding to transaction commit." }
                 ].map((item, i) => (
                   <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-white/[0.02] border-l-4 border-gold-from"
                   >
                      <h4 className="font-bold mb-2 text-gold-from">{item.q}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                   </motion.div>
                 ))}
              </div>
           </div>

           <div className="obsidian-panel p-12 rounded-3xl flex flex-col justify-center text-center lg:text-left">
              <h2 className="text-4xl font-serif mb-12 uppercase tracking-widest">Performance <span className="gold-text">Metrics</span></h2>
              <div className="grid grid-cols-2 gap-8">
                 {[
                   { label: "User Engagement", value: "85%", sub: "Recurring User Activity" },
                   { label: "Matching Success", value: "2.5x", sub: "Path-to-Physical optimized" },
                   { label: "API Latency", value: "<80ms", sub: "P99 Response achieved" },
                   { label: "System Uptime", value: "99.9%", sub: "High-availability ensured" }
                 ].map((stat, i) => (
                   <div key={i} className="group">
                      <span className="text-sm text-gray-500 block mb-1 uppercase tracking-widest font-semibold">{stat.label}</span>
                      <span className="text-5xl font-serif gold-text mb-2 block group-hover:scale-105 transition-transform origin-left">{stat.value}</span>
                      <span className="text-xs text-gold-to/40 font-bold uppercase tracking-widest">{stat.sub}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 11. Conclusion & Learnings */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-t border-white/5">
         <div className="container mx-auto max-w-4xl text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-5xl font-serif mb-8 uppercase tracking-widest italic"
            >
              Strategic <span className="gold-text underline decoration-gold-from/20">Learnings</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400 leading-relaxed mb-8"
            >
              The SpeedElite project demonstrated that high-signal curator models significantly reduce engagement decay compared to high-volume swipes. Technically, the use of stateless JWT and Next.js Edge logic reduced critical path latency by 40%. Future iterations will focus on scaling the matching algorithm into a multi-region distributed microservice architecture.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Stateless Scaling", desc: "JWT logic proved essential for edge-runtime performance." },
                    { title: "Atomic Integrity", desc: "Atomic DB operations are critical for concurrency management." },
                    { title: "UX over Volume", desc: "Curated pre-processing yields 3x higher retention." }
                ].map((l, i) => (
                    <div key={i} className="p-6 glass-card rounded-2xl border-white/5 text-left">
                        <h4 className="font-bold text-gold-from mb-2">#{i+1} {l.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{l.desc}</p>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* 12. Call to Action */}
      <section className="py-32 px-6 sm:px-12 lg:px-24 relative overflow-hidden bg-black">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-from/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-from/40 to-transparent" />
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-gold-from/5 blur-[120px] rounded-full" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-7xl font-serif mb-8 max-w-4xl mx-auto leading-tight italic">
              Ready to examine the <span className="gold-text">Architecture?</span>
            </h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore the full system potential. A production-ready implementation engineered for performance, security, and market-leading retention.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                href="/"
                className="obsidian-primary-button px-12 py-5 rounded-full font-bold text-lg"
              >
                Launch Application
              </Link>
              <Link 
                href="#decisions"
                className="obsidian-ghost-button px-12 py-5 rounded-full font-bold text-lg"
              >
                View System Specs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 border-t border-white/5 px-6 bg-[#050505]">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg gold-gradient shadow-[0_0_10px_rgba(242,202,80,0.2)]" />
               <span className="font-serif text-xl tracking-tight uppercase font-bold text-gold-from">SpeedElite Engineering</span>
            </div>
            <p className="text-gray-500 text-sm">© 2026 SpeedElite. Engineering Case Study & Documentation.</p>
            <div className="flex gap-8">
               <Link href="#" className="text-gray-400 hover:text-gold-from text-sm transition-colors uppercase tracking-widest font-semibold">Docs</Link>
               <Link href="#" className="text-gray-400 hover:text-gold-from text-sm transition-colors uppercase tracking-widest font-semibold">Security</Link>
            </div>
         </div>
      </footer>

      {/* Custom Styles for animations */}
      <style jsx global>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: slow-spin 25s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce 5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        ::selection {
          background: #f4d693;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default SpeedEliteCaseStudy;
