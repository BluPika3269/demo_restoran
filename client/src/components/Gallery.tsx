'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const categories = ['Predjela', 'Glavna Jela', 'Deserti', 'Vina'];

const menuItems = [
  // Predjela
  { id: 1, name: 'Goveđi Tartare', category: 'Predjela', price: '12€', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=2070&auto=format&fit=crop', desc: 'S tartufom i parmezanom' },
  { id: 6, name: 'Burrata Salata', category: 'Predjela', price: '11€', image: 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=2080&auto=format&fit=crop', desc: 'Sa cherry rajčicama i rukolom' },
  { id: 17, name: 'Dalmatinska Pršut Plata', category: 'Predjela', price: '15€', image: 'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?q=80&w=2070&auto=format&fit=crop', desc: 'S domaćim sirevima i maslinama' },
  { id: 18, name: 'Carpaccio od Tune', category: 'Predjela', price: '14€', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop', desc: 'S ruccolom, parmezanom i limunom' },
  { id: 19, name: 'Lignje na Žaru', category: 'Predjela', price: '13€', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=2070&auto=format&fit=crop', desc: 'S češnjakom i peršinom' },
  { id: 20, name: 'Bruschetta Caprese', category: 'Predjela', price: '9€', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=2070&auto=format&fit=crop', desc: 'Sa svježim rajčicama i mozzarellom' },
  
  // Glavna Jela
  { id: 2, name: 'Ribeye Steak', category: 'Glavna Jela', price: '38€', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2031&auto=format&fit=crop', desc: 'Dry-aged 250g, s grillanim povrćem' },
  { id: 3, name: 'Morski Plodovi Risotto', category: 'Glavna Jela', price: '19€', image: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?q=80&w=2070&auto=format&fit=crop', desc: 'Sa svježim kozicama i dagnjama' },
  { id: 5, name: 'Crna Pasta s Plodovima Mora', category: 'Glavna Jela', price: '18€', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=2070&auto=format&fit=crop', desc: 'Sa sipe tintom i svježim plodovima' },
  { id: 21, name: 'Janjetina Ispod Peke', category: 'Glavna Jela', price: '32€', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=2070&auto=format&fit=crop', desc: 'Tradicionalna dalmatinska janjetina' },
  { id: 22, name: 'Brancin na Žaru', category: 'Glavna Jela', price: '28€', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop', desc: 'Cijela riba s mediteranskim povrćem' },
  { id: 23, name: 'Teleća Peka', category: 'Glavna Jela', price: '30€', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop', desc: 'Sa krumpirom i začinskim biljem' },
  { id: 24, name: 'Crni Rižot', category: 'Glavna Jela', price: '22€', image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=2070&auto=format&fit=crop', desc: 'Od sipe s domaćim vinom' },
  { id: 25, name: 'Ramstek sa Šampinjonima', category: 'Glavna Jela', price: '35€', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2070&auto=format&fit=crop', desc: 'U umaku od tartufa' },
  
  // Deserti
  { id: 4, name: 'Tiramisu', category: 'Deserti', price: '7€', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=2070&auto=format&fit=crop', desc: 'Klasični talijanski desert' },
  { id: 7, name: 'Lava Cake', category: 'Deserti', price: '9€', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2070&auto=format&fit=crop', desc: 'Čokoladni kolač s toplim srcem' },
  { id: 8, name: 'Panna Cotta', category: 'Deserti', price: '7€', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2070&auto=format&fit=crop', desc: 'Sa šumskim voćem' },
  { id: 26, name: 'Rozata', category: 'Deserti', price: '6€', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2080&auto=format&fit=crop', desc: 'Dalmatinski krem karamel' },
  { id: 27, name: 'Cheesecake od Smokava', category: 'Deserti', price: '8€', image: 'https://images.unsplash.com/photo-1533134242116-8da99b0c0d0b?q=80&w=2070&auto=format&fit=crop', desc: 'Sa svježim smokama i medom' },
  { id: 28, name: 'Makovnjača', category: 'Deserti', price: '6€', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=2070&auto=format&fit=crop', desc: 'Tradicionalni kolač s makom' },
  
  // Vina
  { id: 9, name: 'Malvazija Istarska', category: 'Vina', price: '42€', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop', desc: 'Svježe hrvatsko bijelo vino s obale Istre' },
  { id: 10, name: 'Graševina', category: 'Vina', price: '38€', image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=2070&auto=format&fit=crop', desc: 'Tradicionalno bijelo vino iz kontinentalne Hrvatske' },
  { id: 11, name: 'Plavac Mali', category: 'Vina', price: '55€', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2070&auto=format&fit=crop', desc: 'Robusno crveno vino s dalmatinske obale' },
  { id: 12, name: 'Dingač', category: 'Vina', price: '85€', image: 'https://images.unsplash.com/photo-1566995684286-c0f2589da714?q=80&w=2070&auto=format&fit=crop', desc: 'Premium Plavac Mali s Pelješca' },
  { id: 13, name: 'Pošip', category: 'Vina', price: '48€', image: 'https://images.unsplash.com/photo-1598254436786-8f2e7b0453ba?q=80&w=2070&auto=format&fit=crop', desc: 'Autohtono bijelo vino s otoka Korčule' },
  { id: 14, name: 'Babić', category: 'Vina', price: '52€', image: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?q=80&w=2070&auto=format&fit=crop', desc: 'Tradicijsko crveno vino iz Primorja' },
  { id: 15, name: 'Teran', category: 'Vina', price: '45€', image: 'https://images.unsplash.com/photo-1596797882870-8b0d5e0ca77e?q=80&w=2070&auto=format&fit=crop', desc: 'Karakterno crveno vino iz Istre' },
  { id: 16, name: 'Žlahtina', category: 'Vina', price: '40€', image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?q=80&w=2070&auto=format&fit=crop', desc: 'Lako i osvježavajuće vino s otoka Krka' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Predjela');

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="relative py-32 bg-[#FAF8F3]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-6 inline-block text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            Naša Ponuda
          </span>
          <h2 className="mb-4 text-4xl font-bold text-black md:text-5xl lg:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Kulinarski Užitak
          </h2>
          <div className="divider-gold" />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap justify-center gap-4"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#D4AF37] text-black shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-[#D4AF37] hover:text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <motion.div 
          className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card-hover group overflow-hidden rounded-lg bg-white shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAUABQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2aiiigD//2Q=="
                  />
                ) : (
                  <div className="h-full w-full bg-[#1A1A1A] flex items-center justify-center">
                    <span className="text-[#D4AF37] text-4xl">🍷</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-[#D4AF37]">{item.price}</span>
                </div>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
