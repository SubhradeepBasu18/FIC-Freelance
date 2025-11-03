import { useState, useEffect } from 'react';
import EventCard from '@/components/EventPage/EventCard';
import EventDetailModal from '@/components/EventPage/EventDetailModal';
import { eventCategories } from '@/constants/constants';
import { getAllEvents } from '@/configApi/events';

interface EventCardData {
  id: number;
  _id?: string;
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
  const [pastEvents, setPastEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getAllEvents();
        if (response.status === 200) {
          console.log("Events set");
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const currentTime = new Date();
      currentTime.setHours(0, 0, 0, 0);

      // Filter live events (compare only dates)
      const liveEventsList = events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(0, 0, 0, 0);

        return currentTime >= eventStart && currentTime <= eventEnd;
      });

      setLiveEvents(liveEventsList);
      console.log("liveEventsList: ", liveEventsList);

      // Filter upcoming events (compare only dates)
      const upcomingEventsList = events.filter((event) => {
        const eventStart = new Date(event.startDate);
        eventStart.setHours(0, 0, 0, 0);
        return currentTime < eventStart;
      });

      setUpcomingEvents(upcomingEventsList);
      console.log("upcomingEventsList: ", upcomingEventsList);

      // Filter past events (compare only dates)
      const pastEventsList = events.filter((event) => {
        const eventEnd = new Date(event.endDate);
        eventEnd.setHours(0, 0, 0, 0);
        return currentTime > eventEnd;
      });

      setPastEvents(pastEventsList);
      console.log("pastEventsList: ", pastEventsList);
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
      venue: event.location,
      category: event.type,
      image: event.icon,
      registrationUrl: event.registrationUrl
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

  const speakerItems = [
    {
      image: "/assets/EventSpeakers/Ajitesh Gupta.JPG",
      title: "Ajitesh Gupta",
      subtitle: "",
      handle: "",
      url: "#"
    },
    {
      image: "/assets/EventSpeakers/Dhruv Soni.JPG",
      title: "Dhruv Soni",
      subtitle: "",
      handle: "",
      url: "#"
    },
    {
      image: "/assets/EventSpeakers/Harsh Goela.JPG",
      title: "Harsh Goela",
      subtitle: "",
      handle: "",
      url: "#"
    },
    {
      image: "/assets/EventSpeakers/Ranjika Mitra.JPG",
      title: "Ranjika Mitra",
      subtitle: "",
      handle: "",
      url: "#"
    },
    {
      image: "/assets/EventSpeakers/Pranjal Kamra.JPG",
      title: "Pranjal Kamra",
      subtitle: "",
      handle: "",
      url: "#"
    },
    {
      image: "/assets/EventSpeakers/Vandana Tolani.JPG",
      title: "Vandana Tolani",
      subtitle: "",
      handle: "",
      url: "#"
    }
  ];

