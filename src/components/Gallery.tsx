'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';

const cakes = [
  {
    id: 1,
    name: 'Čokoladna Torta',
    description: 'Bogata čokoladna torta sa kremom od vanilije',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center',
    price: '25€'
  },
  {
    id: 2,
    name: 'Voćna Torta',
    description: 'Svježe voće na laganoj biskvit bazi',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop&crop=center',
    price: '30€'
  },
  {
    id: 3,
    name: 'Krem Torta',
    description: 'Klasična krem torta sa šlagom',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center',
    price: '20€'
  },
  {
    id: 4,
    name: 'Red Velvet',
    description: 'Crvena baršunasta torta sa krem sirom',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop&crop=center',
    price: '28€'
  },
  {
    id: 5,
    name: 'Tiramisu',
    description: 'Talijanski desert s mascarpone kremom i kavom',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center',
    price: '22€'
  },
  {
    id: 6,
    name: 'Cheesecake',
    description: 'Kremasti cheesecake s voćnim preljevom',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop&crop=center',
    price: '24€'
  },
];

export default function Gallery() {
  const [selectedCake, setSelectedCake] = useState<typeof cakes[0] | null>(null);
  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Naša Galerija Torta
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Otkrijte naše majstorski izrađene torte, svaka napravljena s ljubavlju i pažnjom
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cakes.map((cake, index) => (
            <motion.div
              key={cake.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedCake(cake)}
            >
              <div className="relative h-64 bg-gray-200">
                <Image
                  src={cake.image}
                  alt={cake.name}
                  fill
                  className="object-cover rounded-t-2xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {cake.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {cake.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-500">
                    {cake.price}
                  </span>
                  <button className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors duration-300">
                    Naruči
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal za pregled torte */}
      {selectedCake && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedCake(null)}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10"
                onClick={() => setSelectedCake(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <Image
                src={selectedCake.image.replace('w=400&h=300', 'w=800&h=600')}
                alt={selectedCake.name}
                width={800}
                height={600}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedCake.name}</h3>
              <p className="text-gray-600 mb-6 text-lg">{selectedCake.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-pink-500">{selectedCake.price}</span>
                <button className="bg-linear-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Naruči Sada
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}