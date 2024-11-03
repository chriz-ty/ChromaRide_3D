import React from 'react';
import { Camera, Car, Palette } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CarCard from './components/CarCard';
import DemoSection from './components/DemoSection';

const cars = [
  {
    id: 1,
    name: "Audi RS5",
    description: "Experience the thrill of our flagship sports car with dynamic color adaptation.",
    image: "https://www.netcarshow.com/Audi-RS5_Coupe-2020-Front_Three-Quarter.629ba204.jpg",
    link: "https://anoopkumara.github.io/audi-rs5"
  },
  {
    id: 2,
    name: "Audi TT RS",
    description: "Perfect blend of style and functionality with real-time color transformation.",
    image: "https://www.topgear.com/sites/default/files/2022/10/A225012_large.jpg",
    link: "https://chriz-ty.github.io/Audi-TT-RS/"
  },
  {
    id: 3,
    name: "BMW 1600 GTL",
    description: "Timeless design meets modern technology with our adaptive color system.",
    image: "https://www.bmwmotorcycle.com/wp-content/uploads/2018/07/2014_bmw_k_1600_gtl_information_3.jpg",
    link: "https://chriz-ty.github.io/BMW-1600-GTL-1/"
  },
  {
    id: 4,
    name: "BMW i8",
    description: "Zero emissions meets infinite color possibilities with our latest EV model.",
    image: "https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1562246284/autoexpress/2018/05/1bmwi8.jpg",
    link: "https://anoopkumara.github.io/bmw18/"
  },
  {
    id: 5,
    name: "BMW 507",
    description: "Premium comfort combined with cutting-edge color-changing technology.",
    image: "https://bimmerlife.com/wp-content/uploads/2020/11/1957_bmw_507_roadster_1605802832a9efb9a08635feDSCF9253-scaled-1-1024x683.jpg",
    link: "https://anoopkumara.github.io/bmw507/"
  },
  {
    id: 6,
    name: "Lamborghini Aventador",
    description: "Off-road capability meets urban sophistication with dynamic styling.",
    image: "https://autodesignmagazine.com/wp-content/uploads/2021/07/2021070703_Lamborghini_AventadorUltimae.jpeg",
    link: "https://chriz-ty.github.io/Lamborgini-Aventador/"
  },
  {
    id: 7,
    name: "Lamborghini Countach",
    description: "Smart city car with adaptive colors for the modern urban explorer.",
    image: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/countach/hb/countach_hp%20%281%29.jpg",
    link: "https://anoopkumara.github.io/lambo-/"
  },
  {
    id: 8,
    name: "Porsche 918 Spyder",
    description: "Track-ready performance with revolutionary color-shifting capabilities.",
    image: "https://newsroom.porsche.com/.imaging/mte/porsche-templating-theme/image_1290x726/dam/pnr/porsche_newsroom/Produkte/918-Spyder/918-Spyder5/jcr:content/918%20Spyder%20mittig.jpg",
    link: "https://anoopkumara.github.io/porche/"
  },
  {
    id: 9,
    name: "Rolls-Royce Ghost",
    description: "Long-distance luxury with adaptive aesthetics for the distinguished driver.",
    image: "https://www.rolls-roycemotorcars.com/content/dam/rrmc/marketUK/rollsroycemotorcars_com/ghost-sII/discover/page-properties/TILE-GSII-DISCOVER-TWIN-16_9.jpg",
    link: "https://anoopkumara.github.io/RR/"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <section id="home">
        <Hero />
      </section>
      
      <section id="models" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Our Collection</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our range of interactive 3D car models featuring real-time color adaptation technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      </section>

      <section id="demo">
        <DemoSection />
      </section>

      <section id="about" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Powered by cutting-edge technology to deliver an immersive car customization experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-800 rounded-xl transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Camera Integration</h3>
            <p className="text-gray-400">Real-time color capture using advanced computer vision</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dynamic Colors</h3>
            <p className="text-gray-400">Instant color adaptation based on environmental input</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3D Models</h3>
            <p className="text-gray-400">High-fidelity 3D car models with realistic rendering</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
