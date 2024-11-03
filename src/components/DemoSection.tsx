import React from 'react';
const DemoSection = () => {
  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Watch how our technology transforms car colors in real-time using computer vision
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            <iframe 
              width="1560" 
              height="415" 
              src="https://www.youtube.com/embed/QRLdfg7wITk?si=L7HHPC5KDVWc0opA" 
              title="YouTube video player" 
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              className="absolute inset-0 w-full h-full"
            ></iframe>
            
              
            </div>
          </div>
        </div>
      </div>
  );
};

export default DemoSection;
