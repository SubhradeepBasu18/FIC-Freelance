import { useState, useEffect } from "react";
import CircularGallery from '@/components/CircularGallery'; 
import { getGalleryImages } from '@/lib/galleryImages';

interface GalleryImage {
  image: string;
  text: string;
  fileName: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = getGalleryImages();
        setGalleryImages(images);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const nextImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage + 1) % galleryImages.length);
  };

  const prevImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  if (loading) {
    return (
      <main className="flex-1 relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gallery
            </h2>
            <p className="text-xl text-gray-300">Loading images...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Main content with conditional blur */}
      <div className={`min-h-screen transition-all duration-300 ${
        selectedImage !== null ? 'filter blur-sm pointer-events-none' : ''
      }`}>
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
            {galleryImages.length > 0 ? (
              <div className="text-center">
                <div style={{ height: '600px', position: 'relative' }}>
                  <CircularGallery 
                    items={galleryImages}
                    bend={3} 
                    textColor="#ffffff" 
                    borderRadius={0.05} 
                    scrollEase={0.02}
                  />
                </div>
                {/* Updated button */}
                <button 
                  onClick={() => setSelectedImage(0)}
                  className="mt-8 bg-zinc-950 text-white px-8 py-3 rounded-lg  border-2 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View All Images
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <p className="text-lg">No images found in the gallery.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Image Modal with Carousel - Fixed positioning */}
      {selectedImage !== null && galleryImages[selectedImage] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Background overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          />
          
          {/* Carousel Container */}
          <div className="relative z-[101] max-w-6xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 text-white text-2xl hover:text-cyan-400 transition-colors z-10 bg-black/70 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-white/20"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            {/* Navigation Arrows */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-cyan-400 transition-colors z-10 bg-black/70 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-white/20"
              onClick={prevImage}
            >
              ‹
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-cyan-400 transition-colors z-10 bg-black/70 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-white/20"
              onClick={nextImage}
            >
              ›
            </button>

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={galleryImages[selectedImage].image}
                alt={galleryImages[selectedImage].text}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  console.error('Error loading image:', galleryImages[selectedImage].image);
                  e.currentTarget.src = '/fallback-image.jpg';
                }}
              />
            </div>
            
            {/* Image Info */}
            <div className="text-white text-center mt-4">
              <p className="text-xl font-semibold mb-1">
                {galleryImages[selectedImage].text}
              </p>
              <p className="text-gray-300 text-sm">
                {selectedImage + 1} of {galleryImages.length}
              </p>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2 overflow-x-auto py-2 px-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === selectedImage 
                        ? 'border-cyan-400 ring-2 ring-cyan-400 transform scale-110' 
                        : 'border-gray-500 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image.image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard Navigation Hint */}
            <div className="text-center mt-2 text-gray-400 text-xs">
              <p>Use ← → arrow keys or click thumbnails to navigate • Esc to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;