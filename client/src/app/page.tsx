import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Gallery from '@/components/Gallery';
import ChefSpecial from '@/components/ChefSpecial';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <ChefSpecial />
      <Gallery />
      <Footer />
    </div>
  );
}
