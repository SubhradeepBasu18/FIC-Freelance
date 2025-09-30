import { useState } from "react";
import CircularGallery from '@/components/CircularGallery'; 
import img1 from "@/assets/gallery/img1.jpg";
import img2 from "@/assets/gallery/img2.jpg";
import img3 from "@/assets/gallery/img3.jpg";
import img4 from "@/assets/gallery/img4.jpg";
import img5 from "@/assets/gallery/img5.jpg";
import img6 from "@/assets/gallery/img6.jpg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const galleryImages = [
    {
      image: img1,
      text: "Tech event showcase"
    },
    {
      image: img2,
      text: "Coding workshop"
    },
    {
      image: img3,
      text: "Innovation lab"
    },
    {
      image: img4,
      text: "Team collaboration"
    },
    {
      image: img5,
      text: "Project presentation"
    },
    {
      image: img6,
      text: "Networking session"
    }
  ];

  return (
    <main className="flex-1 relative z-10 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gallery
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Capturing the spirit of innovation, creativity, and collaboration from our events
          </p>
        </div>

        {/* Circular Gallery */}
        <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery 
            items={galleryImages}
            bend={3} 
            textColor="#ffffff" 
            borderRadius={0.05} 
            scrollEase={0.02}
          />
        </div>

        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                className="absolute -top-12 right-0 text-white text-2xl hover:text-cyan-400 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
              <img
                src={galleryImages.find(img => galleryImages.indexOf(img) === selectedImage)?.image}
                alt={galleryImages.find(img => galleryImages.indexOf(img) === selectedImage)?.text}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="text-white text-center mt-4">
                <p className="text-lg font-medium">
                  {galleryImages.find(img => galleryImages.indexOf(img) === selectedImage)?.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Gallery;