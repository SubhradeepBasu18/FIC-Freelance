import React, { useState } from 'react';
import { X, Music, ExternalLink } from 'lucide-react';

interface Podcast {
  id: string;
  title: string;
  authors?: string;
  spotifyLink?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PodcastManagementProps {
  podcasts: Podcast[];
}

const PodcastManagement: React.FC<PodcastManagementProps> = ({ podcasts: initialPodcasts }) => {
    const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts);
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
    const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPodcast, setNewPodcast] = useState<Podcast>({
      id: '',
      title: '',
      authors: '',
      spotifyLink: '',
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  
    const handleCardClick = (podcast: Podcast, e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) {
        return;
      }
      setSelectedPodcast(podcast);
    };
  
    const closeModal = () => {
      setSelectedPodcast(null);
    };
  
    const handleEdit = (podcast: Podcast) => {
      setEditingPodcast({ ...podcast });  // Set the podcast data to be edited
      setShowAddModal(true);  // Open the modal for editing
      setSelectedPodcast(null);  // Close the selected podcast details
    };
  
    const handleSaveEdit = () => {
      if (editingPodcast) {
        setPodcasts(podcasts.map(p => p.id === editingPodcast.id ? editingPodcast : p));
        setEditingPodcast(null);
        setShowAddModal(false); // Close the modal after saving
      }
    };
  
    const handleCancelEdit = () => {
      setEditingPodcast(null);
      setShowAddModal(false); // Close the modal
    };
  
    const handleDelete = (podcastId: string) => {
      setShowDeleteConfirm(podcastId);
    };
  
    const confirmDelete = () => {
      if (showDeleteConfirm) {
        setPodcasts(podcasts.filter(p => p.id !== showDeleteConfirm));
        setShowDeleteConfirm(null);
        setSelectedPodcast(null);
      }
    };
  
    const cancelDelete = () => {
      setShowDeleteConfirm(null);
    };
  
    const handleAddClick = () => {
      setShowAddModal(true);
    };
  
    const handleAddModalClose = () => {
      setShowAddModal(false);
      setNewPodcast({
        id: '',
        title: '',
        authors: '',
        spotifyLink: '',
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    };
  
    const handleAddPodcast = () => {
      setPodcasts([
        ...podcasts,
        { ...newPodcast, id: Date.now().toString(), createdAt: new Date().toISOString() },
      ]);
      setShowAddModal(false);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (editingPodcast) {
        setEditingPodcast((prev) => ({ ...prev, [name]: value }));
      } else {
        setNewPodcast((prev) => ({ ...prev, [name]: value }));
      }
    };
  
    const extractSpotifyEmbedUrl = (url?: string) => {
      if (!url) return null;
      const episodeMatch = url.match(/episode\/([a-zA-Z0-9]+)/);
      const showMatch = url.match(/show\/([a-zA-Z0-9]+)/);
      if (episodeMatch) {
        return `https://open.spotify.com/embed/episode/${episodeMatch[1]}`;
      } else if (showMatch) {
        return `https://open.spotify.com/embed/show/${showMatch[1]}`;
      }
      return null;
    };
  
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Music className="text-green-500" size={32} />
            <h1 className="text-3xl font-bold text-white">Podcast Management</h1>
          </div>
  
          {/* Add Podcast Button */}
          <button
            onClick={handleAddClick}
            className="mb-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Podcast
          </button>
  
          <div className="space-y-4">
            {podcasts.map((podcast: Podcast) => (
              <div
                key={podcast.id}
                onClick={(e) => handleCardClick(podcast, e)}
                className="bg-zinc-900 rounded-xl border border-gray-800 p-6 hover:shadow-lg hover:border-gray-700 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{podcast.title}</h3>
                      {podcast.isPublic && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Public</span>
                      )}
                    </div>
                    {podcast.authors && (
                      <p className="text-sm text-gray-400 mb-1">{podcast.authors}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(podcast.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(podcast)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(podcast.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Add Podcast / Edit Podcast Modal */}
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
                  <h2 className="text-2xl font-bold text-white">{editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}</h2>
                  <button
                    onClick={handleAddModalClose}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
  
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={editingPodcast?.title || newPodcast.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Host(s)</label>
                    <input
                      type="text"
                      name="authors"
                      value={editingPodcast?.authors || newPodcast.authors || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., John Doe, Jane Smith"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Spotify Link</label>
                    <input
                      type="url"
                      name="spotifyLink"
                      value={editingPodcast?.spotifyLink || newPodcast.spotifyLink || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://open.spotify.com/episode/..."
                    />
                  </div>
  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={editingPodcast?.isPublic || newPodcast.isPublic}
                      onChange={(e) => (editingPodcast ? setEditingPodcast({ ...editingPodcast, isPublic: e.target.checked }) : setNewPodcast({ ...newPodcast, isPublic: e.target.checked }))}
                      className="w-5 h-5 bg-zinc-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-300">
                      Make this podcast public
                    </label>
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
                    onClick={editingPodcast ? handleSaveEdit : handleAddPodcast}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  >
                    {editingPodcast ? 'Save Changes' : 'Add Podcast'}
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
        </div>
      </div>
    );
  };
  

// Demo with sample data
const samplePodcasts: Podcast[] = [
  {
    id: '1',
    title: 'The AI Revolution',
    authors: 'Sarah Chen, Mike Roberts',
    spotifyLink: 'https://open.spotify.com/episode/3Z1BFTU8oXgXYWwvQrWyW3',
    isPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Tech Talks Daily',
    authors: 'John Anderson',
    spotifyLink: 'https://open.spotify.com/show/0ofXAdFIQQRsCYj9754UFx',
    isPublic: true,
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Future of Work',
    authors: 'Emily Johnson, David Lee',
    spotifyLink: 'https://open.spotify.com/episode/5AvLSYRZdoHILgxU9jgAYq',
    isPublic: false,
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z'
  }
];

const PodcastManagementDemo: React.FC = () => {
  return <PodcastManagement podcasts={samplePodcasts} />;
};

export default PodcastManagementDemo;
