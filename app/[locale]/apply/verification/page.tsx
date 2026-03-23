"use client";

import { useState, Suspense } from "react";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { ShieldCheck, Calendar as CalendarIcon, Clock, Globe, Video, ChevronLeft, ChevronRight, X, Check, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressSteps from "@/components/apply/ProgressSteps";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { cn } from "@/lib/utils";

function VerificationContent() {
  const router = useRouter();
  const { interview, setInterview } = useBookingStore();
  const t = useTranslations('apply');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [showCalendar, setShowCalendar] = useState(false);

  const [currentView, setCurrentView] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentMonth = currentView.month === today.getMonth() && currentView.year === today.getFullYear();

  const handleMonthNav = (direction: "prev" | "next") => {
    if (direction === "prev" && isCurrentMonth) return;
    setCurrentView(prev => {
      let newMonth = prev.month + (direction === "next" ? 1 : -1);
      let newYear = prev.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      else if (newMonth < 0) { newMonth = 11; newYear--; }
      return { month: newMonth, year: newYear };
    });
  };

  const handleSelectDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    dateObj.setHours(0, 0, 0, 0);
    if (dateObj < today) return; 
    setSelectedDate(dateStr);
  };

  const handleSave = () => {
    if (!selectedDate || !selectedTime) return;
    setInterview({
      date: selectedDate,
      time: selectedTime,
      timezone: "Europe/Zagreb",
    });
    setIsConfirmed(true);
  };

  const getMonthName = (month: number, year: number) => {
    return new Date(year, month).toLocaleString(locale === "hr" ? "hr-HR" : "en-US", { month: 'long', year: 'numeric' });
  };

  const timeSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-20 space-y-12">
      

      <ProgressSteps steps={t.raw('steps')} currentStep={4} />

      <div className="max-w-[840px] space-y-8 text-left translate-y-[-24px]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.34em] text-[#d5ad5b]/75">{t('stepLabel')} 4</p>
          <h1 className="text-[28px] font-bold text-white">{t('verificationTitle')}</h1>
          <p className="text-[15.5px] leading-relaxed text-[#BFBFBF] max-w-3xl">{t('verificationDesc')}</p>
        </div>

        {!interview ? (
          <button onClick={() => { setSelectedDate(null); setSelectedTime(null); setIsConfirmed(false); setShowCalendar(true); }} className="bg-[linear-gradient(135deg,#E7C873,#D4AF37)] rounded-[10px] px-8 py-3 text-[14px] font-bold text-black shadow-lg">{t('bookAppointment')}</button>
        ) : (
          <div className="space-y-6 pt-2">
            <button onClick={() => { setSelectedDate(interview.date); setSelectedTime(interview.time); setIsConfirmed(false); setShowCalendar(true); }} className="bg-[linear-gradient(135deg,#E7C873,#D4AF37)] rounded-[10px] px-8 py-3 text-[14px] font-bold text-black shadow-lg">{t('changeSlot')}</button>
            <div className="rounded-[20px] border border-white/10 bg-[#16130D]/60 p-8 backdrop-blur-xl max-w-[600px]">
              <div className="space-y-6">
                 <div className="flex items-center gap-4 text-white/90">
                    <ShieldCheck className="h-6 w-6 text-[#E7C873]" />
                    <span className="text-xl font-medium tracking-tight">dev User</span>
                 </div>
                 <div className="grid gap-4 text-white/60">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#E7C873]/50" />
                      <span className="text-[15px]">{interview.time}, {new Date(interview.date).toLocaleDateString(locale === "hr" ? "hr-HR" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' })}.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-[#E7C873]/50" />
                      <span className="text-[15px]">{interview.timezone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-[#E7C873]/50" />
                      <span className="text-[15px]">{t('conferenceDetailsFollow')}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
          <button onClick={() => router.push("/apply/payment")} className="rounded-[10px] border border-white/60 bg-transparent px-8 py-2.5 text-[13px] font-bold text-white hover:bg-white/5">{tCommon('back')}</button>
          <button disabled={!interview} onClick={() => router.push("/apply/confirmation")} className={cn("rounded-[8px] px-9 py-2.5 text-[14px] font-bold", interview ? "bg-[#C6A96B] text-[#1a1a1a] shadow-sm" : "bg-white/10 text-white/20 cursor-not-allowed")}>{t('completion')}</button>
        </div>
      </div>

      <AnimatePresence>
        {showCalendar && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={() => setShowCalendar(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative w-full max-w-[860px] overflow-hidden rounded-[12px] bg-white shadow-2xl border flex flex-col md:flex-row min-h-[540px]">
              <button onClick={() => setShowCalendar(false)} className="absolute right-4 top-4 z-20 p-2 text-black/20 hover:text-black/60"><X className="h-5 w-5" /></button>
              {!isConfirmed && (
                <div className="bg-[#F5F5F5] p-10 md:w-[35%] flex flex-col space-y-8">
                  <div className="flex flex-col items-start gap-6">
                    <div className="bg-black rounded-full p-2 h-16 w-16 flex items-center justify-center"><Image src="/website/se_logo.png" alt="Logo" width={36} height={36} /></div>
                    <h3 className="text-[26px] font-bold text-[#111111]">{t('videoSelectionTitle')}</h3>
                  </div>
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3 text-[#666666]"><Clock className="h-5 w-5" /><span className="text-[14px]">{t('durationLabel')}</span></div>
                    <div className="flex items-start gap-3 text-[#666666]"><Video className="mt-1 h-5 w-5" /><span className="text-[14px]">{t('conferenceDetailsHint')}</span></div>
                  </div>
                </div>
              )}
              <div className={cn("p-10 bg-white relative flex flex-col min-h-[500px]", isConfirmed ? "w-full items-center justify-center text-center" : "md:w-[65%]")}>
                <AnimatePresence mode="wait">
                  {isConfirmed ? (
                    <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[500px] space-y-10">
                      <div className="flex flex-col items-center gap-6">
                        <div className="bg-black rounded-full p-2 h-20 w-20 flex items-center justify-center"><Image src="/website/se_logo.png" alt="Logo" width={44} height={44} /></div>
                        <div className="space-y-2">
                           <div className="flex items-center justify-center gap-2 text-[#111111] font-bold text-[24px]">
                             <div className="bg-[#2F6BFF] rounded-full p-1 border-2 border-white"><Check className="h-4 w-4 text-white" /></div>
                             <span>{t('dateConfirmedTitle')}</span>
                           </div>
                           <p className="text-[#666666] text-[14px]">{t('invitationSentDesc')}</p>
                        </div>
                      </div>
                      <div className="rounded-[12px] border bg-[#FDFDFD] p-8 text-left space-y-6">
                        <h5 className="text-[16px] font-bold text-[#111111]">{t('videoSelectionSchedule')}</h5>
                        <div className="space-y-4 text-[#444444]">
                          <div className="flex items-center gap-3"><User className="h-5 w-5" /><span>dev User</span></div>
                          <div className="flex items-center gap-3"><CalendarIcon className="h-5 w-5" /><span>{selectedTime}, {new Date(selectedDate!).toLocaleDateString(locale === 'hr' ? 'hr-HR' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</span></div>
                          <div className="flex items-center gap-3"><Globe className="h-5 w-5" /><span>Europe/Zagreb</span></div>
                          <div className="flex items-start gap-3"><Video className="h-5 w-5 mt-0.5" /><span>{t('conferenceDetailsFollow')}</span></div>
                        </div>
                      </div>
                      <button onClick={() => setShowCalendar(false)} className="w-full rounded-[10px] bg-[linear-gradient(135deg,#E7C873,#D4AF37)] py-3.5 text-[15px] font-bold text-black">{t('close')}</button>
                    </motion.div>
                  ) : !selectedDate ? (
                    <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 flex-1">
                      <h4 className="text-[20px] font-medium text-[#111111]">{t('selectDate')}</h4>
                      <div className="space-y-8">
                        <div className="flex items-center justify-center gap-12 relative text-black">
                          <button onClick={() => handleMonthNav("prev")} disabled={isCurrentMonth} className="h-8 w-8 rounded-full border bg-[#F0F0F0] absolute left-0 disabled:opacity-30"><ChevronLeft className="h-4 w-4 mx-auto" /></button>
                          <span className="text-[14px] font-semibold">{getMonthName(currentView.month, currentView.year)}</span>
                          <button onClick={() => handleMonthNav("next")} className="h-8 w-8 rounded-full border bg-[#F0F0F0] absolute right-0"><ChevronRight className="h-4 w-4 mx-auto" /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-y-1 gap-x-2 px-2">
                            {Array.from({ length: 31 }).map((_, i) => {
                              const day = i + 1;
                              const d = new Date(currentView.year, currentView.month, day);
                              const isSelected = selectedDate === `${currentView.year}-${(currentView.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                              const disabled = d < today;
                              return <button key={i} disabled={disabled} onClick={() => handleSelectDate(`${currentView.year}-${(currentView.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)} className={cn("aspect-square rounded-full flex items-center justify-center text-[13.5px]", disabled ? "text-gray-200" : isSelected ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-800 hover:bg-gray-50")}>{day}</button>
                            })}
                        </div>
                      </div>
                    </motion.div>
                  ) : !selectedTime ? (
                    <motion.div key="time" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 flex flex-col h-full">
                      <h4 className="text-[20px] font-medium text-[#111111]">{t('chooseTime')}</h4>
                      <div className="grid grid-cols-4 gap-3">
                         {timeSlots.map(slot => (
                           <button key={slot} onClick={() => setSelectedTime(slot)} className={cn("rounded-lg border py-2.5 text-[13px] font-medium", selectedTime === slot ? "bg-blue-600 border-blue-600 text-white" : "border-blue-600 text-blue-600 hover:bg-blue-50")}>{slot}</button>
                         ))}
                      </div>
                      <button onClick={() => setSelectedDate(null)} className="flex items-center gap-2 text-black/60 pt-4"><ChevronLeft className="h-4 w-4" />{t('selectDate')}</button>
                    </motion.div>
                  ) : (
                    <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 flex flex-col h-full">
                      <h4 className="text-[20px] font-medium text-[#111111]">{t('confirmDetailsTitle')}</h4>
                      <div className="flex-1 space-y-6">
                        <div className="space-y-2 text-black">
                           <label className="text-[13px] font-medium">{t('nameLabel')}</label>
                           <input type="text" defaultValue="dev User" className="w-full rounded-[8px] border p-3" />
                        </div>
                        <div className="space-y-2 text-black">
                           <label className="text-[13px] font-medium">{t('emailLabel')}</label>
                           <input type="email" defaultValue="dev.hrescic@gmail.com" className="w-full rounded-[8px] border p-3" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <button onClick={() => setSelectedTime(null)} className="text-black/60"><ChevronLeft className="h-4 w-4 inline mr-1" />{t('chooseTime')}</button>
                        <button onClick={handleSave} className="rounded-lg bg-[#C6A96B] px-8 py-2.5 font-bold text-black">{t('save')}</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin h-8 w-8 text-[#D4AF37]" /></div>}>
      <VerificationContent />
    </Suspense>
  );
}
