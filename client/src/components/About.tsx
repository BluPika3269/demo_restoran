'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-24">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <span className="mb-6 inline-block text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Naša Priča
            </span>
            <h2 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tradicija koja živi kroz okuse
            </h2>
            <div className="divider-gold mb-8" />
            <p className="mb-6 text-lg leading-relaxed text-gray-300">
              Već više od 20 godina stvaramo nezaboravna kulinarska iskustva, spajajući tradiciju 
              sa modernim pristupom gastronomiji. Svaki obrok je putovanje kroz vrhunske okuse, 
              pripremljen s pažnjom i ljubavlju prema savršenstvu.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-gray-300">
              Naša kuhinja slavi lokalne sastojke i sezonske proizvode, transformirajući ih u 
              djela kulinarske umjetnosti koja oduševljavaju sve osjetila.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 border-t border-[#D4AF37]/20 pt-6 sm:pt-8">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  20+
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-400">Godina</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  50+
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-400">Jela</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  5★
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-400">Ocjena</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="parallax-container col-span-2 h-48 sm:h-56 md:h-64 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop"
                  alt="Restaurant interior"
                  className="parallax-image h-full w-full object-cover"
                />
              </div>
              <div className="parallax-container h-64 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
                  alt="Dining experience"
                  className="parallax-image h-full w-full object-cover"
                />
              </div>
              <div className="parallax-container h-64 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop"
                  alt="Chef preparing"
                  className="parallax-image h-full w-full object-cover"
                />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
