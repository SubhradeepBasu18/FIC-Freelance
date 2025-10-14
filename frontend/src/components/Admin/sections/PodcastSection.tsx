import React, { useState, useEffect } from 'react';
import { X, Music, Plus, Edit2, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { getAllPodcasts, addPodcast, updatePodcast, deletePodcast } from '@/configApi/publications.admin';

interface Podcast {
  _id?: string;
  title: string;
  hosts?: string;
  spotifyLink?: string;
  isPublic: boolean;
}

interface PodcastManagementProps {
  podcasts?: Podcast[];
}

const PodcastManagement: React.FC<PodcastManagementProps> = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; podcast: Podcast | null }>({
    isOpen: false,
    podcast: null
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newPodcast, setNewPodcast] = useState<Omit<Podcast, 'id'>>({
    title: '',
    hosts: '',
    spotifyLink: '',
    isPublic: false,
  });

  // Fetch podcasts on component mount
  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllPodcasts();
      if (response.status === 200) {
        const podcastsData = response.data.podcasts || response.data;
        setPodcasts(Array.isArray(podcastsData) ? podcastsData : []);
      } else {
        setError('Failed to fetch podcasts');
      }
    } catch (err: any) {
      setError('Error fetching podcasts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (podcast: Podcast, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPodcast({ ...podcast });
    setShowAddModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPodcast) return;

    if (!editingPodcast.title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await updatePodcast(
        getPodcastId(editingPodcast),
        editingPodcast.title,
        editingPodcast.hosts || '',
        editingPodcast.spotifyLink || '',
        editingPodcast.isPublic
      );

      if (response.status === 200) {
        setPodcasts(podcasts.map(p => 
          (p._id === editingPodcast._id) ? editingPodcast : p
        ));
        setEditingPodcast(null);
        setShowAddModal(false);
      } else {
        setError('Failed to update podcast');
      }
    } catch (err: any) {
      setError('Error updating podcast');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPodcast(null);
    setShowAddModal(false);
    setNewPodcast({
      title: '',
      hosts: '',
      spotifyLink: '',
      isPublic: false,
    });
    setError(null);
  };

  const handleDeleteClick = (podcast: Podcast, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({
      isOpen: true,
      podcast
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.podcast) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await deletePodcast(getPodcastId(deleteConfirm.podcast));
      
      if (response.status === 200) {
        setPodcasts(podcasts.filter(p => p._id !== deleteConfirm.podcast!._id));
        setDeleteConfirm({ isOpen: false, podcast: null });
      } else {
        setError('Failed to delete podcast');
      }
    } catch (err: any) {
      setError('Error deleting podcast');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, podcast: null });
    setError(null);
  };

  const handleAddClick = () => {
    setEditingPodcast(null);
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setEditingPodcast(null);
    setNewPodcast({
      title: '',
      hosts: '',
      spotifyLink: '',
      isPublic: false
    });
    setError(null);
  };

  const handleAddPodcast = async () => {
    if (!newPodcast.title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await addPodcast(newPodcast);
      
      if (response.status === 201 || response.status === 200) {
        await fetchPodcasts();
        handleAddModalClose();
      } else {
        setError('Failed to add podcast');
      }
    } catch (err: any) {
      setError('Error adding podcast');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (editingPodcast) {
      setEditingPodcast((prev) => prev ? ({ ...prev, [name]: inputValue }) : null);
    } else {
      setNewPodcast((prev) => ({ ...prev, [name]: inputValue }));
    }
  };

  const getPodcastId = (podcast: Podcast): string => {
    return podcast._id || '';
  };

  const toggleVisibility = () => {
    if (editingPodcast) {
      setEditingPodcast({
        ...editingPodcast,
        isPublic: !editingPodcast.isPublic,
      });
    } else {
      setNewPodcast(prev => ({
        ...prev,
        isPublic: !prev.isPublic
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.podcast && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Delete Podcast</h3>
              <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
              
              <p className="text-gray-300 text-lg mb-2">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.podcast.title}</span>?
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Podcast Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Manage your podcast episodes and shows</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mx-auto sm:mx-0">
          <button
            onClick={fetchPodcasts}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
          >
            Refresh
          </button>
          <button
            onClick={handleAddClick}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-400 disabled:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            <Plus size={20} />
            Add Podcast
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
            Processing...
          </div>
        </div>
      )}

      {/* Podcasts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {podcasts.length === 0 && !isLoading ? (
          <div className="col-span-2 text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Podcasts Yet</h3>
            <p className="text-gray-300 text-lg mb-6">Get started by creating your first podcast</p>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 mx-auto"
            >
              <Plus size={20} />
              Create Your First Podcast
            </button>
          </div>
        ) : (
          podcasts.map((podcast: Podcast) => (
            <div
              key={getPodcastId(podcast)}
              className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{podcast.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      podcast.isPublic 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                    }`}>
                      {podcast.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  {podcast.hosts && (
                    <p className="text-gray-300 text-lg mb-3">Hosts: {podcast.hosts}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {podcast.spotifyLink && (
                    <a
                      href={podcast.spotifyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <Music size={16} />
                      <span className="hidden sm:inline">Spotify</span>
                    </a>
                  )}
                  <button
                    onClick={(e) => handleEdit(podcast, e)}
                    disabled={isLoading}
                    className="p-2 bg-zinc-800 hover:bg-cyan-500/20 disabled:bg-zinc-600 text-cyan-400 rounded-lg transition-all duration-300 hover:scale-110 border border-cyan-400/30"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(podcast, e)}
                    disabled={isLoading}
                    className="p-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg transition-all duration-300 hover:scale-110 border border-red-400/30"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {podcast.spotifyLink && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm truncate">
                    Spotify: {podcast.spotifyLink}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Podcast Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                {editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}
              </h2>
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
                  <label className="block text-sm font-medium text-gray-300">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={editingPodcast ? editingPodcast.title : newPodcast.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    placeholder="Enter podcast title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Hosts</label>
                  <input
                    type="text"
                    name="hosts"
                    value={editingPodcast ? editingPodcast.hosts || '' : newPodcast.hosts || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    placeholder="Enter host names"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Spotify Link</label>
                  <input
                    type="url"
                    name="spotifyLink"
                    value={editingPodcast ? editingPodcast.spotifyLink || '' : newPodcast.spotifyLink || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    placeholder="https://open.spotify.com/show/..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
                      (editingPodcast ? editingPodcast.isPublic : newPodcast.isPublic)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-zinc-800 text-gray-400 border border-gray-600'
                    } hover:scale-105`}
                  >
                    {(editingPodcast ? editingPodcast.isPublic : newPodcast.isPublic) ? <Eye size={18} /> : <EyeOff size={18} />}
                    {(editingPodcast ? editingPodcast.isPublic : newPodcast.isPublic) ? 'Public' : 'Private'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={handleAddModalClose}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={editingPodcast ? handleSaveEdit : handleAddPodcast}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Music size={18} />
                {isLoading ? 'Saving...' : (editingPodcast ? 'Update Podcast' : 'Add Podcast')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastManagement;