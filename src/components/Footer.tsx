import { Cake, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Cake className="w-8 h-8 text-pink-500" />
              <span className="text-xl font-bold">Slastičarna</span>
            </div>
            <p className="text-gray-400 mb-4">
              Stvaramo nezaboravne trenutke kroz naše majstorski izrađene torte i slatkiše.
              Više od 20 godina tradicije i kvalitete.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Brzi Linkovi</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">Početna</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">Galerija</a></li>
              <li><a href="#order" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">Naruči</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">O nama</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Ulica Slastica 123</li>
              <li>10000 Zagreb, Hrvatska</li>
              <li>+385 1 234 5678</li>
              <li>info@slasticarna.hr</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Slastičarna. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  );
}