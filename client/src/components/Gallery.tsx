'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

const nailDesigns = [
  {
    id: 1,
    name: 'Baby Boomer Nokti',
    description: 'Moderan twist na francuski manikir s nježnim prijelazom boja',
    image: '/images/Baby Boomer Nokti.png',
    price: '30€'
  },
  {
    id: 2,
    name: 'Ombre Nokti',
    description: 'Gradijentni prijelaz boja za elegantan i moderan izgled',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop',
    price: '28€'
  },
  {
    id: 3,
    name: 'Gel Polish Manikir',
    description: 'Dugotrajan gel lak koji traje do 3 tjedna',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&h=600&fit=crop',
    price: '22€'
  },
  {
    id: 4,
    name: 'Nude Nokti s Detaljima',
    description: 'Prirodan nude izgled s elegantnim zlatnim ili srebrnim akcentima',
    image: '/images/Nude Nokti s Detaljima.png',
    price: '26€'
  },
  {
    id: 5,
    name: 'Matte Finish Nokti',
    description: 'Sofisticirani mat završetak u raznim bojama',
    image: '/images/matte.png',
    price: '24€'
  },
  {
    id: 6,
    name: 'Klasični Crveni Nokti',
    description: 'Bezvremenski crveni manikir za svaku priliku',
    image: '/images/crveni nokti.png',
    price: '20€'
  },
];

export default function Gallery() {
  const [selectedCake, setSelectedCake] = useState<typeof nailDesigns[0] | null>(null);
  const router = useRouter();
  return (
    <section id="gallery" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Najpopularniji Dizajni Noktiju
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Otkrijte naše najpopularnije dizajne noktiju koje najviše traže naše klijentice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nailDesigns.map((cake, index) => (
            <motion.div
              key={cake.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer min-h-[400px] flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {cake.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 min-h-[3rem]">
                  {cake.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-yellow-400">
                    {cake.price}
                  </span>
                  <button onClick={() => router.push('/order')} className="px-6 py-3 sm:px-4 sm:py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors duration-300">
                    Rezerviraj
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal za pregled dizajna */}
      {selectedCake && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedCake(null)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full p-2 shadow-lg z-10 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedCake.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{selectedCake.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-yellow-400">{selectedCake.price}</span>
                <button onClick={() => router.push('/order')} className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Rezerviraj Sada
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}