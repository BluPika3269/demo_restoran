'use client';

import { motion } from 'framer-motion';
import { Cake, ShoppingCart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-pink-200 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Slastičarna
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Najukusnije torte i slatkiši u gradu
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a href="/order" className="bg-linear-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <Cake className="w-5 h-5" />
            Naruči Tortu
          </a>
          <a href="#gallery" className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-500 hover:text-white transition-all duration-300 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Pogledaj Galeriju
          </a>
        </motion.div>
      </div>
    </section>
  );
}