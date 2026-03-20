"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Users, 
  Gift, 
  Utensils, 
  GlassWater, 
  ShieldCheck, 
  Sparkles,
  Play,
  Quote,
  ArrowLeft,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import { motion } from 'motion/react';

const translations = {
  hr: {
    nav: { about: "O nama", events: "DogaÄ‘aji", rules: "Pravila", contact: "Kontakt", login: "Prijava" },
    hero: {
      title: "Elitni brzi",
      subtitle: "spojevi",
      desc: "SpeedElite Dating pruÅ¾a jedinstvenu priliku za brzo upoznavanje privlaÄnih djevojaka i poÅ¾eljnih muÅ¡karaca.",
      btnGent: "Prijavi se kao gospodin",
      btnLady: "Prijavi se kao dama"
    },
    features: {
      title: "Å to oÄekivati?",
      f1: "Poklon bonovi za Å¾ene",
      f2: "Besplatna veÄera nakon druÅ¾enja",
      f3: "Besplatna piÄ‡a",
      f4: "Predselekcija elitnih kandidata",
      f5: "OpuÅ¡tena atmosfera",
      f6: "Privatnost eventa"
    },
    howItWorks: {
      title: "Kako funkcionira SpeedElite?",
      step1: {
        title: "Inicijalno Upoznavanje",
        time: "3 min",
        p1: "Djevojke sjede za stolovima, a muÅ¡karci se rotiraju svake tri minute na znak organizatora.",
        p2: "Sudionici biljeÅ¾e Å¾ele li bolje upoznati osobu s kojom su razgovarali (Da/Ne).",
        p3: "PiÄ‡a su besplatna tijekom ove faze."
      },
      step2: {
        title: "SpeedElite Spoj",
        time: "15 min",
        p1: "Ako oba sudionika oznaÄe \"Da\", slijedi 15-minutni spoj.",
        p2: "MuÅ¡karci plaÄ‡aju 40â‚¬ za svaki SpeedElite spoj, ukljuÄujuÄ‡i piÄ‡e za oboje.",
        p3: "Djevojke dobivaju dodatni poklon bon od 20â‚¬ za svaki SpeedElite spoj."
      }
    },
    rules: {
      title: "Pravila i selektivni proces",
      desc: "SpeedElite Dating paÅ¾ljivo bira sudionike kako bismo osigurali da svaka osoba ima priliku upoznati kompatibilnog partnera. NaÅ¡ selektivni proces temelji se na:",
      r1: "Godine",
      r1d: "PrilagoÄ‘avamo dobne skupine za bolju kompatibilnost.",
      r2: "Video selekcija",
      r2d: "Zbog ozbiljnosti prijavnog procesa, nakon prijave pomoÄ‡u kratkog video intervjua biraju se najbolji kandidati.",
      r3: "Broj prijava",
      r3d: "OgraniÄen broj mjesta osigurava opuÅ¡tenu atmosferu."
    },
    vouchers: {
      title: "Poklon bonovi za Å¾ene",
      desc: "Razni poklon bonovi kao Å¡to su Zara poklon kartice, DM, Muller...",
      i1: "Poklon bon za dobrodoÅ¡licu",
      i2: "Poklon bon za svaki SpeedElite date",
      i3: "Poklon bon za svakog muÅ¡karca kojeg dovedete",
      btn: "Prijavi se"
    },
    video: {
      title: "Atmosfera s prethodnih dogaÄ‘aja",
      desc: "Pogledajte kako je bilo na prethodnim dogaÄ‘ajima"
    },
    testimonials: {
      title: "Iskustva sudionika",
      desc: "NaÅ¡i dogaÄ‘aji mijenjaju naÄin na koji razmiÅ¡ljate o spojevima! Evo Å¡to su sudionici rekli o svom iskustvu.",
      t1: "OpuÅ¡tena atmosfera i zanimljivi razgovori! Upoznala sam nekoga tko dijeli moje interese.",
      t2: "SpeedElite mi je omoguÄ‡io da uÅ¡tedim vrijeme i upoznam sjajne osobe. Vrijedilo je svake minute!",
      t3: "Selektivnost je ono Å¡to mi se najviÅ¡e svidjelo. Znao sam da dolazim na kvalitetan dogaÄ‘aj."
    },
    gallery: {
      title: "Pozivamo i vas da doÅ¾ivite SpeedElite iskustvo"
    },
    benefits: {
      title: "Prednosti SpeedElite za Nju i Njega",
      lady: "Za dame",
      gent: "Za gospodu",
      l1: "Prilika za upoznavanje stabilnih, uspjeÅ¡nih i poÅ¾eljnih muÅ¡karaca u opuÅ¡tenoj atmosferi.",
      l2: "Poklon bon u vrijednosti od 40â‚¬ za samo sudjelovanje.",
      l3: "Dodatni bon od 20â‚¬ za svaki SpeedElite spoj.",
      g1: "UÅ¡tedite vrijeme i trud - upoznajte Å¾ene koje su zainteresirane baÅ¡ za vas.",
      g2: "Brzo i praktiÄno upoznavanje viÅ¡e atraktivnih Å¾ena.",
      g3: "Prilika za iskren dojam, prepoznavanje meÄ‘usobne kemije i povezivanje u kontroliranoj i sigurnoj atmosferi.",
      note: "*SpeedElite vrÅ¡i selekciju prijavljenih s obzirom na viÅ¡e Äimbenika meÄ‘u kojima su i godine. Odabrane Ä‡emo kontaktirati."
    },
    booking: {
      steps: ["Termin", "Forma", "PlaÄ‡anje", "Verifikacija", "ZavrÅ¡etak"],
      step1: {
        title: "Odabir termina",
        full: "Popunjeno",
        reserve: "Rezervacija",
        select: "Odaberi",
        selected: "Odabrano",
        dateLoc: "Datum i lokacija naknadno"
      },
      step2: {
        title: "Prijavna forma",
        firstName: "Ime",
        lastName: "Prezime",
        email: "Email",
        phone: "Broj mobitela",
        birthDate: "Datum roÄ‘enja",
        residence: "PrebivaliÅ¡te",
        education: "StruÄna sprema",
        occupation: "Zanimanje",
        height: "Visina",
        children: "Djeca",
        interests: "Interesi",
        bio: "Kratak opis",
        smoker: "PuÅ¡aÄ",
        exercise: "VjeÅ¾bam",
        languages: "Jezici",
        lookingFor: "TraÅ¾im",
        sleepHabits: "Navike spavanja",
        goingOut: "Izlasci",
        photos: "Fotografije",
        photoDesc: "Molimo uÄitaj fotografiju lica i tijela.",
        terms: "Ovom prijavom suglasan sam sa Uvjetima koriÅ¡tenja i Pravilima privatnosti.",
        next: "SljedeÄ‡i korak",
        back: "Natrag"
      },
      step3: {
        title: "PlaÄ‡anje",
        cardNumber: "Broj kartice",
        expiry: "Datum isteka",
        cvc: "CVC",
        info1: "U sluÄaju otkazivanja: do 48h prije termina, u potpunosti se vraÄ‡a uplaÄ‡eni iznos. Otkazivanjem u zadnjih 48h nema povrata novca.",
        info2: "U sluÄaju da niste odabrani za sudjelovanje, u potpunosti vraÄ‡amo uplaÄ‡eni iznos.",
        pay: "Idi na plaÄ‡anje",
        success: "PlaÄ‡anje uspjeÅ¡no",
        successDesc: "Uplata je uspjeÅ¡no izvrÅ¡ena. JoÅ¡ jedan korak do zavrÅ¡etka prijave.",
        summary: "Ukupno",
        discount: "Kod za popust",
        apply: "Primjeni"
      },
      step4: {
        title: "Rezervacija video intervjua",
        desc: "Zbog ozbiljnosti prijavnog procesa, nakon prijave postoji i video interview (do 3 min) kako bi se osigurala potvrda identiteta i dobio bolji uvih u kvalitete i interese kandidata.",
        reserveBtn: "Rezerviraj termin",
        changeBtn: "Promjeni termin",
        finish: "ZavrÅ¡etak"
      },
      step5: {
        title: "Prijava uspjeÅ¡no zaprimljena!",
        desc: "Hvala vam Å¡to ste se prijavili na SpeedElite Dating! VaÅ¡a prijava je uspjeÅ¡no zaprimljena i trenutno je u procesu selekcije. Bit Ä‡ete obavijeÅ¡teni putem e-maila, te ukoliko budete odabrani biti Ä‡ete kontaktirani za video verifikaciju identiteta i kratak intervju (do 3 min).",
        home: "Natrag na naslovnu",
        couponTitle: "Kupon za popust",
        couponDesc: "Ovom prijavom dodijeljen vam je kupon za popust koji moÅ¾ete podijeliti s muÅ¡karcima i pozvati ih da se pridruÅ¾e!",
        couponInfo: "Za svaku osobu koja iskoristi vaÅ¡ kupon pri dolasku vam dodijeljujemo dodatni kupon u iznosu 20â‚¬."
      }
    },
    footer: {
      desc: "Ekskluzivna platforma za upoznavanje koja spaja kvalitetne ljude u profinjenom okruÅ¾enju. VaÅ¡a privatnost i iskustvo su naÅ¡ prioritet.",
      links: "Linkovi",
      newsletter: "Pretplati se na newsletter",
      newsDesc: "I meÄ‘u prvima saznaj za nove dogaÄ‘aje i novosti.",
      placeholder: "Unesi email adresu",
      btn: "Pretplati se",
      rights: "Â© 2024 SpeedElite. Sva prava pridrÅ¾ana.",
      p1: "Politika privatnosti",
      p2: "Pravila koriÅ¡tenja",
      p3: "KolaÄiÄ‡i"
    }
  },
  en: {
    nav: { about: "About Us", events: "Events", rules: "Rules", contact: "Contact", login: "Login" },
    hero: {
      title: "Elite Speed",
      subtitle: "dating",
      desc: "SpeedElite Dating provides a unique opportunity for quick meetings with attractive girls and desirable men.",
      btnGent: "Apply as a Gentleman",
      btnLady: "Apply as a Lady"
    },
    features: {
      title: "What to expect?",
      f1: "Gift vouchers for women",
      f2: "Free dinner after socializing",
      f3: "Free drinks",
      f4: "Pre-selection of elite candidates",
      f5: "Relaxed atmosphere",
      f6: "Event privacy"
    },
    howItWorks: {
      title: "How SpeedElite Works?",
      step1: {
        title: "Initial Introduction",
        time: "3 min",
        p1: "Girls sit at tables, and men rotate every three minutes at the organizer's signal.",
        p2: "Participants note if they want to get to know the person they talked to better (Yes/No).",
        p3: "Drinks are free during this phase."
      },
      step2: {
        title: "SpeedElite Date",
        time: "15 min",
        p1: "If both participants mark \"Yes\", a 15-minute date follows.",
        p2: "Men pay â‚¬40 for each SpeedElite date, including drinks for both.",
        p3: "Girls receive an additional â‚¬20 gift voucher for each SpeedElite date."
      }
    },
    rules: {
      title: "Rules and Selection Process",
      desc: "SpeedElite Dating carefully selects participants to ensure every person has a chance to meet a compatible partner. Our selection process is based on:",
      r1: "Age",
      r1d: "We adjust age groups for better compatibility.",
      r2: "Video Selection",
      r2d: "Due to the seriousness of the application process, the best candidates are selected after applying via a short video interview.",
      r3: "Number of Applications",
      r3d: "A limited number of seats ensures a relaxed atmosphere."
    },
    vouchers: {
      title: "Gift Vouchers for Women",
      desc: "Various gift vouchers such as Zara gift cards, DM, Muller...",
      i1: "Welcome gift voucher",
      i2: "Gift voucher for every SpeedElite date",
      i3: "Gift voucher for every man you bring",
      btn: "Apply Now"
    },
    video: {
      title: "Atmosphere from Previous Events",
      desc: "See how it was at previous events"
    },
    testimonials: {
      title: "Participant Experiences",
      desc: "Our events change the way you think about dating! Here's what participants said about their experience.",
      t1: "Relaxed atmosphere and interesting conversations! I met someone who shares my interests.",
      t2: "SpeedElite allowed me to save time and meet great people. It was worth every minute!",
      t3: "The selectivity is what I liked most. I knew I was coming to a quality event."
    },
    gallery: {
      title: "We invite you to experience the SpeedElite experience"
    },
    benefits: {
      title: "SpeedElite Benefits for Her and Him",
      lady: "For Ladies",
      gent: "For Gentlemen",
      l1: "Opportunity to meet stable, successful, and desirable men in a relaxed atmosphere.",
      l2: "Gift voucher worth â‚¬40 just for participating.",
      l3: "Additional â‚¬20 voucher for each SpeedElite date.",
      g1: "Save time and effort - meet women who are interested in you.",
      g2: "Quick and practical meeting of multiple attractive women.",
      g3: "Opportunity for an honest impression, recognizing mutual chemistry and connecting in a controlled and safe atmosphere.",
      note: "*SpeedElite selects applicants based on several factors including age. Selected candidates will be contacted."
    },
    booking: {
      steps: ["Term", "Form", "Payment", "Verification", "Finish"],
      step1: {
        title: "Select term",
        full: "Full",
        reserve: "Reservation",
        select: "Select",
        selected: "Selected",
        dateLoc: "Date and location later"
      },
      step2: {
        title: "Application form",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone Number",
        birthDate: "Birth Date",
        residence: "Residence",
        education: "Education",
        occupation: "Occupation",
        height: "Height",
        children: "Children",
        interests: "Interests",
        bio: "Short description",
        smoker: "Smoker",
        exercise: "Exercise",
        languages: "Languages",
        lookingFor: "Looking for",
        sleepHabits: "Sleep habits",
        goingOut: "Going out",
        photos: "Photos",
        photoDesc: "Please upload a face and body photo.",
        terms: "By applying, I agree to the Terms of Use and Privacy Policy.",
        next: "Next step",
        back: "Back"
      },
      step3: {
        title: "Payment",
        cardNumber: "Card Number",
        expiry: "Expiry Date",
        cvc: "CVC",
        info1: "In case of cancellation: up to 48h before the term, the full amount is refunded. Cancellation in the last 48h is non-refundable.",
        info2: "In case you are not selected for participation, we will fully refund the paid amount.",
        pay: "Go to payment",
        success: "Payment successful",
        successDesc: "Payment has been successfully processed. One more step to complete the application.",
        summary: "Total",
        discount: "Discount code",
        apply: "Apply"
      },
      step4: {
        title: "Video interview reservation",
        desc: "Due to the seriousness of the application process, there is a video interview (up to 3 min) after application to ensure identity confirmation and get a better insight into the candidate's qualities and interests.",
        reserveBtn: "Reserve term",
        changeBtn: "Change term",
        finish: "Finish"
      },
      step5: {
        title: "Application successfully received!",
        desc: "Thank you for applying to SpeedElite Dating! Your application has been successfully received and is currently in the selection process. You will be notified via email, and if selected, you will be contacted for identity video verification and a short interview (up to 3 min).",
        home: "Back to home",
        couponTitle: "Discount coupon",
        couponDesc: "With this application, you have been assigned a discount coupon that you can share with men and invite them to join!",
        couponInfo: "For every person who uses your coupon upon arrival, we award you an additional coupon in the amount of â‚¬20."
      }
    },
    footer: {
      desc: "An exclusive dating platform that connects quality people in a refined setting. Your privacy and experience are our priority.",
      links: "Links",
      newsletter: "Subscribe to newsletter",
      newsDesc: "Be among the first to know about new events and news.",
      placeholder: "Enter email address",
      btn: "Subscribe",
      rights: "Â© 2024 SpeedElite. All rights reserved.",
      p1: "Privacy Policy",
      p2: "Terms of Use",
      p3: "Cookies"
    }
  }
};

