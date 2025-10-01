import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Check, ChevronLeft, ChevronRight, Radio } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  time: string;
  isLive: boolean;
  visitLink: string;
}

const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Tech Conference 2025',
      description: 'Annual technology conference featuring latest innovations',
      location: 'San Francisco Convention Center',
      time: '10:00 AM - 6:00 PM',
      isLive: true,
      visitLink: 'https://example.com/event1'
    },
    {
      id: 2,
      title: 'AI Summit',
      description: 'Exploring the future of artificial intelligence',
      location: 'Virtual Event',
      time: '2:00 PM - 5:00 PM',
      isLive: true,
      visitLink: 'https://example.com/event2'
    },
    {
      id: 3,
      title: 'Web Dev Workshop',
      description: 'Hands-on workshop for modern web development',
      location: 'Tech Hub NYC',
      time: 'Oct 15, 2025 - 9:00 AM',
      isLive: false,
      visitLink: 'https://example.com/event3'
    },
    {
      id: 4,
      title: 'Design Thinking Seminar',
      description: 'Learn design thinking principles and methodologies',
      location: 'Innovation Center',
      time: 'Oct 22, 2025 - 3:00 PM',
      isLive: false,
      visitLink: 'https://example.com/event4'
    },
    {
      id: 5,
      title: 'Data Science Conference',
      description: 'Annual conference on data science and analytics',
      location: 'Convention Center',
      time: 'Nov 5, 2025 - 10:00 AM',
      isLive: true,
      visitLink: 'https://example.com/event5'
    },
    {
      id: 6,
      title: 'Cloud Conference',
      description: 'Annual conference on cloud computing',
      location: 'Convention Center',
      time: 'Nov 5, 2025 - 10:00 AM',
      isLive: true,
      visitLink: 'https://example.com/event6'
    }
  ]);

  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventFormData, setEventFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    location: '',
    time: '',
    isLive: false,
    visitLink: ''
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEventFormData({ 
      ...eventFormData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleAddEvent = (): void => {
    if (eventFormData.title && eventFormData.location && eventFormData.time) {
      const newEvent: Event = {
        id: Date.now(),
        ...eventFormData
      };
      setEvents([...events, newEvent]);
      setEventFormData({ title: '', description: '', location: '', time: '', isLive: false, visitLink: '' });
      setIsAddingEvent(false);
    }
  };

  const handleEditEvent = (event: Event): void => {
    setEditingEventId(event.id);
    setEventFormData(event);
  };

  const handleUpdateEvent = (): void => {
    setEvents(events.map(event => 
      event.id === editingEventId ? { ...event, ...eventFormData } : event
    ));
    setEditingEventId(null);
    setEventFormData({ title: '', description: '', location: '', time: '', isLive: false, visitLink: '' });
  };

  const handleDeleteEvent = (id: number): void => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const handleCancelEvent = (): void => {
    setIsAddingEvent(false);
    setEditingEventId(null);
    setEventFormData({ title: '', description: '', location: '', time: '', isLive: false, visitLink: '' });
  };

  const liveEvents = events.filter(e => e.isLive);
  const upcomingEvents = events.filter(e => !e.isLive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header - Inspired by Team.tsx */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Event Management</h2>
          <p className="text-zinc-400 text-sm sm:text-base">Manage live and upcoming events</p>
        </div>
        <button
          onClick={() => setIsAddingEvent(true)}
          className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {isAddingEvent && (
        <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 mb-6 border border-zinc-800">
          <h3 className="text-xl font-semibold mb-4 text-white">Add New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={eventFormData.title}
              onChange={handleEventInputChange}
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={eventFormData.location}
              onChange={handleEventInputChange}
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              name="time"
              placeholder="Date & Time"
              value={eventFormData.time}
              onChange={handleEventInputChange}
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              name="visitLink"
              placeholder="Visit Link URL"
              value={eventFormData.visitLink}
              onChange={handleEventInputChange}
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={eventFormData.description}
              onChange={handleEventInputChange}
              rows={3}
              className="md:col-span-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <label className="flex items-center gap-3 text-white cursor-pointer md:col-span-2">
              <input
                type="checkbox"
                name="isLive"
                checked={eventFormData.isLive}
                onChange={handleEventInputChange}
                className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span>Mark as Live Event</span>
            </label>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleAddEvent}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex-1 sm:flex-none justify-center"
            >
              <Check size={18} />
              Save Event
            </button>
            <button
              onClick={handleCancelEvent}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-all flex-1 sm:flex-none justify-center"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Live Events Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Live Events</h3>
          {liveEvents.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {liveEvents.map(event => (
            <div 
              key={event.id} 
              className="bg-zinc-900 rounded-xl p-4 sm:p-6 border-2 border-zinc-800 hover:border-zinc-700 transition-all relative flex-shrink-0 w-80 sm:w-96 min-h-[280px] sm:min-h-[320px] flex flex-col"
            >
              {editingEventId === event.id ? (
                <div className="space-y-3 flex-1">
                  <input
                    type="text"
                    name="title"
                    value={eventFormData.title}
                    onChange={handleEventInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    name="description"
                    value={eventFormData.description}
                    onChange={handleEventInputChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="location"
                    value={eventFormData.location}
                    onChange={handleEventInputChange}
                    placeholder="Location"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="time"
                    value={eventFormData.time}
                    onChange={handleEventInputChange}
                    placeholder="Time"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="visitLink"
                    value={eventFormData.visitLink}
                    onChange={handleEventInputChange}
                    placeholder="Visit Link"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <label className="flex items-center gap-2 text-white text-sm">
                    <input
                      type="checkbox"
                      name="isLive"
                      checked={eventFormData.isLive}
                      onChange={handleEventInputChange}
                      className="w-4 h-4"
                    />
                    Live Event
                  </label>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleUpdateEvent}
                      className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <Check size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEvent}
                      className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2">
                    <div className="flex items-center gap-1 sm:gap-2 bg-red-500/20 px-2 sm:px-3 py-1 rounded-full border border-red-500/30">
                      <Radio size={14} className="text-red-400 animate-pulse" />
                      <span className="text-red-400 text-xs sm:text-sm font-medium">LIVE</span>
                    </div>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-red-400 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 pr-16 sm:pr-20">{event.title}</h4>
                    <p className="text-zinc-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{event.description}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="mb-3 sm:mb-4">
                      <p className="text-white font-semibold text-base sm:text-lg mb-1">{event.location}</p>
                      <p className="text-zinc-400 text-sm">{event.time}</p>
                    </div>
                    {event.visitLink && (
                      <a
                        href={event.visitLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all border-2 border-blue-500 text-sm sm:text-base"
                      >
                        Join Now
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {liveEvents.length === 0 && (
          <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-zinc-400">No live events at the moment</p>
          </div>
        )}
      </div>

      {/* Upcoming Events Section */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-800 hover:border-zinc-700 transition-all">
              {editingEventId === event.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="title"
                      value={eventFormData.title}
                      onChange={handleEventInputChange}
                      className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="location"
                      value={eventFormData.location}
                      onChange={handleEventInputChange}
                      placeholder="Location"
                      className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <textarea
                    name="description"
                    value={eventFormData.description}
                    onChange={handleEventInputChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="time"
                      value={eventFormData.time}
                      onChange={handleEventInputChange}
                      placeholder="Time"
                      className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="visitLink"
                      value={eventFormData.visitLink}
                      onChange={handleEventInputChange}
                      placeholder="Visit Link"
                      className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-white text-sm">
                    <input
                      type="checkbox"
                      name="isLive"
                      checked={eventFormData.isLive}
                      onChange={handleEventInputChange}
                      className="w-4 h-4"
                    />
                    Live Event
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleUpdateEvent}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none justify-center"
                    >
                      <Check size={16} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEvent}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none justify-center"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">{event.title}</h4>
                    <p className="text-zinc-400 text-sm mb-3">{event.description}</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                      <div>
                        <p className="text-white font-medium mb-1">Location</p>
                        <p className="text-zinc-400">{event.location}</p>
                      </div>
                      <div>
                        <p className="text-white font-medium mb-1">Time</p>
                        <p className="text-zinc-400">{event.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    {event.visitLink && (
                      <a
                        href={event.visitLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all border-2 border-blue-500 text-sm sm:text-base flex-1 sm:flex-none text-center"
                      >
                        Learn More
                      </a>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-red-400 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {upcomingEvents.length === 0 && (
          <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-zinc-400">No upcoming events scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManagement;