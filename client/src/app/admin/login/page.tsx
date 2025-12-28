'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@yourbusiness.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple admin login - in production this should be more secure
      if (email === 'admin@yourbusiness.com' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass rounded-lg p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Admin Prijava
              </h1>
              <p className="text-gray-400">Pristup administraciji</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-900/20 border border-red-800 rounded-lg p-4"
                >
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border-2 border-[#333] rounded-lg focus:border-[#D4AF37] focus:outline-none text-white transition-all"
                  placeholder="admin@yourbusiness.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                  Lozinka
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border-2 border-[#333] rounded-lg focus:border-[#D4AF37] focus:outline-none text-white transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#E8D89F] text-black font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 transform hover:scale-105 shadow-lg uppercase tracking-wider"
              >
                {loading ? 'Prijava...' : 'Prijavi se'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Demo kredencijali: admin@yourbusiness.com / admin123</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}