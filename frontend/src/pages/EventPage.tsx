import { useState, useEffect } from 'react';
import ChromaGrid from '@/components/ui/ChromaGrid';
import EventCard from '@/components/EventPage/EventCard';
import EventDetailModal from '@/components/EventPage/EventDetailModal';
import { upcomingEvents, eventCategories } from '@/constants/constants';
import { getAllEvents } from '@/configApi/events';
// Define interfaces for both data structures
interface EventCardData {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  registrationUrl: string;
  type: string;
  icon: string;
}

interface ModalEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  image: string;
  registrationUrl: string;
}

const EventPage = () => {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ModalEvent | null>(null);
  const [liveEvents, setLiveEvents] = useState<EventCardData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventCardData[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        if (response.status === 200) {
          console.log("Events set");
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []); // Run only once when the component mounts

  useEffect(() => {
    if (events.length > 0) {
      const currentTime = new Date();
  
      // Set current time to midnight for date comparison
      currentTime.setHours(0, 0, 0, 0);
  
  
      // Filter live events (compare only dates)
      const liveEventsList = events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
  
        // Set event times to midnight for date comparison
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(0, 0, 0, 0);
  
        return currentTime >= eventStart && currentTime <= eventEnd;
      });
  
      setLiveEvents(liveEventsList);
      console.log("liveEventsList: ", liveEventsList);
      
  
      // Filter upcoming events (compare only dates)
      const upcomingEventsList = events.filter((event) => {
        const eventStart = new Date(event.startDate);
  
        // Set event start time to midnight for date comparison
        eventStart.setHours(0, 0, 0, 0);
  
        return currentTime < eventStart;
      });
  
      setUpcomingEvents(upcomingEventsList);
      console.log("upcomingEventsList: ", upcomingEventsList);
    }
  }, [events]);
  


  // Function to convert EventCardData to ModalEvent
  const convertToModalEvent = (event: EventCardData): ModalEvent => {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.startDate,
      time: event.time,
      venue: event.location, // Map location to venue
      category: event.type,   // Map type to category
      image: event.icon,      // Map icon to image, or use a default
      registrationUrl: event.registrationUrl       // You can set this based on your logic
    };
  };

  // Function to handle event card click
  const handleEventClick = (event: EventCardData) => {
    const modalEvent = convertToModalEvent(event);
    setSelectedEvent(modalEvent);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Category color mapping function
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      workshop: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      conference: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      seminar: 'bg-green-500/20 text-green-300 border border-green-500/30',
      competition: 'bg-red-500/20 text-red-300 border border-red-500/30',
      default: 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
    };

    return colorMap[category.toLowerCase()] || colorMap.default;
  };

  const speakerItems = [
    {
      image: "/src/assets/EventSpeakers/Ajitesh Gupta.JPG",
      title: "Ajitesh Gupta",
      subtitle: "",
      handle: "",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Dhruv Soni.JPG",
      title: "Dhruv Soni",
      subtitle: "",
      handle: "",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Harsh Goela.JPG",
      title: "Harsh Goela",
      subtitle: "",
      handle: "",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(145deg, #8B5CF6, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Ranjika Mitra.JPG",
      title: "Ranjika Mitra",
      subtitle: "",
      handle: "",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(145deg, #F59E0B, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Pranjal Kamra.JPG",
      title: "Pranjal Kamra",
      subtitle: "",
      handle: "",
      borderColor: "#EC4899",
      gradient: "linear-gradient(180deg, #EC4899, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Vandana Tolani.JPG",
      title: "Vandana Tolani",
      subtitle: "",
      handle: "",
      borderColor: "#06B6D4",
      gradient: "linear-gradient(180deg, #06B6D4, #000)",
      url: "#"
    }
  ];

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold italic text-white mb-6 tracking-tight">
            Our Events
          </h1>
          <div className="w-24 h-1 accent-bg mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Engaging workshops, insightful speaker sessions, and collaborative initiatives that bridge the gap
            between financial theory and real-world practice.
          </p>
        </div>

        {/* Inviesta Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Inviesta</h2>
            <div className="w-20 h-1 accent-bg mx-auto"></div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-accent/20 mb-12">
            <p className="text-lg text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
              <span className="text-accent font-semibold">Inviesta</span> isn't just an annual fest but where ideas come alive and connect with the real world.
              From thought-provoking speaker sessions that deliver industry insights and career inspiration, to intellectually
              stimulating competitions that challenge skills in finance, economics and strategy,
              Inviesta brings together ambition, creativity, and learning under one roof. Blending Miranda
              House's prestige with interactive formats, it transforms knowledge into capital and growth into
              return, making it a true celebration of insight, action, and impact.
            </p>
          </div>

          {/* Speaker Grid Section */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Our Past Speakers</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Industry leaders and experts who have shared their knowledge and insights at our events
            </p>
          </div>

          {/* Responsive Speaker Grid Container */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Mobile Fallback Grid */}
            <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-4">
              {speakerItems.map((speaker, index) => (
                <div key={index} className="bg-zinc-900/50 rounded-xl p-4 border border-accent/20 text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2"
                    style={{ borderColor: speaker.borderColor }}>
                    <img
                      src={speaker.image}
                      alt={speaker.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white font-semibold text-sm">{speaker.title}</h4>
                </div>
              ))}
            </div>

            {/* Desktop ChromaGrid */}
            <div className="hidden lg:block h-[800px]">
              <ChromaGrid
                items={speakerItems}
                radius={250}
                damping={0.5}
                fadeOut={0.7}
                ease="power3.out"
              />
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Upcoming Events</h2>
            <div className="w-20 h-1 accent-bg mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Don't miss these exciting opportunities to learn, network, and grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event: EventCardData) => (
              <div
                key={event._id}
                className="cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleEventClick(event)}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>

        {/* Live Events Section */}
        <div className="mb-20">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Live Events</h2>
            <div className="w-20 h-1 accent-bg mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Events happening right now! Join these ongoing sessions and be part of the action
            </p>
        </div>

        {/* Live Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Check if there are live events */}
            {liveEvents.length > 0 ? (
            liveEvents.map((event: EventCardData) => (
                <div
                key={event._id}
                className="cursor-pointer transform transition-transform hover:scale-105 relative"
                onClick={() => handleEventClick(event)}
                >
                {/* Live Badge */}
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    LIVE NOW
                    </div>
                </div>

                {/* Enhanced Event Card with Live Styling */}
                <div className="relative overflow-hidden rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                    <EventCard event={event} />

                    {/* Live Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none"></div>

                    {/* Join Now Button Overlay */}
                    <div className="absolute mt-2 bottom-4 left-4 right-4">
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={(e) => {
                        e.stopPropagation();
                        window.open(event.registrationUrl, '_blank');
                        }}
                    >
                        Join Now
                    </button>
                    </div>
                </div>
                </div>
            ))
            ) : (
            // Display message when no live events are available
            <div className="col-span-full text-center py-8">
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/30">
                <p className="text-xl font-semibold text-white">No Live Events Currently</p>
                <p className="text-gray-400 mt-2">Check back later or browse upcoming events.</p>
                </div>
            </div>
            )}
        </div>
        </div>


        {/* Event Detail Modal */}
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
          getCategoryColor={getCategoryColor}
        />

        {/* Event Categories Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Event Categories</h2>
            <div className="w-20 h-1 accent-bg mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Diverse event formats tailored to different learning styles and interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventCategories.map((category, index) => (
              <div
                key={index}
                className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{category.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Event Stats Section */}
        <div className="bg-black rounded-2xl p-8 border border-accent/20 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400 text-sm">Events Hosted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">2000+</div>
              <div className="text-gray-400 text-sm">Participants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">25+</div>
              <div className="text-gray-400 text-sm">Industry Speakers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-gray-400 text-sm">Partner Organizations</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-zinc-500/10 to-blue-500/10 rounded-2xl p-8 border border-accent/20">
            <h3 className="text-2xl font-bold text-white mb-4">Want to stay updated?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Follow us on social media and join our mailing list to get notified about upcoming events,
              workshops, and opportunities.
            </p>
            <button className="accent-bg primary-text px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
              Join Our Community
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventPage;