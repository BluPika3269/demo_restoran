'use client';

import { motion } from 'framer-motion';

const specialDishes = [
  {
    id: 1,
    name: 'Signature Wagyu',
    chef: 'Chef Ivan Kovačević',
    description: 'Japanski Wagyu steak s tartufom, parmezanom i redukcijom od crvenog vina. Savršena kombinacija istoka i zapada.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop',
    price: '60€'
  },
  {
    id: 2,
    name: 'Lobster Thermidor',
    chef: 'Chef Ivan Kovačević',
    description: 'Klasični francuski desert pripreman sa svježim jastogom, šampanjac kremom i parmezanom.',
    image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?q=80&w=2070&auto=format&fit=crop',
    price: '50€'
  },
  {
    id: 3,
    name: 'Tuna Tataki',
    chef: 'Chef Ivan Kovačević',
    description: 'Sashimi kvalitete tuna, brzo pečena i servirana sa soja-sezam glazurom i wakame salatom.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2027&auto=format&fit=crop',
    price: '26€'
  },
];

export default function ChefSpecial() {
  return (
    <section id="chef-special" className="relative py-16 sm:py-24 lg:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <span className="mb-6 inline-block text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            Chefovi Izbor
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Signature Jela
          </h2>
          <div className="divider-gold" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Naši najpoznatiji specijaliteti, kreiran sa strašću i savršenstvom
          </p>
        </motion.div>

        {/* Dishes */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-24">
          {specialDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="parallax-container group relative overflow-hidden rounded-lg">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="parallax-image h-96 w-full object-cover lg:h-[500px]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="mb-4 text-sm uppercase tracking-wider text-[#D4AF37]">
                  {dish.chef}
                </span>
                <h3 className="mb-6 text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {dish.name}
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-gray-300">
                  {dish.description}
                </p>
                <div>
                  <a
                    href="/reservations"
                    className="inline-block border-2 border-[#D4AF37] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
                  >
                    Rezerviraj & Kušaj
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
