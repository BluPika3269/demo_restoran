'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Heart,
      title: 'S ljubavlju pripremljeno',
      description: 'Svaka torta se priprema s posebnom pažnjom i ljubavlju prema tradiciji.'
    },
    {
      icon: Award,
      title: 'Najkvalitetniji sastojci',
      description: 'Koristimo samo najsvježije i najkvalitetnije sastojke za naše proizvode.'
    },
    {
      icon: Users,
      title: 'Iskustvo od 20 godina',
      description: 'Više od 20 godina iskustva u izradi slastica i torti.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            O Našoj Slastičarni
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Više od 20 godina stvaramo nezaboravne trenutke kroz naše majstorski izrađene torte i slatkiše.
            Naša strast prema slasticama i posvećenost kvalitetu čine nas liderom u industriji.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-linear-to-r from-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 text-white text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Spremni za Vašu Sljedeću Proslavu?
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Kontaktirajte nas danas i zajedno ćemo stvoriti nešto posebno za vaš poseban dan.
          </p>
          <button className="bg-white text-pink-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
            Kontaktirajte Nas
          </button>
        </motion.div>
      </div>
    </section>
  );
}