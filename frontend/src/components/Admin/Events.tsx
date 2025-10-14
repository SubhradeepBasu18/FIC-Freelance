import { useState, useEffect, type ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, X, Check, AlertTriangle, Calendar, Clock, MapPin, Link } from 'lucide-react';
import { getAllEvents } from '@/configApi/events';
import { addEvent, updateEvent, deleteEvent } from '@/configApi/events.admin';

interface Event {
  _id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  time: string;
  type: string;
  registrationUrl: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; event: Event | null }>({
    isOpen: false,
    event: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<Event>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    time: '',
    location: '',
    type: '',
    registrationUrl: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const result = await getAllEvents();
      if (result.status === 200) {
        setEvents(result.data.events || []);
        setError(null);
      } else {
        setError(result.error?.message || "Failed to load events");
      }
    } catch (error: any) {
      setError(error.message || "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.description || !formData.startDate || 
        !formData.endDate || !formData.time || !formData.location || 
        !formData.type || !formData.registrationUrl) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await addEvent(formData as any);
      if (result.status === 201) {
        await loadEvents();
        resetForm();
        setIsAddingEvent(false);
        setError(null);
      } else {
        setError(result.error?.message || "Failed to add event");
      }
    } catch (err: any) {
      setError(err.message || "Failed to add event");
    }
    setIsLoading(false);
  };

  const handleEdit = (event: Event) => {
    setEditingId(event._id || null);
    setFormData(event);
    setIsAddingEvent(false);
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.description || !formData.startDate || 
        !formData.endDate || !formData.time || !formData.location || 
        !formData.type || !formData.registrationUrl) {
      setError('All fields are required');
      return;
    }

    if (!editingId) return;

    setIsLoading(true);
    try {
      const result = await updateEvent(editingId, formData as any);
      if (result.status === 200) {
        await loadEvents();
        resetForm();
        setEditingId(null);
        setError(null);
      } else {
        setError(result.error?.message || "Failed to update event");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update event");
    }
    setIsLoading(false);
  };

  const handleDeleteClick = (event: Event) => {
    setDeleteConfirm({
      isOpen: true,
      event
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.event?._id) return;

    setIsLoading(true);
    try {
      const result = await deleteEvent(deleteConfirm.event._id);
      if (result.status === 200) {
        await loadEvents();
        setError(null);
      } else {
        setError(result.error?.message || "Failed to delete event");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete event");
    }
    
    setDeleteConfirm({ isOpen: false, event: null });
    setIsLoading(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, event: null });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      time: '',
      location: '',
      type: '',
      registrationUrl: '',
    });
  };

  const handleCancel = () => {
    setIsAddingEvent(false);
    setEditingId(null);
    resetForm();
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      workshop: 'from-purple-500 to-purple-600',
      seminar: 'from-blue-500 to-blue-600',
      conference: 'from-green-500 to-green-600',
      webinar: 'from-cyan-500 to-cyan-600',
      social: 'from-pink-500 to-pink-600',
      other: 'from-gray-500 to-gray-600'
    };
    return colors[type] || 'from-cyan-500 to-blue-600';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.event && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Delete Event</h3>
              <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
              
              <p className="text-gray-300 text-lg mb-2">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.event.title}</span>?
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Events Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Create and manage your events, workshops, and seminars</p>
        </div>
        <button
          onClick={() => setIsAddingEvent(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-400 disabled:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 mx-auto sm:mx-0"
        >
          <Plus size={20} />
          Add Event
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
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
            Processing...
          </div>
        </div>
      )}

      {/* Add/Edit Event Form */}
      {(isAddingEvent || editingId) && (
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 mb-8 border border-cyan-400/20 transform hover:scale-[1.01] transition-all duration-300">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Event Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Event Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              >
                <option value="">Select event type</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
                <option value="webinar">Webinar</option>
                <option value="social">Social Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-300">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={4}
                placeholder="Enter event description"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Time *</label>
              <input
                type="text"
                name="time"
                placeholder="e.g., 2:00 PM - 4:00 PM"
                value={formData.time}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Location *</label>
              <input
                type="text"
                name="location"
                placeholder="Event location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-300">Registration URL *</label>
              <input
                type="url"
                name="registrationUrl"
                placeholder="https://example.com/register"
                value={formData.registrationUrl}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Check size={18} />
              {isLoading ? 'Saving...' : (editingId ? 'Update Event' : 'Save Event')}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
            {editingId === event._id ? (
              // Edit Mode would be handled by the form above
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Editing event...</p>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getEventTypeColor(event.type)} text-white`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-cyan-500/20 disabled:bg-zinc-600 text-cyan-400 rounded-lg transition-all duration-300 hover:scale-110 border border-cyan-400/30"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(event)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg transition-all duration-300 hover:scale-110 border border-red-400/30"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{event.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm truncate">{event.location}</span>
                  </div>
                </div>

                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Link size={16} />
                    Register Now
                  </a>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {events.length === 0 && !isAddingEvent && (
        <div className="text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No Events Yet</h3>
          <p className="text-gray-300 text-lg mb-6">Get started by creating your first event</p>
          <button
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 mx-auto"
          >
            <Plus size={20} />
            Create Your First Event
          </button>
        </div>
      )}
    </div>
  );
}