'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Image from 'next/image';

const cakes = [
  { id: 1, name: 'Čokoladna Torta', price: 25, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=150&fit=crop&crop=center' },
  { id: 2, name: 'Voćna Torta', price: 30, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=200&h=150&fit=crop&crop=center' },
  { id: 3, name: 'Krem Torta', price: 20, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop&crop=center' },
  { id: 4, name: 'Red Velvet', price: 28, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=200&h=150&fit=crop&crop=center' },
  { id: 5, name: 'Tiramisu', price: 22, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=150&fit=crop&crop=center' },
  { id: 6, name: 'Cheesecake', price: 24, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&h=150&fit=crop&crop=center' },
];

export default function Order() {
  const [selectedCake, setSelectedCake] = useState<number | null>(null);
  const [customizations, setCustomizations] = useState({
    size: 'small',
    message: '',
    date: '',
    time: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    alert('Narudžba poslana! Kontaktirat ćemo vas uskoro.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Naručite Tortu
            </h1>
            <p className="text-xl text-gray-600">
              Odaberite svoju omiljenu tortu i prilagodite je po želji
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Cake Selection */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Odaberite Tortu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cakes.map((cake) => (
                    <motion.div
                      key={cake.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedCake === cake.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                      onClick={() => setSelectedCake(cake.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={cake.image}
                          alt={cake.name}
                          width={60}
                          height={45}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{cake.name}</div>
                          <div className="text-lg font-bold text-pink-500">{cake.price}€</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Customizations */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prilagodite</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Veličina
                    </label>
                    <select
                      value={customizations.size}
                      onChange={(e) => setCustomizations({...customizations, size: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="small">Mala (do 10 osoba)</option>
                      <option value="medium">Srednja (10-20 osoba)</option>
                      <option value="large">Velika (20+ osoba)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poruka na torti
                    </label>
                    <input
                      type="text"
                      value={customizations.message}
                      onChange={(e) => setCustomizations({...customizations, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Sretan rođendan..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Datum preuzimanja
                    </label>
                    <input
                      type="date"
                      value={customizations.date}
                      onChange={(e) => setCustomizations({...customizations, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vrijeme preuzimanja
                    </label>
                    <input
                      type="time"
                      value={customizations.time}
                      onChange={(e) => setCustomizations({...customizations, time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vaši Podaci</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ime i prezime
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <motion.button
                  type="submit"
                  className="bg-linear-to-r from-pink-500 to-purple-500 text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pošalji Narudžbu
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}