'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const nailImages = [
  'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1610992015765-13a8a1090180?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1610992015732-2449b0c26670?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1610992015718-6ea188bf3801?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop&crop=center',
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % nailImages.length);
    }, 4000); // Mijenja se svake 4 sekunde

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-800 overflow-hidden">
      {/* Background nail images slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <div
            className="w-full h-full bg-cover bg-center filter brightness-50"
            style={{ backgroundImage: `url(${nailImages[currentImageIndex]})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Animated geometric background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-yellow-400 rounded-full opacity-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg opacity-20"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400 rounded-full opacity-30 blur-xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold bg-linear-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Bliss Nails
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Najbolji salon Bliss Nails u gradu s najnovijim trendovima
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a href="/order" className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            Rezerviraj Termin
          </a>
          <a href="#gallery" className="border-2 border-yellow-400 text-yellow-400 dark:text-yellow-400 px-8 py-4 rounded-full font-semibold hover:bg-yellow-400 hover:text-black dark:hover:text-black transition-all duration-300 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Pogledaj Galeriju
          </a>
        </motion.div>
      </div>
    </section>
  );
}