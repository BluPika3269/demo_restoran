'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  image: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
    type: string;
  };
}

// Funkcija za dobijanje default slike
const getDefaultImage = (index: number) => {
  const images = [
    '/images/Baby Boomer Nokti.png',
    '/images/crveni nokti.png',
    '/images/matte.png',
    '/images/Nude Nokti s Detaljima.png'
  ];
  return images[index % images.length];
};

export default function Gallery() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState<Service | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          // Prikaži prvih 6 usluga i dodaj lokalne slike ako service nema sliku
          const servicesWithImages = data.slice(0, 6).map((service: Service, index: number) => ({
            ...service,
            image: service.image || getDefaultImage(index)
          }));
          setServices(servicesWithImages);
        } else {
          // Fallback ako API ne radi - prikaži dummy podatke sa lokalnim slikama
          setServices([
            { id: 1, name: 'Gel Lakiranje', description: 'Trajni gel lak u boji po izboru', price: 30, duration: 60, image: '/images/crveni nokti.png', categoryId: 1, category: { id: 1, name: 'Gellak', type: 'service' } },
            { id: 2, name: 'French Manikura', description: 'Elegantna french manikura', price: 35, duration: 90, image: '/images/Baby Boomer Nokti.png', categoryId: 1, category: { id: 1, name: 'Manikir', type: 'service' } },
            { id: 3, name: 'Ojačanje Noktiju', description: 'Ojačanje prirodnih noktiju gelom', price: 40, duration: 90, image: '/images/matte.png', categoryId: 2, category: { id: 2, name: 'Geliranje', type: 'service' } },
            { id: 4, name: 'Baby Boomer Nokti', description: 'Popularan ombre dizajn', price: 45, duration: 120, image: '/images/Baby Boomer Nokti.png', categoryId: 3, category: { id: 3, name: 'Ugradnja', type: 'service' } },
            { id: 5, name: 'Nail Art Dizajn', description: 'Kreativni dizajn po želji', price: 50, duration: 150, image: '/images/Nude Nokti s Detaljima.png', categoryId: 3, category: { id: 3, name: 'Ugradnja', type: 'service' } },
            { id: 6, name: 'Produžetak Noktiju', description: 'Produžetak gelom ili akrikom', price: 55, duration: 120, image: '/images/crveni nokti.png', categoryId: 3, category: { id: 3, name: 'Ugradnja', type: 'service' } }
          ]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback podatci sa lokalnim slikama
        setServices([
          { id: 1, name: 'Gel Lakiranje', description: 'Trajni gel lak u boji po izboru', price: 30, duration: 60, image: '/images/Baby Boomer Nokti.png', categoryId: 1, category: { id: 1, name: 'Gellak', type: 'service' } },
          { id: 2, name: 'French Manikura', description: 'Elegantna french manikura', price: 35, duration: 90, image: '/images/crveni nokti.png', categoryId: 1, category: { id: 1, name: 'Manikir', type: 'service' } },
          { id: 3, name: 'Ojačanje Noktiju', description: 'Ojačanje prirodnih noktiju gelom', price: 40, duration: 90, image: '/images/matte.png', categoryId: 2, category: { id: 2, name: 'Geliranje', type: 'service' } },
          { id: 4, name: 'Baby Boomer Nokti', description: 'Popularan ombre dizajn', price: 45, duration: 120, image: '/images/Nude Nokti s Detaljima.png', categoryId: 3, category: { id: 3, name: 'Ugradnja', type: 'service' } },
          { id: 5, name: 'Nail Art Dizajn', description: 'Kreativni dizajn po želji', price: 50, duration: 150, image: '/images/Baby Boomer Nokti.png', categoryId: 3, category: { id: 3, name: 'Ugradnja', type: 'service' } },
          { id: 6, name: 'Produžetak Noktiju', description: 'Produžetak gelom ili akrikom', price: 55, duration: 120, image: '/images/crveni nokti.png', categoryId: 3, category: { id: 3, name: 'Ugradnja', type: 'service' } }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
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

        {loading ? (
          <div className="text-center col-span-full py-20">
            <p className="text-xl text-gray-600 dark:text-gray-300">Učitavam usluge...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center col-span-full py-20">
            <p className="text-xl text-gray-600 dark:text-gray-300">Nema dostupnih usluga</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer min-h-[400px] flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedCake(service)}
              >
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={service.image || '/images/Baby Boomer Nokti.png'}
                    alt={service.name}
                    fill
                    className="object-cover rounded-t-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 min-h-[3rem]">
                    {service.description || `${service.category.name} - ${service.duration} min`}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-400">
                      {service.price}€
                    </span>
                    <button onClick={() => router.push('/order')} className="px-6 py-3 sm:px-4 sm:py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors duration-300">
                      Rezerviraj
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
                src={selectedCake.image || '/images/Baby Boomer Nokti.png'}
                alt={selectedCake.name}
                width={800}
                height={600}
                className="w-full h-64 md:h-96 object-cover"
                unoptimized
              />
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedCake.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{selectedCake.description || `${selectedCake.category.name} - ${selectedCake.duration} min`}</p>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-yellow-400">{selectedCake.price}€</span>
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