  // Modern loading skeleton
  const EventCardSkeleton = () => (
    <div className="bg-black rounded-xl border border-gray-800 h-full flex flex-col animate-pulse overflow-hidden">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="h-4 bg-gray-800 rounded w-24"></div>
        </div>
        <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>
        <div className="space-y-2 mb-6 flex-1">
          <div className="h-3 bg-gray-800 rounded"></div>
          <div className="h-3 bg-gray-800 rounded w-5/6"></div>
          <div className="h-3 bg-gray-800 rounded w-4/6"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-800 rounded mr-3"></div>
            <div className="h-3 bg-gray-800 rounded w-32"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-800 rounded mr-3"></div>
            <div className="h-3 bg-gray-800 rounded w-24"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-800 rounded mr-3"></div>
            <div className="h-3 bg-gray-800 rounded w-40"></div>
          </div>
        </div>
        <div className="h-12 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Our Events
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Engaging workshops, insightful speaker sessions, and collaborative initiatives that bridge the gap
            between financial theory and real-world practice.
          </p>
        </div>

        {/* Inviesta Section - Enhanced Styling */}
        <div className="mb-20">
          <div className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl border border-gray-800 p-6 md:p-12 mb-12 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center">
              {/* Flagship Event Header - Improved for mobile */}
              <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4">
                <div className="hidden sm:block w-20 md:w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                <span className="text-white font-semibold text-base md:text-lg px-4 py-2 border border-white/30 rounded-full">
                  FLAGSHIP EVENT
                </span>
                <div className="hidden sm:block w-20 md:w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Inviesta
              </h2>

              <div className="w-16 md:w-24 h-1 bg-white mx-auto mb-6 md:mb-8"></div>

              {/* Description */}
              <div className="bg-black/50 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-gray-700/50 mb-6 md:mb-8">
                <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
                  <span className="text-white font-bold text-xl md:text-2xl">Inviesta</span> isn't just an annual fest, but where ideas come alive and connect with the real world.
                  From thought-provoking speaker sessions that deliver industry insights and career inspiration, to intellectually
                  stimulating competitions that challenge skills in finance, economics and strategy,
                  Inviesta brings together ambition, creativity, and learning under one roof. Blending Miranda
                  House's prestige with interactive formats, it transforms knowledge into capital and growth into
                  return, making it a true celebration of insight, action, and impact.
                </p>
              </div>

              {/* Stats for Inviesta - Improved grid for mobile */}
              {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8 max-w-2xl mx-auto">
                {[
                  { number: "1000+", label: "Participants" },
                  { number: "15+", label: "Speakers" },
                  { number: "20+", label: "Colleges" },
                  { number: "₹50K+", label: "Prize Pool" }
                ].map((stat, index) => (
                  <div key={index} className="text-center group p-3 md:p-0">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          {/* Speaker Grid Section */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Past Speakers</h3>
            <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto px-4">
              Industry leaders and experts who have shared their knowledge and insights at our events
            </p>
          </div>

          {/* Enhanced Speaker Grid with Larger Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 md:gap-8">
            {speakerItems.map((speaker, index) => (
              <div
                key={index}
                className="group bg-black rounded-xl p-4 md:p-6 border border-gray-800 text-center hover:border-white/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10 flex flex-col items-center"
              >
                <div className="w-26 h-26 md:w-40 md:h-40 mx-auto mb-4 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                  <img
                    src={speaker.image}
                    alt={speaker.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-white font-semibold text-base md:text-lg group-hover:text-gray-200 transition-colors duration-300">
                  {speaker.title}
                </h4>
                <p className="text-gray-400 text-sm mt-1">{speaker.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Upcoming Events</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Don't miss these exciting opportunities to learn, network, and grow
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {[...Array(6)].map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {upcomingEvents.map((event: EventCardData) => (
                <div
                  key={event.id || event._id}
                  className="cursor-pointer h-full transform transition-all duration-300 hover:scale-105"
                  onClick={() => handleEventClick(event)}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Events Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Live Events</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Events happening right now! Join these ongoing sessions and be part of the action
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {[...Array(3)].map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {liveEvents.length > 0 ? (
                liveEvents.map((event: EventCardData) => (
                  <div
                    key={event.id || event._id}
                    className="cursor-pointer group relative h-full transform transition-all duration-300 hover:scale-105"
                    onClick={() => handleEventClick(event)}
                  >
                    {/* Live Badge */}
                    <div className="absolute -top-3 -right-3 z-20">
                      <div className="bg-black border border-white text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE NOW
                      </div>
                    </div>

                    {/* Live Event Card Container - Completely Black */}
                    <div className="relative h-full rounded-xl border border-gray-800 bg-black overflow-hidden">
                      <EventCard event={event} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-black p-8 rounded-2xl border border-gray-800 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                    </div>
                    <p className="text-xl font-semibold text-white mb-2">No Live Events Currently</p>
                    <p className="text-gray-400">Check back later or browse upcoming events.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Past Events Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Past Events</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Relive the memorable events that have shaped our community
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {[...Array(6)].map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {pastEvents.map((event: EventCardData) => (
                <div
                  key={event.id || event._id}
                  className="cursor-pointer h-full transform transition-all duration-300 hover:scale-105 opacity-80 hover:opacity-100"
                  onClick={() => handleEventClick(event)}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
        />

        {/* Event Categories Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Event Categories</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Diverse event formats tailored to different learning styles and interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventCategories.map((category, index) => (
              <div
                key={index}
                className="group bg-black p-6 rounded-xl border border-gray-800 hover:border-white/30 transition-all duration-300 h-full flex flex-col hover:transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-white mb-3 text-center">{category.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 text-center">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Event Stats Section */}
        {/* <div className="bg-black rounded-2xl p-8 border border-gray-800 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "25+", label: "Events Hosted" },
              { number: "2000+", label: "Participants" },
              { number: "25+", label: "Industry Speakers" },
              { number: "15+", label: "Partner Organizations" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default EventPage;