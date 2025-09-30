import { useState, useEffect } from 'react';

// Gallery item form component for adding/editing
function GalleryForm({ galleryItem, onSave, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    tags: '',
    isFeatured: false
  });

  useEffect(() => {
    if (galleryItem && isEditing) {
      setFormData({
        ...galleryItem,
        tags: Array.isArray(galleryItem.tags) ? galleryItem.tags.join(', ') : galleryItem.tags
      });
    }
  }, [galleryItem, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const galleryData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSave(galleryData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isEditing ? 'Edit Gallery Item' : 'Add New Gallery Item'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="Enter image title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select category</option>
                <option value="events">Events</option>
                <option value="team">Team</option>
                <option value="workshops">Workshops</option>
                <option value="conferences">Conferences</option>
                <option value="awards">Awards</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Enter image description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preview
              </label>
              <div className="relative h-48 bg-zinc-800 rounded-lg border border-gray-700 overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  {formData.imageUrl && !formData.imageUrl.startsWith('http') && (
                    <span>Invalid image URL</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="event, team, workshop (comma separated)"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-zinc-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-300">
              Feature this image
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-300 bg-zinc-800 border border-gray-700 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Update Item' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Gallery component
export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Load gallery items from localStorage on component mount
  useEffect(() => {
    const savedGallery = localStorage.getItem('admin-gallery');
    if (savedGallery) {
      setGalleryItems(JSON.parse(savedGallery));
    } else {
      // Initialize with mock data
      const mockGallery = [
        {
          id: '1',
          title: 'Tech Conference 2024',
          description: 'Our team at the annual technology conference',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
          category: 'conferences',
          tags: ['conference', 'tech', 'team'],
          isFeatured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Workshop Session',
          description: 'Interactive workshop with participants',
          imageUrl: 'https://images.unsplash.com/photo-1515168833906-d2d3e6f5b8a6?w=500&h=300&fit=crop',
          category: 'workshops',
          tags: ['workshop', 'learning', 'interactive'],
          isFeatured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Team Building Event',
          description: 'Annual team building activities',
          imageUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=500&h=300&fit=crop',
          category: 'team',
          tags: ['team', 'fun', 'activities'],
          isFeatured: false,
          createdAt: new Date().toISOString()
        }
      ];
      setGalleryItems(mockGallery);
    }
  }, []);

  // Save gallery items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('admin-gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      setGalleryItems(galleryItems.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = (itemData) => {
    if (isEditing && editingItem) {
      // Update existing item
      setGalleryItems(galleryItems.map(item => 
        item.id === editingItem.id 
          ? { ...itemData, id: editingItem.id }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        ...itemData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setGalleryItems([...galleryItems, newItem]);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setIsEditing(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setIsEditing(false);
  };

  const filteredItems = galleryItems.filter(item => {
    if (filter === 'featured') return item.isFeatured;
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const categories = [...new Set(galleryItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gallery Management</h2>
          <p className="text-gray-400">Manage your image gallery and media</p>
        </div>
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Image
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            All Images
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'featured'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Featured
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            title="List View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Gallery Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 rounded-xl border border-gray-800">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No Images Found</h3>
          <p className="text-gray-400 mb-4">
            {galleryItems.length === 0 
              ? "Get started by adding your first image to the gallery" 
              : "No images match the current filter"}
          </p>
          {galleryItems.length === 0 && (
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Image
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors group"
            >
              <div className="relative h-48 bg-gray-800 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">
                      Featured
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded-full capitalize">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full capitalize">
                          {item.category}
                        </span>
                        {item.isFeatured && (
                          <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-400 text-sm mb-3">
                      {item.description}
                    </p>
                  )}
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Form Modal */}
      {showForm && (
        <GalleryForm
          galleryItem={editingItem}
          onSave={handleSaveItem}
          onCancel={handleCancelForm}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}