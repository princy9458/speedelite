"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Ticket, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Fetch all events and bookings
    // In a real app, we'd fetch bookings specific to this user
    Promise.all([
      fetch('/api/events?limit=100').then(res => res.json()),
      fetch('/api/bookings?limit=200').then(res => res.json())
    ]).then(([eventsData, bookingsData]) => {
      setEvents(eventsData.data || []);
      // Mock filtering bookings for this user based on email (since we don't have real auth)
      const userBookings = (bookingsData.data || []).filter((b: any) => b.user?.email === parsedUser.email);
      setBookings(userBookings);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <header className="bg-black/50 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif gold-text tracking-widest">
            SPEED<span className="text-white">ELITE</span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-white/70 hidden md:inline-block">Welcome, {user.email}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <section>
          <h2 className="text-3xl font-serif mb-8 flex items-center gap-3">
            <Ticket className="text-[#F4D693]" />
            Your Bookings
          </h2>
          
          {bookings.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-white/50">
              <p className="mb-6">You don't have any upcoming events.</p>
              <Link href="/" className="gold-gradient text-black font-bold py-3 px-8 rounded-full inline-block">
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking, i) => {
                const event = events.find(e => e._id === booking.event?._id);
                if (!event) return null;
                
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all"
                  >
                    <div className="h-32 bg-black/50 relative">
                      {event.featuredImage && (
                        <img src={event.featuredImage} alt={event.title} className="w-full h-full object-cover opacity-50" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <span className="px-3 py-1 bg-[#F4D693] text-black text-xs font-bold rounded-full uppercase tracking-wider">
                          Confirmed
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-serif">{event.title}</h3>
                      
                      <div className="space-y-2 text-sm text-white/70">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#F4D693]" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#F4D693]" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#F4D693]" />
                          {event.location}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                        <span className="text-white/50">Ticket ID: #{booking._id.slice(-6).toUpperCase()}</span>
                        <span className="font-bold text-[#F4D693]">€{booking.amountPaid}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif">Upcoming Events</h2>
            <Link href="/" className="text-[#F4D693] hover:underline text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.filter(e => e.status === 'published').slice(0, 4).map((event, i) => (
              <Link href="/" key={i}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#F4D693]/50 transition-all cursor-pointer h-full flex flex-col"
                >
                  <div className="h-40 relative overflow-hidden">
                    {event.featuredImage ? (
                      <img src={event.featuredImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-black/50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-serif text-lg mb-2 group-hover:text-[#F4D693] transition-colors">{event.title}</h3>
                    <div className="text-sm text-white/50 space-y-1 mb-4">
                      <p>{new Date(event.date).toLocaleDateString()}</p>
                      <p>{event.location}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-xs uppercase tracking-wider text-white/50">{event.language}</span>
                      <span className="text-[#F4D693] font-bold">From €{Math.min(event.priceFemale, event.priceMale)}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

