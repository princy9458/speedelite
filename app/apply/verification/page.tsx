"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Calendar as CalendarIcon, Clock, Globe, Video, ChevronLeft, ChevronRight, X, Check, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressSteps from "@/components/apply/ProgressSteps";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { cn } from "@/lib/utils";

export default function VerificationPage() {
  const router = useRouter();
  const { lang, interview, setInterview } = useBookingStore();
  const t = getDictionary(lang);
  const [showCalendar, setShowCalendar] = useState(false);

  // Calendar state for navigation
  const [currentView, setCurrentView] = useState({
    month: 2, // 0-indexed (March = 2)
    year: 2026,
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

      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }

      return { month: newMonth, year: newYear };
    });
  };

  // Step 1: Select Date
  const handleSelectDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    dateObj.setHours(0, 0, 0, 0);

    if (dateObj < today) return; 
    setSelectedDate(dateStr);
  };

  // Step 2: Select Time
  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  // Step 3: Finalize Booking
  const handleSave = () => {
    if (!selectedDate || !selectedTime) return;

    setInterview({
      date: selectedDate,
      time: selectedTime,
      timezone: "Europe/Zagreb",
    });
    setIsConfirmed(true);
  };

  const handleCloseConfirmation = () => {
    setShowCalendar(false);
    // Reset for next time if needed, or keep for "Change slot" logic
    setTimeout(() => {
      setIsConfirmed(false);
      setSelectedDate(null);
      setSelectedTime(null);
    }, 500);
  };

  const getMonthName = (month: number, year: number) => {
    return new Date(year, month).toLocaleString(lang === "hr" ? "hr-HR" : "en-US", { month: 'long', year: 'numeric' });
  };

  const timeSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
    "10:00 PM"
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-20 space-y-12">
      {/* Centered Logo Section */}
      <div className="flex flex-col items-center justify-center pt-8">
        <div className="flex items-center gap-3">
          <Image
            src="/website/se_logo.png"
            alt="SpeedElite Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-serif text-[28px] text-white font-medium tracking-tight">
            SpeedElite
          </span>
        </div>
      </div>

      <ProgressSteps steps={t.apply.steps} currentStep={4} />

      <div className="max-w-[840px] space-y-8 text-left translate-y-[-24px]">
        <div className="space-y-5">
          <h1 className="text-[28px] font-bold text-white tracking-tight">
            {lang === "hr" ? "Rezervacija video intervjua" : "Booking a video interview"}
          </h1>
          <p className="text-[15.5px] leading-relaxed text-[#BFBFBF] max-w-3xl">
            {lang === "hr"
              ? "Kako bismo osigurali ozbiljnost prijavnog procesa i kvalitetniju selekciju kandidata, nakon prijave slijedi i kratki video intervju (u trajanju do 3 minute). Cilj je potvrditi identitet prijavljenih te steći bolji uvid u njihove osobine, interese i motivaciju."
              : "In order to ensure the seriousness of the application process and a better selection of candidates, a short video interview (up to 3 minutes) follows the application. The goal is to confirm the identity of the applicants and gain a better insight into their characteristics, interests and motivation."
            }
          </p>
        </div>

        {!interview ? (
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedDate(null);
                setSelectedTime(null);
                setIsConfirmed(false);
                setShowCalendar(true);
              }}
              className="bg-[linear-gradient(135deg,#E7C873,#D4AF37)] rounded-[10px] px-8 py-3 text-[14px] font-bold text-black shadow-[0_4px_20px_rgba(231,200,115,0.3)] transition-all hover:brightness-105 active:scale-[0.98]"
            >
              {lang === "hr" ? "Rezerviraj termin" : "Book an appointment"}
            </button>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            <button
              onClick={() => {
                setSelectedDate(interview.date);
                setSelectedTime(interview.time);
                setIsConfirmed(false);
                setShowCalendar(true);
              }}
              className="bg-[linear-gradient(135deg,#E7C873,#D4AF37)] rounded-[10px] px-8 py-3 text-[14px] font-bold text-black shadow-[0_4px_20px_rgba(231,200,115,0.3)] transition-all hover:brightness-105 active:scale-[0.98]"
            >
              {lang === "hr" ? "Promjeni termin" : "Change slot"}
            </button>

            <div className="rounded-[20px] border border-white/10 bg-[#16130D]/60 p-8 backdrop-blur-xl max-w-[600px]">
              <div className="space-y-6">
                 <div className="flex items-center gap-4 text-white/90">
                    <ShieldCheck className="h-6 w-6 text-[#E7C873]" />
                    <span className="text-xl font-medium tracking-tight">dev User</span>
                 </div>

                 <div className="grid gap-4 text-white/60">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#E7C873]/50" />
                      <span className="text-[15px]">{interview.time}, {new Date(interview.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' })}.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-[#E7C873]/50" />
                      <span className="text-[15px]">{interview.timezone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-[#E7C873]/50" />
                      <span className="text-[15px]">{lang === "hr" ? "Detalji o web konferenciji slijede." : "Web conference details to follow."}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
          <button
            onClick={() => router.push("/apply/payment")}
            className="rounded-[10px] border border-white/60 bg-transparent px-8 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-white/5"
          >
            {lang === "hr" ? "Natrag" : "Back"}
          </button>

          <button
            disabled={!interview}
            onClick={() => router.push("/apply/confirmation")}
            className={cn(
              "rounded-[8px] px-9 py-2.5 text-[14px] font-bold transition-all active:scale-[0.98]",
              interview
                ? "bg-[#C6A96B] text-[#1a1a1a] opacity-90 hover:opacity-100 hover:bg-[#D4AF37] hover:text-black shadow-sm"
                : "bg-white/10 text-white/20 cursor-not-allowed border border-white/5"
            )}
          >
            {lang === "hr" ? "Završetak" : "Completion"}
          </button>
        </div>
      </div>

      {/* Premium Light Booking Modal */}
      <AnimatePresence>
        {showCalendar && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0" 
              onClick={() => setShowCalendar(false)} 
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-[860px] overflow-hidden rounded-[12px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-black/5 flex flex-col md:flex-row min-h-[540px]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCalendar(false)}
                className="absolute right-4 top-4 z-20 rounded-full p-2 text-black/20 hover:bg-black/5 hover:text-black/60 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Side: Light Gray Info Panel - Hidden during confirmation */}
              {!isConfirmed && (
                <div className="bg-[#F5F5F5] p-10 md:w-[35%] flex flex-col space-y-8">
                  <div className="flex flex-col items-start gap-6">
                    <div className="bg-black rounded-full p-2 h-16 w-16 flex items-center justify-center shadow-lg">
                        <Image
                          src="/website/se_logo.png"
                          alt="Logo"
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                    </div>
                    
                    <h3 className="text-[26px] font-bold text-[#111111] leading-[1.2] tracking-tight">
                      {lang === "hr" ? "Online video selekcija" : "Online video selection"}
                    </h3>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3 text-[#666666]">
                      <Clock className="h-5 w-5 text-black/40" />
                      <span className="text-[14px]">
                        {lang === "hr" ? "trajanje 3 minute" : "duration 3 minutes"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-[#666666]">
                      <Video className="mt-1 h-5 w-5 shrink-0 text-black/40" />
                      <span className="text-[14px] leading-relaxed">
                        {lang === "hr" 
                          ? "Pojedinosti o web konferenciji dostavit će se nakon potvrde datuma." 
                          : "Web conference details will be provided after confirmation of the date."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Side / Centered Content: Step-based Content */}
              <div className={cn(
                "p-10 bg-white relative flex flex-col min-h-[500px]",
                isConfirmed ? "w-full items-center justify-center text-center" : "md:w-[65%]"
              )}>
                <AnimatePresence mode="wait">
                  {isConfirmed ? (
                    <motion.div 
                      key="confirmation"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-[500px] space-y-10"
                    >
                      {/* Confirmation Header */}
                      <div className="flex flex-col items-center gap-6">
                        <div className="bg-black rounded-full p-2 h-20 w-20 flex items-center justify-center shadow-md">
                          <Image
                            src="/website/se_logo.png"
                            alt="Logo"
                            width={44}
                            height={44}
                            className="object-contain"
                          />
                        </div>

                        <div className="space-y-2">
                           <div className="flex items-center justify-center gap-2 text-[#111111] font-bold text-[24px]">
                             <div className="bg-[#2F6BFF] rounded-full p-1 border-2 border-white shadow-sm">
                               <Check className="h-4 w-4 text-white" />
                             </div>
                             <span>{lang === "hr" ? "Datum je potvrđen." : "The date is confirmed."}</span>
                           </div>
                           <p className="text-[#666666] text-[14px]">
                             {lang === "hr" 
                               ? "Pozivnica u kalendaru poslana je na vašu adresu e-pošte." 
                               : "A calendar invitation has been sent to your email address."}
                           </p>
                        </div>
                      </div>

                      {/* Schedule Summary Card */}
                      <div className="rounded-[12px] border border-[#EEEEEE] bg-[#FDFDFD] p-8 text-left space-y-6">
                        <h5 className="text-[16px] font-bold text-[#111111]">
                          {lang === "hr" ? "Raspored video odabira" : "Video selection schedule"}
                        </h5>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-[#777777]">
                            <User className="h-5 w-5 text-[#BBBBBB]" />
                            <span className="text-[15px] font-medium text-[#444444]">dev User</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#777777]">
                            <CalendarIcon className="h-5 w-5 text-[#BBBBBB]" />
                            <span className="text-[15px] font-medium text-[#444444]">
                               {selectedTime}, {new Date(selectedDate!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[#777777]">
                            <Globe className="h-5 w-5 text-[#BBBBBB]" />
                            <span className="text-[15px] font-medium text-[#444444]">Europe/Zagreb</span>
                          </div>
                          <div className="flex items-start gap-3 text-[#777777]">
                            <Video className="h-5 w-5 text-[#BBBBBB] mt-0.5" />
                            <span className="text-[15px] font-medium text-[#444444]">
                              {lang === "hr" ? "Slijede detalji o web konferenciji." : "Details about the web conference follow."}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleCloseConfirmation}
                        className="w-full rounded-[10px] bg-[linear-gradient(135deg,#E7C873,#D4AF37)] py-3.5 text-[15px] font-bold text-black shadow-lg transition-all hover:brightness-105 active:scale-[0.98]"
                      >
                        {lang === "hr" ? "Zatvori" : "Close"}
                      </button>
                    </motion.div>
                  ) : !selectedDate ? (
                    <motion.div 
                      key="calendar"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8 flex-1"
                    >
                      <h4 className="text-[20px] font-medium text-[#111111] tracking-tight">
                        {lang === "hr" ? "Odaberite datum:" : "Select date:"}
                      </h4>
                      
                      <div className="space-y-8">
                        {/* Month Picker Header */}
                        <div className="flex items-center justify-center gap-12 relative">
                          <button 
                            onClick={() => handleMonthNav("prev")}
                            disabled={isCurrentMonth}
                            className={cn(
                              "h-8 w-8 rounded-full border border-black/5 bg-[#F0F0F0] flex items-center justify-center text-black/40 hover:bg-black/5 transition-all absolute left-0",
                              isCurrentMonth && "opacity-40 cursor-not-allowed pointer-events-none"
                            )}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          
                          <span className="text-[14px] font-semibold text-[#111111] tracking-wide first-letter:uppercase">
                            {getMonthName(currentView.month, currentView.year)}
                          </span>
                          
                          <button 
                            onClick={() => handleMonthNav("next")}
                            className="h-8 w-8 rounded-full border border-black/5 bg-[#F0F0F0] flex items-center justify-center text-black/40 hover:bg-black/5 transition-colors absolute right-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          {/* Week Labels */}
                          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-[#999999] px-2">
                            {lang === "hr" 
                              ? ["Su", "Po", "Ut", "Sr", "Če", "Pe", "Su"] 
                              : ["Are", "Mo", "Here", "We", "Th", "Fr", "With"]
                            }
                          </div>
                          
                          {/* Calendar Grid */}
                          <div className="grid grid-cols-7 gap-y-1 gap-x-2 px-2">
                            {Array.from({ length: 31 }).map((_, i) => {
                              const day = i + 1;
                              const dateObj = new Date(currentView.year, currentView.month, day);
                              dateObj.setHours(0, 0, 0, 0);
                              
                              const isSelected = selectedDate === `${currentView.year}-${(currentView.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                              const isDisabled = dateObj < today;
                              
                              return (
                                <button
                                  key={i}
                                  disabled={isDisabled}
                                  onClick={() => handleSelectDate(`${currentView.year}-${(currentView.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)}
                                  className={cn(
                                    "aspect-square rounded-full flex items-center justify-center text-[13.5px] font-medium transition-all duration-300 relative",
                                    isDisabled ? "text-[#D3D3D3] cursor-not-allowed pointer-events-none" : 
                                    isSelected ? "bg-[#E6F0FF] text-[#2F6BFF] font-bold" :
                                    "text-[#333333] hover:bg-black/5"
                                  )}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : !selectedTime ? (
                    <motion.div 
                      key="time"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8 flex flex-col h-full"
                    >
                      <h4 className="text-[20px] font-medium text-[#111111] tracking-tight">
                        {lang === "hr" ? "Odaberite vrijeme:" : "Choose time:"}
                      </h4>

                      <div className="flex-1 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
                        <div className="grid grid-cols-4 gap-3 pb-6">
                           {timeSlots.map((slot) => {
                             const isSlotSelected = selectedTime === slot;
                             return (
                               <button
                                 key={slot}
                                 onClick={() => handleSelectTime(slot)}
                                 className={cn(
                                   "rounded-[8px] border py-2.5 text-[13px] font-medium transition-all duration-300",
                                   isSlotSelected 
                                     ? "bg-[#2F6BFF] border-[#2F6BFF] text-white shadow-md shadow-blue-500/20" 
                                     : "border-[#2F6BFF] text-[#2F6BFF] bg-transparent hover:bg-blue-50"
                                 )}
                               >
                                 {slot}
                               </button>
                             );
                           })}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-black/5">
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="flex items-center gap-2 rounded-[6px] border border-black/10 px-4 py-2 text-[12px] font-medium text-[#111111] hover:bg-[#F5F5F5] transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          {lang === "hr" ? "Datum" : "Date"}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8 flex flex-col h-full"
                    >
                      <h4 className="text-[20px] font-medium text-[#111111] tracking-tight">
                        {lang === "hr" ? "Potvrda detalja:" : "Confirm details:"}
                      </h4>

                      <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                           <label className="text-[13px] font-medium text-[#111111]">
                            {lang === "hr" ? "Ime" : "Name"}
                           </label>
                           <input 
                             type="text" 
                             defaultValue="dev User"
                             className="w-full rounded-[8px] border border-[#DADADA] bg-white p-3 text-[14px] text-[#111111] placeholder:text-black/20 focus:outline-none focus:ring-1 focus:ring-[#C6A96B]/30"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[13px] font-medium text-[#111111]">
                            {lang === "hr" ? "E-pošta" : "Email"}
                           </label>
                           <input 
                             type="email" 
                             defaultValue="dev.hrescic@gmail.com"
                             className="w-full rounded-[8px] border border-[#DADADA] bg-white p-3 text-[14px] text-[#111111] placeholder:text-black/20 focus:outline-none focus:ring-1 focus:ring-[#C6A96B]/30"
                           />
                        </div>
                        <div className="pt-4 border-t border-black/5" />
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <button
                          onClick={() => setSelectedTime(null)}
                          className="flex items-center gap-2 rounded-[6px] border border-black/10 px-4 py-2 text-[12px] font-medium text-[#111111] hover:bg-[#F5F5F5] transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          {lang === "hr" ? "Vrijeme" : "Time"}
                        </button>

                        <button
                          onClick={handleSave}
                          className="rounded-[8px] bg-[#C6A96B] px-8 py-2.5 text-[14px] font-bold text-[#111111] transition-all hover:bg-[#D4AF37] active:scale-[0.98] shadow-sm"
                        >
                          {lang === "hr" ? "Spremi" : "Save"}
                        </button>
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
