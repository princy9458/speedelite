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
  Check
} from "lucide-react";

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
              Case Study
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif mb-6 leading-tight">
              SpeedElite <br />
              <span className="gold-text">Dating Platform</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              A premium, curated speed dating experience designed for those who value time and real connection. Revolutionizing modern matchmaking with luxury.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="#"
                className="obsidian-primary-button px-8 py-4 rounded-full font-bold flex items-center gap-2 group"
              >
                View Live Project
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="#features"
                className="obsidian-ghost-button px-8 py-4 rounded-full font-bold"
              >
                Explore Features
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
              <div className="aspect-[4/3] bg-[#1a1a1a] rounded-2xl overflow-hidden relative group">
                <Image 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069"
                  alt="Premium Event"
                  fill
                  className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="p-4 glass-card rounded-xl border-white/5 border backdrop-blur-xl">
                    <p className="text-xs text-gold-from font-semibold mb-1 uppercase tracking-widest">Next Generation</p>
                    <p className="text-sm text-gray-300">Curated guest lists and luxury venues for the elite dating experience.</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -top-6 -right-6 lg:-right-12 glass-card p-4 rounded-2xl border-white/10 shadow-2xl hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-from flex items-center justify-center">
                    <CheckCircle2 className="text-black w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">100% Curated</p>
                    <p className="text-[10px] text-gray-400">Verified Profiles Only</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
           <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Scroll to Explore</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-gold-from to-transparent" />
        </div>
      </section>

      {/* 2. Overview Section */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-serif mb-8"
          >
            The Vision of <span className="gold-text underline decoration-gold-from/20">SpeedElite</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 leading-relaxed"
          >
            SpeedElite was born from a simple observation: modern dating apps have become a game of endless scrolling and zero connection. Our platform bridges the gap between digital convenience and real-world chemistry. We provide a curated space where high-achieving individuals can meet face-to-face in an environment that reflects their lifestyle.
          </motion.p>
        </div>
      </section>

      {/* 3 & 4. Problem & Solution */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 relative">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl border-white/5"
          >
            <h3 className="text-2xl font-serif mb-6 text-red-500/80">The Problem</h3>
            <ul className="space-y-6">
              {[
                { title: "Time Fatigue", desc: "Users spend hours daily swiping with minimal meaningful ROI." },
                { title: "Ghosting Culture", desc: "The lack of physical presence makes it easy to detach and disappear." },
                { title: "Low-Quality Filters", desc: "Generic algorithms fail to capture the nuance of elite compatibility." }
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
            <h3 className="text-2xl font-serif mb-6 text-gold-from">The Solution</h3>
            <ul className="space-y-6">
              {[
                { title: "Real-World Interaction", desc: "Immediate face-to-face chemistry that no screen can replicate." },
                { title: "Identity Verification", desc: "Rigorous vetting process to ensure every participant is who they say they are." },
                { title: "Luxury Orchestration", desc: "Events hosted at top-tier venues with professional concierge service." }
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

      {/* 5. Features Section Grid */}
      <section id="features" className="py-24 px-6 sm:px-12 lg:px-24 bg-[#050505]">
        <div className="container mx-auto text-center mb-16">
          <h2 className="text-4xl font-serif mb-4">Platform <span className="gold-text">Features</span></h2>
          <p className="text-gray-500 max-w-xl mx-auto">Built with the latest technologies to provide a seamless, secure, and luxurious user experience.</p>
        </div>

        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Calendar, title: "Event Booking", desc: "Smart scheduling system with automated waitlists and instant confirmations." },
            { icon: LayoutDashboard, title: "Admin Analytics", desc: "Deep insights into event performance, attendee feedback, and matching rates." },
            { icon: ShieldCheck, title: "Secure Auth (JWT)", desc: "Military-grade encryption and token-based security for all user data." },
            { icon: MessageSquare, title: "Smart Feedback", desc: "Post-event matching algorithmic feedback loops to improve pairing over time." },
            { icon: Zap, title: "Lightning API", desc: "Ultra-fast response times ensuring a smooth interface even under heavy load." },
            { icon: Smartphone, title: "Responsive UX", desc: "Native-like experience on mobile browsers for on-the-go event management." }
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

      {/* 6. How It Works */}
      <section className="py-24 px-6 sm:px-12 lg:px-24">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-serif mb-4 italic">The <span className="gold-text">Elite</span> Journey</h2>
             <p className="text-gray-500">From application to matching—a seamless professional experience.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 relative">
            <div className="absolute left-[34px] lg:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold-from/30 to-transparent lg:-translate-x-1/2" />
            
            {[
              { step: "01", title: "Apply for Event", desc: "Submit your profile for verification. We ensure a balanced and high-quality guest list for every session." },
              { step: "02", title: "Get Selected", desc: "Our curators review and approve attendees based on compatibility metrics and background checks." },
              { step: "03", title: "Attend Session", desc: "Experience a night of rapid real-world interaction in a sophisticated lounge or restaurant." },
              { step: "04", title: "Match Results", desc: "Check your portal the next morning to see your mutual connections and start conversations." }
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

      {/* 7. Screenshots Section */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="container mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
             <h2 className="text-4xl font-serif mb-4">Sleek <span className="gold-text">Interface</span> Design</h2>
             <p className="text-gray-500">A minimal aesthetic that prioritizes content and ease of use, maintaining a premium feel throughout.</p>
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
                alt="UI Screenshot"
                fill
                className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                 <p className="text-sm font-bold text-white">Dashboard V1.0</p>
                 <p className="text-[10px] text-gold-from uppercase tracking-widest">Mobile Preview</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. Tech Stack */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-y border-white/5">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif mb-8">Modern <span className="gold-text">Infrastructure</span></h2>
            <p className="text-gray-400 mb-8 max-w-lg">
              We leverage cutting-edge technologies to ensure SpeedElite is not only visually stunning but also technically robust, scalable, and secure.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: "Next.js 15", level: "95%", icon: Globe },
                { name: "MongoDB", level: "90%", icon: LayoutDashboard },
                { name: "Tailwind CSS", level: "100%", icon: Zap },
                { name: "JWT Sec", level: "98%", icon: Lock }
              ].map((tech, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <tech.icon className="w-4 h-4 text-gold-from" />
                    <span className="text-sm font-bold">{tech.name}</span>
                  </div>
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
                   <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3">
                      <Image src="https://cdn.worldvectorlogo.com/logos/next-js.svg" alt="Next.js" width={40} height={40} className="invert" />
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3">
                      <Image src="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" alt="MongoDB" width={40} height={40} />
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3">
                      <Image src="https://cdn.worldvectorlogo.com/logos/tailwindcss.svg" alt="Tailwind" width={40} height={40} />
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3">
                      <Image src="https://cdn.worldvectorlogo.com/logos/framer-motion.svg" alt="Motion" width={40} height={40} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 9 & 10. Challenges & Results */}
      <section className="py-24 px-6 sm:px-12 lg:px-24">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12">
           <div className="space-y-8">
              <h2 className="text-4xl font-serif">Challenges <br />& <span className="gold-text">Engineering</span></h2>
              
              <div className="space-y-6">
                 {[
                   { q: "Authentication Handling", a: "Implementing a dual-layer JWT strategy with HTTP-only cookies and edge runtime validation to prevent CSRF while maintaining performance." },
                   { q: "Scalable API Architecture", a: "Architecting a modular service layer for MongoDB to handle complex booking logic and waitlist management efficiently." },
                   { q: "Dynamic UI Feedback", a: "Utilizing Server Actions and optimistic updates to give users instant visual confirmation for event registration." }
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
                      <p className="text-sm text-gray-400">{item.a}</p>
                   </motion.div>
                 ))}
              </div>
           </div>

           <div className="obsidian-panel p-12 rounded-3xl flex flex-col justify-center text-center lg:text-left">
              <h2 className="text-4xl font-serif mb-12">Impact & <span className="gold-text">Performance</span></h2>
              <div className="grid grid-cols-2 gap-8">
                 {[
                   { label: "User Engagement", value: "85%", sub: "Avg. Daily Activity" },
                   { label: "Matching Speed", value: "2.5x", sub: "Faster than Legacy" },
                   { label: "Server Response", value: "<80ms", sub: "P99 Latency" },
                   { label: "Retention Rate", value: "92%", sub: "Month-to-Month" }
                 ].map((stat, i) => (
                   <div key={i}>
                      <span className="text-sm text-gray-500 block mb-1 uppercase tracking-widest">{stat.label}</span>
                      <span className="text-5xl font-serif gold-text mb-2 block">{stat.value}</span>
                      <span className="text-xs text-gold-to/40 font-semibold">{stat.sub}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 11. Call to Action */}
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
            <h2 className="text-4xl lg:text-7xl font-serif mb-8 max-w-4xl mx-auto leading-tight">
              Ready to <span className="gold-text italic">Elevate Your Events?</span>
            </h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              Experience the platform that is setting a new standard for curated matchmaking. Join the elite network today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                href="/events"
                className="obsidian-primary-button px-12 py-5 rounded-full font-bold text-lg"
              >
                Explore Events
              </Link>
              <Link 
                href="/apply"
                className="obsidian-ghost-button px-12 py-5 rounded-full font-bold text-lg"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 border-t border-white/5 px-6">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg gold-gradient" />
               <span className="font-serif text-xl tracking-tight">SpeedElite</span>
            </div>
            <p className="text-gray-500 text-sm">© 2026 SpeedElite Dating Platform. All rights reserved.</p>
            <div className="flex gap-8">
               <Link href="#" className="text-gray-400 hover:text-gold-from text-sm transition-colors">Privacy</Link>
               <Link href="#" className="text-gray-400 hover:text-gold-from text-sm transition-colors">Terms</Link>
               <Link href="#" className="text-gray-400 hover:text-gold-from text-sm transition-colors">Contact</Link>
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
          animation: slow-spin 20s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce 4s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
      `}</style>
    </div>
  );
};

export default SpeedEliteCaseStudy;
