"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // In a real app, this would be an API call to authenticate
      // For now, we'll simulate a login and store user in localStorage
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({ email, role: 'customer' }));
        router.push('/dashboard');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <header className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif gold-text tracking-widest">
          SPEED<span className="text-white">ELITE</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif mb-2">Welcome Back</h1>
            <p className="text-white/50">Sign in to view your events and bookings</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#F4D693] transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#F4D693] transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full gold-gradient text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-white/50">
            Don't have an account? <Link href="/" className="text-[#F4D693] hover:underline">Book an event to register</Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
