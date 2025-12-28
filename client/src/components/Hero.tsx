'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden min-h-[600px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop)',
            backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-4 sm:mb-6"
        >
          <span className="inline-block text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#D4AF37] mb-2 sm:mb-4">
            Vrhunska Gastronomija
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-4 sm:mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white px-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Restoran Gourmet'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mb-8 sm:mb-12 max-w-xl lg:max-w-2xl text-base sm:text-lg md:text-xl text-gray-300 px-4"
        >
          {process.env.NEXT_PUBLIC_BUSINESS_TAGLINE || 'Gdje se okusi spajaju sa tradicijom'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center"
        >
          <Link
            href="/reservations"
            className="btn-premium group relative overflow-hidden bg-[#D4AF37] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black transition-all hover:bg-[#E8D89F] rounded text-center w-full sm:w-auto"
          >
            Rezerviraj Stol
          </Link>
          <Link
            href="/#gallery"
            className="btn-premium group relative overflow-hidden border-2 border-[#D4AF37] bg-transparent px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black rounded text-center w-full sm:w-auto"
          >
            Pogledaj Meni
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs uppercase tracking-wider text-gray-400">Skrolaj dolje</span>
            <ChevronDown className="h-5 w-5 text-[#D4AF37]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
