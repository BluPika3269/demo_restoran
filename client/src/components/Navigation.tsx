'use client';

import { motion } from 'framer-motion';
import { Menu, Minus, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Početna', href: '/' },
    { name: 'Galerija', href: '/#gallery' },
    { name: 'Rezerviraj', href: '/order' },
    { name: 'O nama', href: '/#about' },
    { name: 'Kontakt', href: '/#contact' },
    { name: 'Admin', href: '/admin/login' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Mobile hamburger - FIXED */}
          <div className="md:hidden fixed left-4 top-4 z-[100]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400 transition-all duration-300 bg-white dark:bg-gray-900 rounded-lg"
            >
              <Menu className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
            </button>
          </div>

          <motion.a
            href="/"
            className="flex items-center space-x-2 md:order-1 text-center md:text-left w-full md:w-auto justify-center md:justify-start cursor-pointer hover:opacity-80 transition-opacity duration-300"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Bliss Nails</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 order-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400 transition-colors duration-300 font-medium"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4 order-3">
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400 transition-colors duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}