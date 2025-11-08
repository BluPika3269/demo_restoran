'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ana Kovačić',
    text: 'Najbolji salon Bliss Nails koji sam posjetila! Majstorica je napravila savršen francuski manikir.',
    rating: 5,
    image: '👩'
  },
  {
    id: 2,
    name: 'Marko Horvat',
    text: 'Profesionalna usluga i kreativni dizajni. Svaki put se vraćam zadovoljna.',
    rating: 5,
    image: '👨'
  },
  {
    id: 3,
    name: 'Petra Novak',
    text: 'Nail art za vjenčanje bio je prekrasan i trajao je cijeli dan. Preporučujem svima!',
    rating: 5,
    image: '👩‍💼'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Što Kažu Naše Klijentice
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Zadovoljstvo naših klijentica je naša najveća nagrada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <span className="text-3xl mr-3">{testimonial.image}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sretan kupac</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}