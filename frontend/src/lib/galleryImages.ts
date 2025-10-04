// Function to dynamically import all gallery images
export const getGalleryImages = () => {
    const imageModules = import.meta.glob('@/assets/Gallery-Pictures/*.{jpg,JPG,heif,heic}', {
        eager: true,
        query: '?url'
    });

    const images = Object.entries(imageModules).map(([path, module]) => {
        const fileName = path.split('/').pop()?.split('.')[0] || '';
        const imageData = {
            image: (module as any).default,
            text: "", 
            fileName: `${fileName}`
        };
        return imageData;
    });

    return images;
};

// Function to create virtual albums from images
export const getVirtualAlbums = () => {
    const images = getGalleryImages();

    // Take only the first 10 images total
    const totalImages = images.slice(0, 10);

    // Event Highlights: First 4 images
    const eventHighlightsImages = totalImages.slice(0, 4);
    
    // Recent Additions: Next 5 images
    const recentAdditionsImages = totalImages.slice(4, 9);
    
    const albums = [
        {
            _id: 'all-images',
            title: 'All Gallery Images',
            coverImage: totalImages[0]?.image || '/default-album-cover.jpg',
            createdBy: 'System',
            mediaItems: totalImages.map(img => img.image),
            isPublic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            description: 'Complete collection of all 9 gallery images'
        },
        {
            _id: 'event-highlights',
            title: 'Event Highlights',
            coverImage: eventHighlightsImages[0]?.image || totalImages[0]?.image,
            createdBy: 'System',
            mediaItems: eventHighlightsImages.map(img => img.image),
            isPublic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            description: 'Featured moments from our events - 4 images'
        },
        {
            _id: 'recent-additions',
            title: 'Recent Additions',
            coverImage: recentAdditionsImages[0]?.image || totalImages[4]?.image,
            createdBy: 'System',
            mediaItems: recentAdditionsImages.map(img => img.image),
            isPublic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            description: 'Latest additions to our gallery - 5 images'
        }
    ];

    return albums;
};

// Function to get images for a specific virtual album
export const getAlbumImages = (albumId: string) => {
    const albums = getVirtualAlbums();
    const album = albums.find(album => album._id === albumId);
    const albumImages = album ? album.mediaItems.map((url, index) => ({
        image: url,
        text: "", 
        fileName: `image-${index + 1}`
    })) : [];
    
    return albumImages;
};