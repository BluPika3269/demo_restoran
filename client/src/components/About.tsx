'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Sparkles } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Sparkles,
      title: 'Najnoviji Trendovi',
      description: 'Pratimo najnovije trendove u manikuri i pedikuri s vrhunskim proizvodima.'
    },
    {
      icon: Award,
      title: 'Profesionalna Usluga',
      description: 'Naše majstorice imaju godine iskustva u pružanju vrhunske njege noktiju.'
    },
    {
      icon: Users,
      title: 'Iskustvo od 15 godina',
      description: 'Više od 15 godina stvaramo ljepotu i zadovoljavamo naše klijentice.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            O Našem Salonu
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Više od 15 godina stvaramo ljepotu i njegujemo nokte naših klijentica.
            Naša strast prema ljepoti i posvećenost kvalitetu čine nas liderom u industriji.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-linear-to-r from-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Spremni za Vašu Transformaciju?
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Kontaktirajte nas danas i zajedno ćemo stvoriti savršen izgled za vaše nokte.
          </p>
          <a href="/order" className="inline-block bg-white dark:bg-gray-900 text-purple-600 dark:text-yellow-400 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
            Rezervirajte Termin
          </a>
        </motion.div>
      </div>
    </section>
  );
}