'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const menuItems = [
    { href: '/#about', label: 'O Nama' },
    { href: '/#gallery', label: 'Meni' },
    { href: '/#chef-special', label: 'Specijaliteti' },
    { href: '/#contact', label: 'Kontakt' },
    { href: '/admin/login', label: 'Admin' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md py-3 md:py-4 shadow-2xl border-b border-[#D4AF37]/20'
            : 'bg-black/30 backdrop-blur-sm py-4 md:py-6'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button - Left on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white z-50 p-2 -ml-2 order-first"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Logo - Center on mobile, left on desktop */}
            <Link href="/" className="group z-50 lg:order-first">
              <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] transition-all duration-300 group-hover:text-[#E8D89F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Gourmet'}
              </span>
            </Link>

            {/* Spacer for mobile to keep logo centered */}
            <div className="w-10 lg:hidden"></div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm uppercase tracking-wider text-white/90 transition-colors duration-300 hover:text-[#D4AF37]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/reservations"
                className="ml-2 bg-[#D4AF37] px-5 xl:px-6 py-2 xl:py-2.5 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-300 hover:bg-[#E8D89F] hover:shadow-lg rounded"
              >
                Rezerviraj
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#0A0A0A]/98 backdrop-blur-xl" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative h-full flex flex-col items-center justify-center px-4"
            >
              <div className="w-full max-w-sm space-y-6">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center text-2xl font-semibold text-white/90 hover:text-[#D4AF37] transition-colors py-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4"
                >
                  <Link
                    href="/reservations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-[#D4AF37] px-8 py-4 text-center text-lg font-bold uppercase tracking-wider text-black transition-all hover:bg-[#E8D89F] rounded-lg"
                  >
                    Rezerviraj Stol
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
