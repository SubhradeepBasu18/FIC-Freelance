import { useState, useEffect } from "react";
import CircularGallery from '@/components/ui/CircularGallery'; 
import { getAllAlbums, getAllImages } from "@/configApi/gallery";

interface GalleryImage {
  image: string;
  fileName: string;
}

interface Album {
  _id: string;
  title: string;
  coverImage: string;
  createdBy: string;
  mediaItems: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'albums' | 'all-images'>('albums');

  // Load albums and initial images
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Get virtual albums from local images
        // const virtualAlbums = getVirtualAlbums();
        const {status, data} = await getAllAlbums();
        if(status !== 200){
            throw new Error(data);
        }
        
        const publicAlbums = data.albums.filter(album => album.isPublic === true);
        setAlbums(publicAlbums);
        
        // Load all images for the "all images" view
        const allImages = await getAllImages();
        setGalleryImages(allImages.data.images);
        console.log("Gallery Images: ", galleryImages);
        
        
      } catch (error) {
        console.error('Error loading gallery data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle album selection
  const handleAlbumSelect = (album: Album) => {
    setAlbumLoading(true);
    setSelectedAlbum(album);
    
    // Use virtual album data directly
    const albumImages: GalleryImage[] = album.mediaItems.map((mediaUrl: string, index: number) => ({
      image: mediaUrl,
      text: ``,
      fileName: `image-${index + 1}`
    }));
    
    setGalleryImages(albumImages);
    setAlbumLoading(false);
  };

  // Show all images view
  const showAllImages = async() => {
    const allImages = await getAllImages();
    const images = allImages.data.images.map((image) => ({
        image: image.mediaItems,
        text: "",
      }));

    setGalleryImages(images);
    console.log("Gallery Images: ", galleryImages);
    
    setSelectedAlbum(null);
    setViewMode('all-images');
  };

  // Back to albums view
  const backToAlbums = () => {
    setSelectedAlbum(null);
    setViewMode('albums');
  };

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
            <p className="text-xl text-white">Loading gallery...</p>
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
              <p className="text-xl text-white max-w-2xl mx-auto">
                Capturing the spirit of innovation, creativity, and collaboration from our events
              </p>
              
              {/* View Mode Toggle */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={backToAlbums}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    viewMode === 'albums' 
                      ? 'bg-white text-black' 
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  Browse Albums
                </button>
                <button
                  onClick={showAllImages}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    viewMode === 'all-images' 
                      ? 'bg-white text-black' 
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  View All Images
                </button>
              </div>
            </div>

            {/* Albums Grid View */}
            {viewMode === 'albums' && !selectedAlbum && (
              <div className="mb-12">
                <h3 className="text-3xl font-bold text-white mb-8 text-center">Our Albums</h3>
                
                {albums.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => (
                      <div 
                        key={album._id}
                        className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
                        onClick={() => handleAlbumSelect(album)}
                      >
                        {/* Album Cover */}
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={album.coverImage} 
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/default-album-cover.jpg';
                            }}
                          />
                        </div>
                        
                        {/* Album Info */}
                        <div className="p-6">
                          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                            {album.title}
                          </h4>
                          <p className="text-white text-sm mb-3">
                            {album.mediaItems.length} images
                          </p>
                          {album.description && (
                            <p className="text-white text-xs mb-3">
                              {album.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white py-12">
                    <p className="text-lg">No albums found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Album Images View */}
            {viewMode === 'albums' && selectedAlbum && (
              <div className="mb-8">
                {/* Album Header */}
                <div className="text-center mb-8">
                  <button
                    onClick={backToAlbums}
                    className="mb-4 text-white hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>‹</span> Back to Albums
                  </button>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedAlbum.title}</h3>
                  <p className="text-white">
                    {selectedAlbum.mediaItems.length} images 
                  </p>
                </div>

                {/* Circular Gallery for Album Images */}
                {albumLoading ? (
                  <div className="text-center py-12">
                    <p className="text-white text-lg">Loading images...</p>
                  </div>
                ) : galleryImages.length > 0 ? (
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
                    {/* View All Images in Album Button */}
                    <button 
                      onClick={() => setSelectedImage(0)}
                      className="mt-8 bg-black text-white px-8 py-3 rounded-lg border-2 border-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      View All Images in this Album
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-white py-12">
                    <p className="text-lg">No images found in this album.</p>
                  </div>
                )}
              </div>
            )}

            {/* All Images View */}
            {viewMode === 'all-images' && (
              <div className="mb-8">
                {/* All Images Header */}
                <div className="text-center mb-8">
                  <button
                    onClick={backToAlbums}
                    className="mb-4 text-white hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>‹</span> Back to Albums
                  </button>
                  <h3 className="text-3xl font-bold text-white mb-2">All Gallery Images</h3>
                  <p className="text-white">
                    {galleryImages.length} images in total
                  </p>
                </div>

                {/* Circular Gallery for All Images */}
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
                    {/* View All Images Button */}
                    <button 
                      onClick={() => setSelectedImage(0)}
                      className="mt-8 bg-black text-white px-8 py-3 rounded-lg border-2 border-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      View All Images
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-white py-12">
                    <p className="text-lg">No images found.</p>
                  </div>
                )}
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
              className="absolute -top-12 right-0 text-white text-2xl hover:text-white transition-colors z-10 bg-black/70 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-white/20"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            {/* Navigation Arrows */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-white transition-colors z-10 bg-black/70 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-white/20"
              onClick={prevImage}
            >
              ‹
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-white transition-colors z-10 bg-black/70 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-white/20"
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
              <p className="text-white text-sm">
                {selectedAlbum?.title ? `${selectedAlbum.title} • ` : ''}
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
                        ? 'border-white ring-2 ring-white transform scale-110' 
                        : 'border-white/50 hover:border-white'
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
            <div className="text-center mt-2 text-white text-xs">
              <p>Use ← → arrow keys or click thumbnails to navigate • Esc to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;