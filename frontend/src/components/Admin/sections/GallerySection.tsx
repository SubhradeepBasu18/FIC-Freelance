import React, { useState, useRef, useEffect } from 'react';
import { X, Image, Plus, Trash2, Edit3, Upload, FolderOpen } from 'lucide-react';
import { 
  createAlbum, 
  uploadMediaToAlbum, 
  deleteAlbum, 
  deleteMediaFromAlbumByID,
  updateAlbum
} from '@/configApi/gallery.admin';
import { getAllAlbums } from '@/configApi/gallery';

interface Album {
  _id: string;
  title: string;
  coverImage: string;
  createdBy: string;
  mediaItems: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const GallerySection: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState<{ album: Album; selectedIndex: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const coverImageRef = useRef<HTMLInputElement>(null);
  const mediaUploadRef = useRef<HTMLInputElement>(null);

  const [newAlbum, setNewAlbum] = useState({
    title: '',
    coverImage: null as File | null,
    mediaItems: [] as File[],
    isPublic: true,
  });

  // Load albums on component mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await getAllAlbums();
      if (response.status === 200) {
        setAlbums(response.data.albums);
      } else {
        console.error('Failed to fetch albums:', response.data);
        alert('Failed to load albums');
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
      alert('Error loading albums');
    } finally {
      setLoading(false);
    }
  };

  // Handle cover image upload for new album
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setNewAlbum(prev => ({ ...prev, coverImage: file }));
    }
  };

  // Handle media items upload for new album
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length !== files.length) {
        alert('Please select only image files');
      }
      setNewAlbum(prev => ({
        ...prev,
        mediaItems: [...prev.mediaItems, ...imageFiles]
      }));
      
      // Reset file input
      if (mediaUploadRef.current) {
        mediaUploadRef.current.value = '';
      }
    }
  };

  // Handle media upload for existing album
  const handleAlbumMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, albumId: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        setUploading(true);
        
        const formData = new FormData();
        Array.from(files).forEach(file => {
          formData.append('media', file);
        });

        const response = await uploadMediaToAlbum(albumId, formData);
        
        if (response.status === 200) {
          // Refresh the album data
          await fetchAlbums();
          // Update selected album if it's the one being viewed
          if (selectedAlbum && selectedAlbum._id === albumId) {
            const updatedResponse = await getAllAlbums();
            if (updatedResponse.status === 200) {
              const updatedAlbum = updatedResponse.data.albums.find((a: Album) => a._id === albumId);
              if (updatedAlbum) {
                setSelectedAlbum(updatedAlbum);
              }
            }
          }
          alert('Media uploaded successfully');
        } else {
          alert(`Failed to upload media: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error uploading media:', error);
        alert('Error uploading media files');
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle creating new album
  const handleAddAlbum = async () => {
    if (!newAlbum.title.trim()) {
      alert('Please enter an album title');
      return;
    }

    if (!newAlbum.coverImage) {
      alert('Please select a cover image');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('title', newAlbum.title);
      formData.append('isPublic', newAlbum.isPublic.toString());
      formData.append('coverImage', newAlbum.coverImage);
      
      // Add media items
      newAlbum.mediaItems.forEach(file => {
        formData.append('media', file);
      });

      const response = await createAlbum(formData);
      
      if (response.status === 201) {
        await fetchAlbums(); // Refresh the albums list
        setShowAddModal(false);
        setNewAlbum({
          title: '',
          coverImage: null,
          mediaItems: [],
          isPublic: true,
        });
        alert('Album created successfully');
      } else {
        alert(`Failed to create album: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Error creating album');
    } finally {
      setUploading(false);
    }
  };

  // Handle saving edited album
  // Handle saving edited album
