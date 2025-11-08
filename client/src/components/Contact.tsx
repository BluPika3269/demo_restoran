'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Kontaktirajte Nas
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Imate pitanja ili želite rezervirati termin? Javite nam se!
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Adresa */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Adresa</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              Ilica 242, Zagreb, Hrvatska
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Ilica+242,+10000+Zagreb,+Hrvatska"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Kreni
            </a>
          </div>

          {/* Telefon */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Telefon</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              +385 1 987 6543
            </p>
            <a
              href="tel:+38519876543"
              className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Zovi
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              info@salon-za-nokte.hr
            </p>
            <a
              href="mailto:info@salon-za-nokte.hr"
              className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Pošalji
            </a>
          </div>

          {/* Radno Vrijeme */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Radno Vrijeme</h3>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              Pon - Pet: 9:00 - 19:00<br />
              Sub: 9:00 - 16:00<br />
              Ned: Zatvoreno
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}