import React, { useState, useRef, useEffect } from 'react';
import { X, Image, Plus, Trash2, Edit3, Upload, FolderOpen, Eye, EyeOff, AlertTriangle, Check } from 'lucide-react';
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
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; album: Album | null }>({
    isOpen: false,
    album: null
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState<{ album: Album; selectedIndex: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setIsLoading(true);
      const response = await getAllAlbums();
      if (response.status === 200) {
        setAlbums(response.data.albums);
        setError(null);
      } else {
        setError('Failed to fetch albums');
      }
    } catch (error) {
      setError('Error fetching albums');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cover image upload for new album
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setNewAlbum(prev => ({ ...prev, coverImage: file }));
      setError(null);
    }
  };

  // Handle media items upload for new album
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length !== files.length) {
        setError('Please select only image files');
        return;
      }
      setNewAlbum(prev => ({
        ...prev,
        mediaItems: [...prev.mediaItems, ...imageFiles]
      }));
      setError(null);
      
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
          await fetchAlbums();
          if (selectedAlbum && selectedAlbum._id === albumId) {
            const updatedResponse = await getAllAlbums();
            if (updatedResponse.status === 200) {
              const updatedAlbum = updatedResponse.data.albums.find((a: Album) => a._id === albumId);
              if (updatedAlbum) {
                setSelectedAlbum(updatedAlbum);
              }
            }
          }
          setError(null);
        } else {
          setError('Failed to upload media');
        }
      } catch (error) {
        setError('Error uploading media files');
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle creating new album
  const handleAddAlbum = async () => {
    if (!newAlbum.title.trim()) {
      setError('Please enter an album title');
      return;
    }

    if (!newAlbum.coverImage) {
      setError('Please select a cover image');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('title', newAlbum.title);
      formData.append('isPublic', newAlbum.isPublic.toString());
      formData.append('coverImage', newAlbum.coverImage);
      
      newAlbum.mediaItems.forEach(file => {
        formData.append('media', file);
      });

      const response = await createAlbum(formData);
      
      if (response.status === 201) {
        await fetchAlbums();
        setShowAddModal(false);
        setNewAlbum({
          title: '',
          coverImage: null,
          mediaItems: [],
          isPublic: true,
        });
        setError(null);
      } else {
        setError('Failed to create album');
      }
    } catch (error) {
      setError('Error creating album');
    } finally {
      setUploading(false);
    }
  };

  // Handle saving edited album
  const handleSaveEdit = async () => {
    if (!editingAlbum) return;

    try {
      setUploading(true);
      
      const updateData = {
        title: editingAlbum.title,
        isPublic: editingAlbum.isPublic,
      };

      const response = await updateAlbum(editingAlbum._id, updateData);
      
      if (response.status === 200) {
        setAlbums(albums.map(a => a._id === editingAlbum._id ? response.data.album : a));
        setEditingAlbum(null);
        setError(null);
      } else {
        setError('Failed to update album');
      }
    } catch (error) {
      setError('Error updating album');
    } finally {
      setUploading(false);
    }
  };

  // Handle album deletion
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.album) return;

    try {
      setIsLoading(true);
      const response = await deleteAlbum(deleteConfirm.album._id);
      
      if (response.status === 200) {
        setAlbums(albums.filter(a => a._id !== deleteConfirm.album?._id));
        setDeleteConfirm({ isOpen: false, album: null });
        setSelectedAlbum(null);
        setError(null);
      } else {
        setError('Failed to delete album');
      }
    } catch (error) {
      setError('Error deleting album');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, album: null });
    setError(null);
  };

  // Handle media deletion
  const handleDeleteMedia = async (albumId: string, mediaUrl: string) => {
    try {
      const response = await deleteMediaFromAlbumByID(albumId, mediaUrl);
      
      if (response.status === 200) {
        setAlbums(albums.map(album =>
          album._id === albumId
            ? { ...album, mediaItems: album.mediaItems.filter(item => item !== mediaUrl) }
            : album
        ));

        if (selectedAlbum && selectedAlbum._id === albumId) {
          setSelectedAlbum(prev => prev ? {
            ...prev,
            mediaItems: prev.mediaItems.filter(item => item !== mediaUrl)
          } : null);
        }
        setError(null);
      } else {
        setError('Failed to delete media');
      }
    } catch (error) {
      setError('Error deleting media');
    }
  };

  // Remove media from new album
  const removeMediaFromNewAlbum = (index: number) => {
    setNewAlbum(prev => ({
      ...prev,
      mediaItems: prev.mediaItems.filter((_, i) => i !== index)
    }));
  };

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
    setError(null);
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

  const toggleVisibility = () => {
    if (editingAlbum) {
      setEditingAlbum({
        ...editingAlbum,
        isPublic: !editingAlbum.isPublic,
      });
    }
  };

  const handleDeleteClick = (album: Album) => {
    setDeleteConfirm({
      isOpen: true,
      album
    });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading && albums.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <span className="ml-2 text-white">Loading albums...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.album && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Delete Album</h3>
              <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
              
              <p className="text-gray-300 text-lg mb-2">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.album.title}</span>?
              </p>
              <p className="text-red-400 text-sm">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Gallery Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Create and manage your photo albums and media collections</p>
        </div>
        <button
          onClick={handleAddClick}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-400 disabled:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 mx-auto sm:mx-0"
        >
          <Plus size={20} />
          Create Album
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
            Processing...
          </div>
        </div>
      )}

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.length === 0 && !isLoading ? (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-purple-400/20">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Albums Yet</h3>
            <p className="text-gray-300 text-lg mb-6">Get started by creating your first album</p>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30 mx-auto"
            >
              <Plus size={20} />
              Create Your First Album
            </button>
          </div>
        ) : (
          albums.map((album) => (
            <div
              key={album._id}
              onClick={(e) => handleCardClick(album, e)}
              className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-gray-700 hover:border-purple-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
            >
              {/* Album Cover */}
              <div className="relative aspect-video rounded-t-2xl overflow-hidden">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    album.isPublic 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}>
                    {album.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>

              {/* Album Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{album.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Image size={16} />
                        <span>{album.mediaItems.length} media</span>
                      </div>
                      <span>{formatDate(album.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(album);
                    }}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-purple-500/20 disabled:bg-zinc-600 text-purple-400 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-purple-400/30"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(album);
                    }}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-red-400/30"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Album Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-purple-400/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Create New Album</h2>
              <button
                onClick={handleAddModalClose}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Album Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newAlbum.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300"
                    placeholder="Enter album title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Cover Image *</label>
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
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white hover:bg-zinc-700/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Upload size={18} />
                      {newAlbum.coverImage ? newAlbum.coverImage.name : 'Choose Cover Image'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Media Items</label>
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
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white hover:bg-zinc-700/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FolderOpen size={18} />
                      Add Media Files
                    </button>

                    {newAlbum.mediaItems.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {newAlbum.mediaItems.map((file, index) => (
                          <div key={index} className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-lg border border-gray-600">
                            <span className="text-white text-sm truncate flex-1">{file.name}</span>
                            <button
                              onClick={() => removeMediaFromNewAlbum(index)}
                              className="p-1 bg-red-500/20 text-red-400 rounded-lg transition-all duration-300 hover:scale-110 border border-red-400/30"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    type="button"
                    onClick={() => setNewAlbum(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                    disabled={uploading}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
                      newAlbum.isPublic
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-zinc-800 text-gray-400 border border-gray-600'
                    } hover:scale-105`}
                  >
                    {newAlbum.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                    {newAlbum.isPublic ? 'Public' : 'Private'}
                  </button>
                  <p className="text-sm text-gray-400">
                    {newAlbum.isPublic 
                      ? 'This album will be visible to all users' 
                      : 'This album will only be visible to admins'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={handleAddModalClose}
                disabled={uploading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleAddAlbum}
                disabled={!newAlbum.title.trim() || !newAlbum.coverImage || uploading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Check size={18} />
                {uploading ? 'Creating...' : 'Create Album'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Album Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-purple-400/20 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-start p-6 border-b border-gray-700">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedAlbum.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span>Created by: {selectedAlbum.createdBy}</span>
                  <span>•</span>
                  <span>{selectedAlbum.mediaItems.length} media items</span>
                  <span>•</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedAlbum.isPublic 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}>
                    {selectedAlbum.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
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
                  className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
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
                        className="aspect-square rounded-lg overflow-hidden border border-gray-600 cursor-pointer hover:border-purple-400 transition-all duration-300 hover:scale-105"
                      >
                        <img
                          src={mediaUrl}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteMedia(selectedAlbum._id, mediaUrl)}
                        className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-red-400/30"
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

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={() => handleEdit(selectedAlbum)}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Edit3 size={18} />
                Edit Album
              </button>
              <button
                onClick={closeModal}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Album Modal */}
      {editingAlbum && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-purple-400/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Edit Album</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Album Title</label>
                  <input
                    type="text"
                    value={editingAlbum.title}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    disabled={uploading}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
                      editingAlbum.isPublic
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-zinc-800 text-gray-400 border border-gray-600'
                    } hover:scale-105`}
                  >
                    {editingAlbum.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                    {editingAlbum.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
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
                      className="text-sm px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      Add More
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                    {editingAlbum.mediaItems.map((mediaUrl, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={mediaUrl}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-600"
                        />
                        <button
                          onClick={() => handleDeleteMedia(editingAlbum._id, mediaUrl)}
                          className="absolute top-1 right-1 p-1 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-red-400/30"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={handleCancelEdit}
                disabled={uploading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editingAlbum.title.trim() || uploading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Check size={18} />
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      {showMediaViewer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={closeMediaViewer}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-all duration-300 p-2 z-10 bg-black/50 rounded-lg"
            >
              <X size={32} />
            </button>

            <button
              onClick={() => navigateMedia('prev')}
              className="absolute left-4 text-white hover:text-gray-300 transition-all duration-300 p-2 z-10 bg-black/50 rounded-lg"
              disabled={showMediaViewer.album.mediaItems.length <= 1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={() => navigateMedia('next')}
              className="absolute right-4 text-white hover:text-gray-300 transition-all duration-300 p-2 z-10 bg-black/50 rounded-lg"
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

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {showMediaViewer.selectedIndex + 1} / {showMediaViewer.album.mediaItems.length}
            </div>
          </div>
        </div>
      )}

      {/* Uploading Overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 flex items-center gap-3 border border-purple-400/20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
            <span className="text-white">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;