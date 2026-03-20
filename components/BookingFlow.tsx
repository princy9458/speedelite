"use client";
import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Ruler, 
  Baby, 
  Heart, 
  Camera, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Play,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from "next/image";

interface BookingFlowProps {
  lang: 'hr' | 'en';
  t: any;
  role: 'lady' | 'gent' | null;
  onClose: () => void;
}



export const BookingFlow = ({ lang, t, role, onClose }: BookingFlowProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const getEventTitle = (event: any) =>
    lang === "hr"
      ? event?.translations?.hr?.title || event?.title
      : event?.translations?.en?.title || event?.title;

  const getEventLocation = (event: any) =>
    lang === "hr"
      ? event?.translations?.hr?.location || event?.location
      : event?.translations?.en?.location || event?.location;

  useEffect(() => {
    fetch('/api/events?limit=100')
      .then(res => res.json())
      .then(data => setEvents((data.data || []).filter((e: any) => e.status === 'published')));
  }, []);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    residence: '',
    education: '',
    occupation: '',
    height: '',
    children: '',
    interests: '',
    bio: '',
    smoker: 'no',
    exercise: 'yes',
    languages: '',
    lookingFor: '',
    sleepHabits: '',
    goingOut: '',
    terms: false
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    discountCode: ''
  });
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [interviewDate, setInterviewDate] = useState<string | null>(null);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bookingData = {
        eventId: selectedEvent._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: role,
        amountPaid: role === 'lady' ? selectedEvent.priceFemale : selectedEvent.priceMale,
        paymentStatus: 'paid'
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (res.ok) {
        setIsPaymentSuccess(true);
        setTimeout(() => {
          nextStep();
        }, 2000);
      } else {
        console.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-12 max-w-2xl mx-auto px-4">
      {t.booking.steps.map((s: string, i: number) => (
        <div key={i} className="flex flex-col items-center gap-2 relative">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              step > i + 1 
                ? 'bg-[#F4D693] border-[#F4D693] text-black' 
                : step === i + 1 
                  ? 'border-[#F4D693] text-[#F4D693] shadow-[0_0_15px_rgba(244,214,147,0.3)]' 
                  : 'border-white/10 text-white/30'
            }`}
          >
            {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : <span>{i + 1}</span>}
          </div>
          <span className={`text-[10px] uppercase tracking-widest font-bold ${step === i + 1 ? 'text-[#F4D693]' : 'text-white/30'}`}>
            {s}
          </span>
          {i < t.booking.steps.length - 1 && (
            <div className={`absolute left-[calc(100%+8px)] top-5 w-[calc(100%-16px)] h-[1px] ${step > i + 1 ? 'bg-[#F4D693]' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-serif text-center mb-8">{t.booking.step1.title}</h2>
      <div className="grid gap-4">
        {events.map((event) => (
          <div 
            key={event._id}
            onClick={() => event.capacity > 0 && setSelectedEvent(event)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center gap-4 ${
              selectedEvent?._id === event._id 
                ? 'bg-[#F4D693]/10 border-[#F4D693] shadow-[0_0_20px_rgba(244,214,147,0.1)]' 
                : event.capacity <= 0
                  ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center text-[#F4D693]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{getEventTitle(event)}</h3>
                <div className="flex items-center gap-4 text-white/50 text-sm mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()} @ {event.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {getEventLocation(event)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-2xl font-serif gold-text">
                  {role === 'lady' ? (event.priceFemale === 0 ? 'FREE' : `${event.priceFemale}€`) : `${event.priceMale}€`}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/30">{t.booking.step3.summary}</div>
              </div>
              <button 
                disabled={event.capacity <= 0}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  event.capacity <= 0
                    ? 'bg-white/10 text-white/30'
                    : selectedEvent?._id === event._id
                      ? 'bg-[#F4D693] text-black'
                      : 'border border-[#F4D693] text-[#F4D693] hover:bg-[#F4D693] hover:text-black'
                }`}
              >
                {event.capacity <= 0 ? t.booking.step1.full : selectedEvent?._id === event._id ? t.booking.step1.selected : t.booking.step1.select}
              </button>
            </div>
          </div>
        ))}
        <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-white/5 text-center">
          <p className="text-white/50 italic">{t.booking.step1.dateLoc}</p>
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <button 
          onClick={nextStep}
          disabled={!selectedEvent}
          className={`gold-gradient text-black font-bold py-4 px-12 rounded-xl uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${!selectedEvent ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 shadow-xl'}`}
        >
          {t.booking.step2.next} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif text-center mb-8">{t.booking.step2.title}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.firstName}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.lastName}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.email}</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.phone}</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.birthDate}</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="date" 
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.residence}</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              name="residence"
              value={formData.residence}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.education}</label>
          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.occupation}</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.height}</label>
          <div className="relative">
            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="cm"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.children}</label>
          <div className="relative">
            <Baby className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              name="children"
              value={formData.children}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.interests}</label>
          <div className="relative">
            <Heart className="absolute left-4 top-4 w-4 h-4 text-white/30" />
            <textarea 
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all resize-none" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.bio}</label>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#F4D693]/50 transition-all resize-none" 
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step2.photos}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 hover:border-[#F4D693]/30 transition-all cursor-pointer group">
                <Camera className="w-8 h-8 text-white/20 group-hover:text-[#F4D693]/50 transition-all" />
                <span className="text-[10px] uppercase tracking-widest text-white/20">{i === 1 ? 'Face' : i === 2 ? 'Body' : 'Extra'}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 italic">{t.booking.step2.photoDesc}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-4">
        <input 
          type="checkbox" 
          name="terms"
          checked={formData.terms}
          onChange={handleInputChange}
          id="terms" 
          className="mt-1 accent-[#F4D693]" 
        />
        <label htmlFor="terms" className="text-sm text-white/60 leading-relaxed cursor-pointer">
          {t.booking.step2.terms}
        </label>
      </div>

      <div className="flex justify-between items-center mt-12">
        <button 
          onClick={prevStep}
          className="text-white/50 hover:text-white flex items-center gap-2 transition-all uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> {t.booking.step2.back}
        </button>
        <button 
          onClick={nextStep}
          disabled={!formData.terms}
          className={`gold-gradient text-black font-bold py-4 px-12 rounded-xl uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${!formData.terms ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 shadow-xl'}`}
        >
          {t.booking.step2.next} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-serif text-center mb-8">{t.booking.step3.title}</h2>
      
      <div className="card-gradient p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex justify-between items-center pb-6 border-b border-white/5">
          <div>
            <h3 className="font-bold text-lg">{selectedEvent?.type}</h3>
            <p className="text-white/50 text-sm">{selectedEvent?.date} @ {getEventLocation(selectedEvent)}</p>
          </div>
          <div className="text-2xl font-serif gold-text">
            {role === 'lady' ? (selectedEvent?.priceFemale === 0 ? '0€' : `${selectedEvent?.priceFemale}€`) : `${selectedEvent?.priceMale}€`}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={t.booking.step3.discount}
              value={paymentData.discountCode}
              onChange={(e) => setPaymentData(prev => ({ ...prev, discountCode: e.target.value }))}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
            <button className="px-6 py-3 rounded-xl border border-[#F4D693] text-[#F4D693] font-bold text-xs uppercase tracking-widest hover:bg-[#F4D693] hover:text-black transition-all">
              {t.booking.step3.apply}
            </button>
          </div>
          <div className="flex justify-between items-center text-xl font-bold pt-4">
            <span>{t.booking.step3.summary}</span>
            <span className="gold-text">
              {role === 'lady' ? (selectedEvent?.priceFemale === 0 ? '0€' : `${selectedEvent?.priceFemale}€`) : `${selectedEvent?.priceMale}€`}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step3.cardNumber}</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="0000 0000 0000 0000"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step3.expiry}</label>
            <input 
              type="text" 
              placeholder="MM/YY"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{t.booking.step3.cvc}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="123"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F4D693]/50 transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/40 leading-relaxed italic">{t.booking.step3.info1}</p>
          <p className="text-xs text-white/40 leading-relaxed italic">{t.booking.step3.info2}</p>
        </div>

        <div className="flex justify-between items-center mt-12">
          <button 
            type="button"
            onClick={prevStep}
            className="text-white/50 hover:text-white flex items-center gap-2 transition-all uppercase tracking-widest text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> {t.booking.step2.back}
          </button>
          <button 
            type="submit"
            className="gold-gradient text-black font-bold py-4 px-12 rounded-xl uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl flex items-center gap-2"
          >
            {t.booking.step3.pay} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {isPaymentSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <div className="bg-[#151515] p-12 rounded-[0_60px] border border-[#F4D693]/30 text-center space-y-6 max-w-md shadow-[0_0_50px_rgba(244,214,147,0.1)]">
              <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="text-black w-10 h-10" />
              </div>
              <h3 className="text-3xl font-serif gold-text">{t.booking.step3.success}</h3>
              <p className="text-white/60 leading-relaxed">{t.booking.step3.successDesc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-serif mb-8">{t.booking.step4.title}</h2>
      <div className="card-gradient p-10 rounded-[0_60px] border border-white/10 space-y-8">
        <div className="w-20 h-20 rounded-full bg-[#F4D693]/10 flex items-center justify-center mx-auto">
          <Play className="text-[#F4D693] w-10 h-10 fill-[#F4D693]" />
        </div>
        <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto">
          {t.booking.step4.desc}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["26.03. @ 18:00", "26.03. @ 18:30", "26.03. @ 19:00", "27.03. @ 10:00", "27.03. @ 10:30", "27.03. @ 11:00"].map(time => (
            <button 
              key={time}
              onClick={() => setInterviewDate(time)}
              className={`py-4 rounded-xl border transition-all text-sm font-bold ${
                interviewDate === time 
                  ? 'bg-[#F4D693] border-[#F4D693] text-black shadow-lg' 
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-[#F4D693]/50'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        <button 
          onClick={nextStep}
          disabled={!interviewDate}
          className={`gold-gradient text-black font-bold py-4 px-12 rounded-xl uppercase tracking-widest text-sm transition-all flex items-center gap-2 mx-auto ${!interviewDate ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 shadow-xl'}`}
        >
          {t.booking.step4.finish} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-12 max-w-3xl mx-auto text-center">
      <div className="space-y-6">
        <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center mx-auto shadow-lg mb-8">
          <Sparkles className="text-black w-12 h-12" />
        </div>
        <h2 className="text-4xl md:text-5xl font-serif gold-text">{t.booking.step5.title}</h2>
        <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
          {t.booking.step5.desc}
        </p>
      </div>

      <div className="card-gradient p-10 rounded-[60px_0] border border-[#F4D693]/20 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gold-gradient rounded-full blur-[80px] opacity-10" />
        <div className="space-y-2">
          <h3 className="text-2xl font-serif gold-text uppercase tracking-widest">{t.booking.step5.couponTitle}</h3>
          <p className="text-white/40 text-sm">{t.booking.step5.couponDesc}</p>
        </div>
        <div className="bg-white/5 border-2 border-dashed border-[#F4D693]/30 p-8 rounded-2xl group cursor-pointer hover:border-[#F4D693] transition-all">
          <span className="text-4xl font-serif font-bold tracking-[0.2em] gold-text group-hover:scale-110 transition-transform block">ELITE2024</span>
        </div>
        <p className="text-xs text-white/40 italic max-w-md mx-auto">
          {t.booking.step5.couponInfo}
        </p>
      </div>

      <button 
        onClick={onClose}
        className="bg-transparent border border-white/20 text-white/50 hover:text-white hover:border-white font-bold py-4 px-12 rounded-xl uppercase tracking-widest text-sm transition-all flex items-center gap-2 mx-auto"
      >
        <ArrowLeft className="w-4 h-4" /> {t.booking.step5.home}
      </button>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <Image
              src="/website/se_logo.png"
              alt="SpeedElite"
              width={200}
              height={50}
              className="h-10 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-all duration-300"
            />
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {renderStepIndicator()}

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </motion.div>
      </div>
    </div>
  );
};
