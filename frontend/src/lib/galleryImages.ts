// Function to dynamically import all gallery images
export const getGalleryImages = () => {
    const imageModules = import.meta.glob('@/assets/Gallery-Pictures/*.{jpg,jpeg,heif,heic}', {
        eager: true,
        query: '?url'
    });

    const images = Object.entries(imageModules).map(([path, module]) => {
        const fileName = path.split('/').pop()?.split('.')[0] || '';
        return {
        image: (module as any).default,
        text: "",
        fileName: fileName
        };
    });

    return images;
};