const Nav = ({ lang, setLang, t, onLogin }: any) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(244,214,147,0.3)]">
        <Sparkles className="text-black w-6 h-6" />
      </div>
      <span className="text-2xl font-serif font-bold tracking-tighter gold-text">SpeedElite</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium text-white/70">
      <a href="#" className="hover:text-[#F4D693] transition-colors">{t.nav.about}</a>
      <a href="#" className="hover:text-[#F4D693] transition-colors">{t.nav.events}</a>
      <a href="#" className="hover:text-[#F4D693] transition-colors">{t.nav.rules}</a>
      <a href="#" className="hover:text-[#F4D693] transition-colors">{t.nav.contact}</a>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setLang('hr')}
          className={`transition-opacity ${lang === 'hr' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
        >
          <img src="https://flagcdn.com/w40/hr.png" alt="HR" className="w-6 h-4 object-cover rounded-sm" />
        </button>
        <button 
          onClick={() => setLang('en')}
          className={`transition-opacity ${lang === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
        >
          <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-6 h-4 object-cover rounded-sm" />
        </button>
      </div>
      <button 
        onClick={onLogin}
        className="gold-gradient text-black text-xs uppercase tracking-widest font-bold px-6 py-2.5 btn-shape hover:scale-105 transition-all shadow-lg"
      >
        {t.nav.login}
      </button>
    </div>
  </nav>
);

const Hero = ({ t, onApply }: any) => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2069" 
        alt="Elite Dinner" 
        className="w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent" />
    </div>
    
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-[#F4D693] w-5 h-5 fill-[#F4D693]" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-[1] text-shadow-gold">
            {t.hero.title} <br />
            <span className="italic gold-text">{t.hero.subtitle}</span>
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-lg font-sans">
            {t.hero.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onApply('gent')}
              className="gold-gradient text-black font-bold py-3.5 px-8 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm uppercase tracking-wider"
            >
              {t.hero.btnGent}
            </button>
            <button 
              onClick={() => onApply('lady')}
              className="bg-transparent border border-white text-white font-bold py-3.5 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm uppercase tracking-wider"
            >
              {t.hero.btnLady}
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/5]">
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
              className="w-full h-full object-cover"
              alt="Elite couple"
            />
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 gold-gradient rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 gold-gradient rounded-full blur-3xl opacity-10" />
        </motion.div>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="card-gradient p-8 rounded-[0_32px] flex flex-col items-center text-center gap-6 border border-white/10 h-full transition-all hover:border-[#F4D693]/30"
  >
    <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl">
      <Icon className="text-[#F4D693] w-10 h-10" />
    </div>
    <h3 className="text-lg font-sans font-bold leading-tight tracking-tight">{title}</h3>
  </motion.div>
);

const Features = ({ t }: any) => (
  <section className="py-24 bg-[#0F0F0F]">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif mb-4">{t.features.title}</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <FeatureCard icon={Gift} title={t.features.f1} />
        <FeatureCard icon={Utensils} title={t.features.f2} />
        <FeatureCard icon={GlassWater} title={t.features.f3} />
        <FeatureCard icon={Users} title={t.features.f4} />
        <FeatureCard icon={Sparkles} title={t.features.f5} />
        <FeatureCard icon={ShieldCheck} title={t.features.f6} />
      </div>
    </div>
  </section>
);

const HowItWorks = ({ t }: any) => (
  <section className="py-32 bg-[#0F0F0F]">
    <div className="container mx-auto px-6">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-6xl font-serif mb-4">{t.howItWorks.title}</h2>
      </div>
      
      <div className="space-y-32">
        {/* Step 1 */}
        <div className="relative flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-2/3 relative z-0">
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
              className="w-full aspect-[16/9] object-cover image-pill-right shadow-2xl"
              alt="Step 1"
            />
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 lg:-ml-32 relative z-10 card-overlap p-10 md:p-16 rounded-[40px_0_40px_0] shadow-2xl mt-8 lg:mt-0"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl md:text-4xl font-serif font-bold">{t.howItWorks.step1.title}</h3>
                <div className="flex items-center gap-2 text-[#F4D693]">
                  <Clock className="w-6 h-6" />
                  <span className="text-xl font-serif italic">{t.howItWorks.step1.time}</span>
                </div>
              </div>
              <ul className="space-y-6">
                {[t.howItWorks.step1.p1, t.howItWorks.step1.p2, t.howItWorks.step1.p3].map((p, i) => (
                  <li key={i} className="flex items-start gap-4 text-white/80 text-lg leading-relaxed">
                    <ArrowRight className="w-5 h-5 text-[#F4D693] shrink-0 mt-1.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Step 2 */}
        <div className="relative flex flex-col lg:flex-row-reverse items-center">
          <div className="w-full lg:w-2/3 relative z-0">
            <img 
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=2069" 
              className="w-full aspect-[16/9] object-cover image-pill-left shadow-2xl"
              alt="Step 2"
            />
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 lg:-mr-32 relative z-10 card-overlap p-10 md:p-16 rounded-[0_40px_0_40px] shadow-2xl mt-8 lg:mt-0"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl md:text-4xl font-serif font-bold">{t.howItWorks.step2.title}</h3>
                <div className="flex items-center gap-2 text-[#F4D693]">
                  <Clock className="w-6 h-6" />
                  <span className="text-xl font-serif italic">{t.howItWorks.step2.time}</span>
                </div>
              </div>
              <ul className="space-y-6">
                {[t.howItWorks.step2.p1, t.howItWorks.step2.p2, t.howItWorks.step2.p3].map((p, i) => (
                  <li key={i} className="flex items-start gap-4 text-white/80 text-lg leading-relaxed">
                    <ArrowRight className="w-5 h-5 text-[#F4D693] shrink-0 mt-1.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const Rules = ({ t }: any) => (
  <section className="py-24 bg-[#0F0F0F]">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif">{t.rules.title}</h2>
        <p className="text-white/60 leading-relaxed text-lg font-sans px-12">
          {t.rules.desc}
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: t.rules.r1, desc: t.rules.r1d },
          { icon: Play, title: t.rules.r2, desc: t.rules.r2d },
          { icon: ShieldCheck, title: t.rules.r3, desc: t.rules.r3d }
        ].map((rule, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.02 }}
            className="card-gradient p-12 rounded-[40px_0] text-center space-y-8 border border-white/10 shadow-xl"
          >
            <div className="w-20 h-20 flex items-center justify-center mx-auto bg-[#F4D693]/10 rounded-full">
              <rule.icon className="text-[#F4D693] w-10 h-10" />
            </div>
            <h3 className="text-2xl font-sans font-bold tracking-tight">{rule.title}</h3>
            <p className="text-lg text-white/60 leading-relaxed">{rule.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Vouchers = ({ t, onApply }: any) => (
  <section className="py-24 relative overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="card-gradient p-12 md:p-24 rounded-[0_120px] border border-white/10 flex flex-col lg:flex-row items-center gap-16 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 gold-gradient rounded-full blur-[120px] opacity-10 -z-10" />
        <div className="flex-1 space-y-10">
          <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight">{t.vouchers.title}</h2>
          <p className="text-white/70 text-xl leading-relaxed">{t.vouchers.desc}</p>
          <ul className="space-y-8">
            {[
              t.vouchers.i1,
              t.vouchers.i2,
              t.vouchers.i3
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-5 text-xl font-bold">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="text-black w-6 h-6" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={onApply}
            className="gold-gradient text-black font-bold py-4 px-12 rounded-xl uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl"
          >
            {t.vouchers.btn}
          </button>
        </div>
        <div className="flex-1 relative hidden lg:block">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2070" 
              alt="Vouchers" 
              className="rounded-[0_60px] w-full object-cover aspect-square shadow-2xl border border-white/10"
            />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 gold-gradient rounded-full blur-3xl opacity-30" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const VideoSection = ({ t }: any) => (
  <section className="py-24 bg-[#0F0F0F]">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif">{t.video.title}</h2>
        <p className="text-white/60 text-lg">{t.video.desc}</p>
      </div>
      
      <div className="relative max-w-5xl mx-auto group cursor-pointer">
        <div className="relative z-10 aspect-video rounded-3xl overflow-hidden border border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2070" 
            alt="Event Atmosphere" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
              <Play className="text-white w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = ({ t }: any) => (
  <section className="py-32 bg-[#0F0F0F]">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20 space-y-6">
        <h2 className="text-5xl md:text-6xl font-serif">{t.testimonials.title}</h2>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">{t.testimonials.desc}</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Ana, 27", text: t.testimonials.t1, img: "https://i.pravatar.cc/150?u=ana" },
          { name: "Marko, 34", text: t.testimonials.t2, img: "https://i.pravatar.cc/150?u=marko" },
          { name: "Ivan, 31", text: t.testimonials.t3, img: "https://i.pravatar.cc/150?u=ivan" }
        ].map((test, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="card-gradient p-12 rounded-[0_32px] space-y-8 relative border border-white/10 shadow-xl"
          >
            <Quote className="absolute top-8 right-8 w-12 h-12 text-[#F4D693]/10" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-[#F4D693] fill-[#F4D693]" />)}
            </div>
            <p className="text-white text-xl italic leading-relaxed relative z-10">"{test.text}"</p>
            <div className="flex items-center gap-5 pt-6 border-t border-white/5">
              <img src={test.img} alt={test.name} className="w-14 h-14 rounded-full border-2 border-[#F4D693]/30 object-cover shadow-lg" />
              <span className="font-sans font-bold text-xl tracking-tight">{test.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Gallery = ({ t }: any) => (
  <section className="py-32 bg-[#0F0F0F]">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-serif max-w-4xl mx-auto leading-tight">
          {t.gallery.title.split('SpeedElite')[0]}<span className="gold-text italic">SpeedElite</span>{t.gallery.title.split('SpeedElite')[1]}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1000"
        ].map((src, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.03 }}
            className="rounded-[0_40px] overflow-hidden border border-white/10 shadow-2xl aspect-square"
          >
            <img src={src} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Benefits = ({ t, onApply }: any) => (
  <section className="py-24 bg-[#0F0F0F] relative">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-serif">{t.benefits.title}</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div 
          whileHover={{ y: -10 }}
          className="card-gradient p-12 rounded-[0_60px] space-y-10 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 gold-gradient rounded-full blur-[80px] opacity-5" />
          <h3 className="text-5xl font-serif gold-text">{t.benefits.lady}</h3>
          <ul className="space-y-6">
            {[
              t.benefits.l1,
              t.benefits.l2,
              t.benefits.l3
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-5 text-xl leading-relaxed">
                <CheckCircle2 className="text-[#F4D693] w-8 h-8 shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => onApply('lady')}
            className="gold-gradient text-black font-bold py-5 px-12 rounded-xl w-full md:w-fit text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
          >
            {t.hero.btnLady}
          </button>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -10 }}
          className="card-gradient p-12 rounded-[0_60px] space-y-10 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 gold-gradient rounded-full blur-[80px] opacity-5" />
          <h3 className="text-5xl font-serif gold-text">{t.benefits.gent}</h3>
          <ul className="space-y-6">
            {[
              t.benefits.g1,
              t.benefits.g2,
              t.benefits.g3
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-5 text-xl leading-relaxed">
                <CheckCircle2 className="text-[#F4D693] w-8 h-8 shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => onApply('gent')}
            className="gold-gradient text-black font-bold py-5 px-12 rounded-xl w-full md:w-fit text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
          >
            {t.hero.btnGent}
          </button>
        </motion.div>
      </div>
      
      <p className="text-center text-sm text-white/40 mt-12 italic font-sans">
        {t.benefits.note}
      </p>
    </div>
  </section>
);

const Footer = ({ t, onApply }: any) => (
  <footer className="bg-[#0F0F0F] border-t border-white/5 pt-20 pb-10">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-2 space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
              <Sparkles className="text-black w-5 h-5" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-wider gold-text">SpeedElite</span>
          </div>
          <p className="text-white/50 max-w-sm leading-relaxed text-lg">
            {t.footer.desc}
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#F4D693] hover:text-black transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#F4D693] hover:text-black transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#F4D693] hover:text-black transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => onApply('gent')}
              className="gold-gradient text-black font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-widest"
            >
              {t.hero.btnGent}
            </button>
            <button 
              onClick={() => onApply('lady')}
              className="border border-white/20 text-white font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-widest hover:bg-white/5"
            >
              {t.hero.btnLady}
            </button>
          </div>
        </div>
        
        <div className="space-y-8">
          <h4 className="font-serif text-xl font-bold">{t.footer.links}</h4>
          <ul className="space-y-4 text-white/50 text-base">
            <li><a href="#" className="hover:text-[#F4D693] transition-colors">{t.nav.about}</a></li>
            <li><a href="#" className="hover:text-[#F4D693] transition-colors">{t.nav.events}</a></li>
            <li><a href="#" className="hover:text-[#F4D693] transition-colors">{t.nav.rules}</a></li>
            <li><a href="#" className="hover:text-[#F4D693] transition-colors">{t.footer.p2}</a></li>
          </ul>
        </div>
        
        <div className="space-y-8">
          <h4 className="font-serif text-xl font-bold">{t.footer.newsletter}</h4>
          <p className="text-white/50 text-base">{t.footer.newsDesc}</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder={t.footer.placeholder} 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-[#F4D693]/50"
            />
            <button className="gold-gradient text-black px-6 py-3 rounded-lg font-bold text-sm">
              {t.footer.btn}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
        <p className="text-white/30 text-sm">{t.footer.rights}</p>
        <div className="flex gap-8 text-white/30 text-sm">
          <a href="#" className="hover:text-white transition-colors">{t.footer.p1}</a>
          <a href="#" className="hover:text-white transition-colors">{t.footer.p2}</a>
          <a href="#" className="hover:text-white transition-colors">{t.footer.p3}</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const router = useRouter();
  const [lang, setLang] = React.useState<'hr' | 'en'>('hr');
  const t = translations[lang];

  const startBooking = (role: 'lady' | 'gent') => {
    router.push(`/apply/select-event?role=${role}&lang=${lang}`);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#F4D693] selection:text-black">
      <Nav lang={lang} setLang={setLang} t={t} onLogin={() => window.location.href = '/login'} />
      <main className="overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Hero t={t} onApply={startBooking} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <Features t={t} />
        </motion.div>
        
        <HowItWorks t={t} />
        <Rules t={t} />
        <Vouchers t={t} onApply={() => startBooking('lady')} />
        <VideoSection t={t} />
        <Testimonials t={t} />
        <Gallery t={t} />
        <Benefits t={t} onApply={startBooking} />
      </main>
      <Footer t={t} onApply={startBooking} />
    </div>
  );
}

