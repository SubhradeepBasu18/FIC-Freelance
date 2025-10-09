import React, { useState, useEffect } from 'react';
import { X, Music } from 'lucide-react';
import { FaEdit, FaTrashRestore } from "react-icons/fa";
import { getAllPodcasts, addPodcast, updatePodcast, deletePodcast } from '@/configApi/publications.admin';

interface Podcast {
  _id?: string; // Added _id for MongoDB compatibility
  title: string;
  hosts?: string;
  spotifyLink?: string;
  isPublic: boolean;
}

interface PodcastManagementProps {
  podcasts?: Podcast[]; // Made optional since we're fetching internally
}

const PodcastManagement: React.FC<PodcastManagementProps> = () => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPodcast, setNewPodcast] = useState<Omit<Podcast, 'id'>>({
      title: '',
      hosts: '',
      spotifyLink: '',
      isPublic: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch podcasts on component mount
    useEffect(() => {
      fetchPodcasts();
    }, []);

    const fetchPodcasts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllPodcasts();
        // console.log('Fetch podcasts response:', response);
        if (response.status === 200) {
          // Handle both response formats
          const podcastsData = response.data.podcasts || response.data;
          setPodcasts(Array.isArray(podcastsData) ? podcastsData : []);
        } else {
          setError(`Failed to fetch podcasts: ${response.data?.message || 'Unknown error'}`);
        }
      } catch (err: any) {
        setError(`Error fetching podcasts: ${err.message}`);
        console.error('Error fetching podcasts:', err);
      } finally {
        setLoading(false);
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

      setLoading(true);
      setError(null);
      try {
        const response = await updatePodcast(
          getPodcastId(editingPodcast),
          editingPodcast.title,
          editingPodcast.hosts || '',
          editingPodcast.spotifyLink || '',
          editingPodcast.isPublic
        );

        // console.log('Update podcast response:', response);

        if (response.status === 200) {
          setPodcasts(podcasts.map(p => 
            (p.id === editingPodcast.id || p._id === editingPodcast._id) ? editingPodcast : p
          ));
          setEditingPodcast(null);
          setShowAddModal(false);
          setError(null);
        } else {
          setError(`Failed to update podcast: ${response.data?.message || 'Unknown error'}`);
        }
      } catch (err: any) {
        setError(`Error updating podcast: ${err.message}`);
        console.error('Error updating podcast:', err);
      } finally {
        setLoading(false);
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
  
    const handleDeleteClick = (podcastId: string, e: React.MouseEvent) => {
      e.stopPropagation();
    //   console.log('Delete button clicked for podcast:', podcastId);
      setShowDeleteConfirm(podcastId);
    };
  
    const confirmDelete = async () => {
      if (showDeleteConfirm) {
        setLoading(true);
        setError(null);
        try {
        //   console.log('Deleting podcast with ID:', showDeleteConfirm);
          const response = await deletePodcast(showDeleteConfirm);
        //   console.log('Delete podcast response:', response);
          
          if (response.status === 200) {
            // Successfully deleted - remove from local state
            setPodcasts(podcasts.filter(p => p.id !== showDeleteConfirm && p._id !== showDeleteConfirm));
            setShowDeleteConfirm(null);
          } else {
            setError(`Failed to delete podcast: ${response.data?.message || 'Unknown error'}`);
          }
        } catch (err: any) {
          setError(`Error deleting podcast: ${err.message}`);
          console.error('Error deleting podcast:', err);
        } finally {
          setLoading(false);
        }
      }
    };
  
    const cancelDelete = () => {
      setShowDeleteConfirm(null);
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

      setLoading(true);
      setError(null);
      try {

        // const newPodcastData: Podcast = {
        //     title: newPodcast.title,
        //     hosts: newPodcast.hosts || '',
        //     spotifyLink: newPodcast.spotifyLink || '',
        //     isPublic: newPodcast.isPublic
        // }
        // console.log("new podcast data -> ", newPodcast);
        

        const response = await addPodcast(newPodcast);
        
        // console.log('Add podcast response:', response);
        
        if (response.status === 201 || response.status === 200) {
          await fetchPodcasts(); // Refresh the list
          handleAddModalClose();
        } else {
          setError(`Failed to add podcast: ${response.data?.message || 'Unknown error'}`);
        }
      } catch (err: any) {
        setError(`Error adding podcast: ${err.message}`);
        console.error('Error adding podcast:', err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const inputValue = type === 'checkbox' ? checked : value;

    //   console.log("input value -> ", inputValue);
      
      if (editingPodcast) {
        setEditingPodcast((prev) => prev ? ({ ...prev, [name]: inputValue }) : null);
      } else {
        setNewPodcast((prev) => ({ ...prev, [name]: inputValue }));
      }
    };

    const getPodcastId = (podcast: Podcast): string => {
      return podcast.id || podcast._id || '';
    };
  
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Podcast Management</h2>
              <p className="text-zinc-400">Manage your podcast episodes and shows</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchPodcasts}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Refresh
              </button>
              <button
                onClick={handleAddClick}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Music size={20} />
                Add Podcast
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {loading && !podcasts.length && (
            <div className="text-center py-16 bg-zinc-900 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg">Loading podcasts...</p>
            </div>
          )}
  
          <div className="space-y-4">
            {podcasts.map((podcast: Podcast) => (
              <div
                key={getPodcastId(podcast)}
                className="bg-zinc-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{podcast.title}</h3>
                      {podcast.isPublic && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Public</span>
                      )}
                    </div>
                    {podcast.hosts && (
                      <p className="text-sm text-gray-400 mb-1">Hosts: {podcast.hosts}</p>
                    )}
                    {/* {podcast.spotifyLink && (
                      <p className="text-sm text-blue-400 truncate">
                        Spotify: {podcast.spotifyLink}
                      </p>
                    )} */}
                  </div>
                  <div className="flex gap-4 items-center">
                    {podcast.spotifyLink && (
                      <a
                        href={podcast.spotifyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Music size={16} />
                        Spotify
                      </a>
                    )}
                    <button
                      onClick={(e) => handleEdit(podcast, e)}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(getPodcastId(podcast), e)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTrashRestore size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {podcasts.length === 0 && !loading && (
            <div className="text-center py-16 bg-zinc-900 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg">No podcasts yet. Click "Add Podcast" to get started.</p>
            </div>
          )}
  
          {/* Add/Edit Podcast Modal */}
          {showAddModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={handleAddModalClose}
            >
              <div
                className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                  <h2 className="text-2xl font-bold text-white">
                    {editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}
                  </h2>
                  <button
                    onClick={handleAddModalClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={editingPodcast ? editingPodcast.title : newPodcast.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        placeholder="Enter podcast title"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Hosts</label>
                      <input
                        type="text"
                        name="hosts"
                        value={editingPodcast ? editingPodcast.hosts || '' : newPodcast.hosts || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        placeholder="Enter host names"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Spotify Link</label>
                      <input
                        type="url"
                        name="spotifyLink"
                        value={editingPodcast ? editingPodcast.spotifyLink || '' : newPodcast.spotifyLink || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        placeholder="https://open.spotify.com/show/..."
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isPublic"
                        id="isPublic"
                        checked={editingPodcast ? editingPodcast.isPublic : newPodcast.isPublic}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-zinc-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="isPublic" className="text-white font-medium">
                        Make podcast public
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                  <button
                    onClick={handleAddModalClose}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingPodcast ? handleSaveEdit : handleAddPodcast}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editingPodcast ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <Music size={18} />
                        {editingPodcast ? 'Update Podcast' : 'Add Podcast'}
                      </>
                    )}
                  </button>
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
                  Are you sure you want to delete this podcast? This action cannot be undone.
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

// Demo component
const PodcastManagementDemo: React.FC = () => {
  return <PodcastManagement />;
};

export default PodcastManagementDemo;