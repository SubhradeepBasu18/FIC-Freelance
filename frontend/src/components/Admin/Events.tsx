import { useState, useEffect } from 'react';
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

// Main Events component
export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
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

  // Load events from API on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const result = await getAllEvents();
      if (result.status === 200) {
        setEvents(result.data.events || []);
      } else {
        console.error('Failed to load events:', result.error);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEditing(false);
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
    setShowForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditing(true);
    setFormData(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const result = await deleteEvent(eventId);
        if (result.status === 200) {
          await loadEvents(); // Refresh the events list
          handleCancelForm();
        } else {
          console.error('Failed to delete event:', result.error);
          alert('Failed to delete event. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('An error occurred while deleting the event.');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && editingEvent?._id) {
        // Update existing event
        const result = await updateEvent(editingEvent._id, formData as any);
        if (result.status === 200) {
          await loadEvents(); // Refresh the events list
          handleCancelForm();
        } else {
          console.error('Failed to update event:', result.error);
          alert('Failed to update event. Please try again.');
        }
      } else {
        // Add new event
        const result = await addEvent(formData as any);
        if (result.status === 201) {
          await loadEvents(); // Refresh the events list
          handleCancelForm();
        } else {
          console.error('Failed to add event:', result.error);
          alert('Failed to add event. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('An error occurred while saving the event.');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setIsEditing(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Events Management</h2>
          <p className="text-gray-400">Create and manage your events</p>
        </div>
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Event
        </button>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 rounded-xl border border-gray-800">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
          <p className="text-gray-400 mb-4">Get started by creating your first event</p>
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-zinc-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {event.title}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      {event.type}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => event._id && handleDeleteEvent(event._id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              {isEditing ? 'Edit Event' : 'Add New Event'}
            </h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="conference">Conference</option>
                    <option value="webinar">Webinar</option>
                    <option value="social">Social Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 2:00 PM - 4:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration URL *
                  </label>
                  <input
                    type="url"
                    name="registrationUrl"
                    value={formData.registrationUrl}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="https://example.com/register"
                  />
                </div>
              </div>

            <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2 text-gray-300 bg-zinc-800 border border-gray-700 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}