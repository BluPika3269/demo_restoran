'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#0A0A0A] pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Restoran Gourmet'}
            </h3>
            <p className="mb-6 text-gray-400 leading-relaxed">
              Vrhunska gastronomija s više od 20 godina tradicije. Svaki obrok je jedinstveno iskustvo.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="mb-6 text-lg font-bold text-white uppercase tracking-wider">
              Brzi Linkovi
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#about" className="text-gray-400 transition-colors duration-300 hover:text-[#D4AF37]">
                  O Nama
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="text-gray-400 transition-colors duration-300 hover:text-[#D4AF37]">
                  Meni
                </Link>
              </li>
              <li>
                <Link href="/#chef-special" className="text-gray-400 transition-colors duration-300 hover:text-[#D4AF37]">
                  Specijaliteti
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="text-gray-400 transition-colors duration-300 hover:text-[#D4AF37]">
                  Rezervacije
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-6 text-lg font-bold text-white uppercase tracking-wider">
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 shrink-0 text-[#D4AF37] mt-0.5" />
                <span>{process.env.NEXT_PUBLIC_ADDRESS || 'Trg bana Jelačića 1, Zagreb'}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 shrink-0 text-[#D4AF37]" />
                <span>{process.env.NEXT_PUBLIC_PHONE || '+385 1 234 5678'}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 shrink-0 text-[#D4AF37]" />
                <span>{process.env.NEXT_PUBLIC_EMAIL || 'info@gourmet.hr'}</span>
              </li>
            </ul>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="mb-6 text-lg font-bold text-white uppercase tracking-wider">
              Radno Vrijeme
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-[#D4AF37]" />
                <div>
                  <div className="font-semibold text-white">Pon - Pet</div>
                  <div className="text-sm">11:00 - 23:00</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-[#D4AF37]" />
                <div>
                  <div className="font-semibold text-white">Sub - Ned</div>
                  <div className="text-sm">12:00 - 00:00</div>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 border-t border-[#D4AF37]/20 pt-12"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h4 className="mb-4 text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pretplatite se na naš Newsletter
            </h4>
            <p className="mb-6 text-gray-400">
              Budite prvi koji će saznati o novim jelima i specijalnim ponudama
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Vaša email adresa"
                className="flex-1 bg-white/5 border border-[#D4AF37]/30 px-6 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
              />
              <button className="bg-[#D4AF37] px-8 py-3 font-semibold text-black transition-all duration-300 hover:bg-[#E8D89F]">
                Pretplati se
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D4AF37]/20 pt-8 text-center text-gray-500">
          <p>&copy; 2025 {process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Restoran Gourmet'}. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  );
}
