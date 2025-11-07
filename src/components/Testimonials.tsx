'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ana Kovačić',
    text: 'Najbolja torta koju sam ikada probala! Slastičarna je napravila savršen rođendanski kolač za moju kćer.',
    rating: 5,
    image: '👩'
  },
  {
    id: 2,
    name: 'Marko Horvat',
    text: 'Profesionalna usluga i izvanredan okus. Svaki put se vraćam po još.',
    rating: 5,
    image: '👨'
  },
  {
    id: 3,
    name: 'Petra Novak',
    text: 'Torta za vjenčanje bila je prekrasna i ukusna. Preporučujem svima!',
    rating: 5,
    image: '👩‍💼'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Što Kažu Naši Kupci
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Zadovoljstvo naših kupaca je naša najveća nagrada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <span className="text-3xl mr-3">{testimonial.image}</span>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">Sretan kupac</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}