const handleSaveEdit = async () => {
  if (!editingAlbum) return;

  try {
    setUploading(true);
    
    // Prepare update data
    const updateData = {
      title: editingAlbum.title,
      isPublic: editingAlbum.isPublic,
    };

    const response = await updateAlbum(editingAlbum._id, updateData);
    
    if (response.status === 200) {
      // Update local state with the response data
      setAlbums(albums.map(a => a._id === editingAlbum._id ? response.data.album : a));
      setEditingAlbum(null);
      alert('Album updated successfully');
    } else {
      alert(`Failed to update album: ${response.data.message}`);
    }
    
  } catch (error) {
    console.error('Error updating album:', error);
    alert('Error updating album');
  } finally {
    setUploading(false);
  }
};

  // Handle album deletion
  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;

    try {
      const response = await deleteAlbum(showDeleteConfirm);
      
      if (response.status === 200) {
        setAlbums(albums.filter(a => a._id !== showDeleteConfirm));
        setShowDeleteConfirm(null);
        setSelectedAlbum(null);
        alert('Album deleted successfully');
      } else {
        alert(`Failed to delete album: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Error deleting album');
    }
  };

  // Handle media deletion
const handleDeleteMedia = async (albumId: string, mediaUrl: string) => {
  try {
    console.log("Deleting media:", mediaUrl, "from album:", albumId);
    
    const response = await deleteMediaFromAlbumByID(albumId, mediaUrl);
    
    console.log("Delete response:", response);
    
    if (response.status === 200) {
      // Update local state
      setAlbums(albums.map(album =>
        album._id === albumId
          ? { ...album, mediaItems: album.mediaItems.filter(item => item !== mediaUrl) }
          : album
      ));

      // Update selected album if it's the one being viewed
      if (selectedAlbum && selectedAlbum._id === albumId) {
        setSelectedAlbum(prev => prev ? {
          ...prev,
          mediaItems: prev.mediaItems.filter(item => item !== mediaUrl)
        } : null);
      }

      alert('Media deleted successfully');
    } else {
      alert(`Failed to delete media: ${response.data.message}`);
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    alert('Error deleting media');
  }
};

  // Remove media from new album
  const removeMediaFromNewAlbum = (index: number) => {
    setNewAlbum(prev => ({
      ...prev,
      mediaItems: prev.mediaItems.filter((_, i) => i !== index)
    }));
  };

  // File to Base64 conversion for preview (if needed)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Missing function implementations
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setNewAlbum({
      title: '',
      coverImage: null,
      mediaItems: [],
      isPublic: true,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAlbum(prev => ({ ...prev, [name]: value }));
  };

  const handleCardClick = (album: Album, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setSelectedAlbum(album);
  };

  const closeModal = () => {
    setSelectedAlbum(null);
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum({ ...album });
    setSelectedAlbum(null);
  };

  const handleCancelEdit = () => {
    setEditingAlbum(null);
  };

  const handleTogglePublic = () => {
    if (editingAlbum) {
      setEditingAlbum({
        ...editingAlbum,
        isPublic: !editingAlbum.isPublic,
      });
    }
  };

  const handleDelete = (albumId: string) => {
    setShowDeleteConfirm(albumId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const openMediaViewer = (album: Album, index: number) => {
    setShowMediaViewer({ album, selectedIndex: index });
  };

  const closeMediaViewer = () => {
    setShowMediaViewer(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!showMediaViewer) return;

    const { album, selectedIndex } = showMediaViewer;
    const newIndex = direction === 'next'
      ? (selectedIndex + 1) % album.mediaItems.length
      : (selectedIndex - 1 + album.mediaItems.length) % album.mediaItems.length;

    setShowMediaViewer({ album, selectedIndex: newIndex });
  };

  // Add loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading albums...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Gallery Management</h1>

        {/* Add Album Button */}
        <button
          onClick={handleAddClick}
          className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Album
        </button>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album._id}
              onClick={(e) => handleCardClick(album, e)}
              className="bg-zinc-900 rounded-xl border border-gray-800 p-4 hover:shadow-lg hover:border-gray-700 transition-all duration-200 ease-in-out cursor-pointer"
            >
              {/* Album Cover */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    album.isPublic
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {album.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>

              {/* Album Info */}
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{album.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Image size={16} />
                      <span>{album.mediaItems.length} media</span>
                    </div>
                    <span>{new Date(album.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(album)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    title="Edit Album"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(album._id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                    title="Delete Album"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Album Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleAddModalClose}
          >
            <div
              className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Create New Album</h2>
                <button
                  onClick={handleAddModalClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Album Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newAlbum.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter album title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                  <div className="flex flex-col gap-4">
                    <input
                      ref={coverImageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => coverImageRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white hover:bg-zinc-700 transition-colors flex items-center gap-2 justify-center"
                    >
                      <Upload size={20} />
                      {uploading ? 'Uploading...' : 'Choose Cover Image'}
                    </button>
                    {newAlbum.coverImage && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Cover File</label>
                        <div className="aspect-video rounded-lg overflow-hidden border border-gray-700 bg-zinc-800 flex items-center justify-center">
                          <span className="text-white p-4 text-center">
                            {newAlbum.coverImage.name}
                            <br />
                            <span className="text-sm text-gray-400">
                              (Preview not available until uploaded)
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Media Items</label>
                  <div className="flex flex-col gap-4">
                    <input
                      ref={mediaUploadRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => mediaUploadRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white hover:bg-zinc-700 transition-colors flex items-center gap-2 justify-center"
                    >
                      <FolderOpen size={20} />
                      {uploading ? 'Uploading...' : 'Add Media Files'}
                    </button>

                    {newAlbum.mediaItems.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Media Files ({newAlbum.mediaItems.length} files)
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {newAlbum.mediaItems.map((file, index) => (
                            <div key={index} className="flex justify-between items-center bg-zinc-800 p-3 rounded">
                              <span className="text-white text-sm truncate flex-1">{file.name}</span>
                              <button
                                onClick={() => removeMediaFromNewAlbum(index)}
                                className="p-1 bg-red-600 text-white rounded text-xs ml-2"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    onClick={() => setNewAlbum(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      newAlbum.isPublic ? 'bg-green-600' : 'bg-gray-600'
                    } hover:bg-opacity-80`}
                  >
                    {newAlbum.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                <button
                  onClick={handleAddModalClose}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAlbum}
                  disabled={!newAlbum.title.trim() || !newAlbum.coverImage || uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Album
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Album Modal */}
        {selectedAlbum && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start p-6 border-b border-gray-800">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedAlbum.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Created by: {selectedAlbum.createdBy}</span>
                    <span>•</span>
                    <span>{selectedAlbum.mediaItems.length} media items</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedAlbum.isPublic
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {selectedAlbum.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Upload Media Button */}
                <div className="mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleAlbumMediaUpload(e, selectedAlbum._id)}
                    className="hidden"
                    id="album-media-upload"
                  />
                  <label
                    htmlFor="album-media-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <Upload size={16} />
                    Add More Media
                  </label>
                </div>

                {selectedAlbum.mediaItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedAlbum.mediaItems.map((mediaUrl, index) => (
                      <div key={index} className="relative group">
                        <div
                          onClick={() => openMediaViewer(selectedAlbum, index)}
                          className="aspect-square rounded-lg overflow-hidden border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          <img
                            src={mediaUrl}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteMedia(selectedAlbum._id, mediaUrl)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete media"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Image size={48} className="mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-500 text-lg">No media items in this album</p>
                    <p className="text-gray-400 text-sm">Add some images to get started</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                <button
                  onClick={() => handleEdit(selectedAlbum)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Edit Album
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Album Modal */}
        {editingAlbum && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleCancelEdit}
          >
            <div
              className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Edit Album</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Album Title</label>
                  <input
                    type="text"
                    value={editingAlbum.title}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    onClick={handleTogglePublic}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      editingAlbum.isPublic ? 'bg-green-600' : 'bg-gray-600'
                    } hover:bg-opacity-80`}
                  >
                    {editingAlbum.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Media Items ({editingAlbum.mediaItems.length})
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleAlbumMediaUpload(e, editingAlbum._id)}
                      className="hidden"
                      id="edit-media-upload"
                    />
                    <label
                      htmlFor="edit-media-upload"
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      Add More
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {editingAlbum.mediaItems.map((mediaUrl, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={mediaUrl}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover rounded border border-gray-700"
                        />
                        <button
                          onClick={() => {
                            const updatedMedia = editingAlbum.mediaItems.filter((_, i) => i !== index);
                            setEditingAlbum({ ...editingAlbum, mediaItems: updatedMedia });
                          }}
                          className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full text-xs"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Viewer Modal */}
        {showMediaViewer && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeMediaViewer}
          >
            <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={closeMediaViewer}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 z-10"
              >
                <X size={32} />
              </button>

              <button
                onClick={() => navigateMedia('prev')}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors p-2 z-10 bg-black/50 rounded-full"
                disabled={showMediaViewer.album.mediaItems.length <= 1}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={() => navigateMedia('next')}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2 z-10 bg-black/50 rounded-full"
                disabled={showMediaViewer.album.mediaItems.length <= 1}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <img
                src={showMediaViewer.album.mediaItems[showMediaViewer.selectedIndex]}
                alt={`Media ${showMediaViewer.selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {showMediaViewer.selectedIndex + 1} / {showMediaViewer.album.mediaItems.length}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={cancelDelete}
          >
            <div
              className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this album? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Uploading Overlay */}
        {uploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-800 rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-white">Uploading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GallerySection;