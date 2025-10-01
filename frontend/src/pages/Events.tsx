import { useState } from "react";
import RotatingText from "@/components/MainPage/RotatingText";
import DecryptedText from "@/components/MainPage/DecryptedText";
import EventDetailModal from "@/components/EventPage/EventDetailModal";
import FeaturedEvents from "@/components/EventPage/FeaturedEvents";
import AllEvents from "@/components/EventPage/AllEvents";
import { events, categories } from "@/constants/constants";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  isFeatured: boolean;
}

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
  getCategoryColor: (category: string) => string;
  getCategoryGradient?: (category: string) => string;
  variant?: 'featured' | 'standard';
}

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const featuredEvents = events.filter(event => event.isFeatured);

  const getCategoryColor = (category: string) => {
    const colors = {
      Competition: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      Workshop: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Conference: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Networking: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    };
    return colors[category as keyof typeof colors] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      Competition: "from-rose-600/80 to-orange-600/80",
      Workshop: "from-blue-600/80 to-cyan-600/80",
      Conference: "from-purple-600/80 to-violet-600/80",
      Networking: "from-emerald-600/80 to-teal-600/80"
    };
    return gradients[category as keyof typeof gradients] || "from-zinc-600/80 to-zinc-700/80";
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <section className="relative min-h-screen bg-zinc-950 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-8">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-zinc-300 font-medium">Upcoming Events</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-white">Explore </span>
            <span className="inline-block text-purple-400">
              <RotatingText
                texts={["Events", "Workshops", "Competitions", "Conferences"]}
                mainClassName="inline-block"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </span>
          </h1>

          <p className="max-w-3xl text-lg md:text-xl text-zinc-400 mx-auto leading-relaxed tracking-wide">
            <DecryptedText
              speed={80}
              maxIterations={25}
              characters="abcdefghijklmnopqrstuvwxyz!?123"
              className="revealed"
              parentClassName="all-letters"
              encryptedClassName="encrypted"
              text="Immerse yourself in cutting-edge technology, learn from industry experts, and connect with like-minded innovators."
            />
          </p>
        </div>

        {/* Featured Events Section */}
        <FeaturedEvents
          featuredEvents={featuredEvents}
          onEventClick={handleEventClick}
          getCategoryColor={getCategoryColor}
          getCategoryGradient={getCategoryGradient}
        />

        {/* All Events Section */}
        <AllEvents
          events={filteredEvents}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onEventClick={handleEventClick}
          getCategoryColor={getCategoryColor}
        />
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal 
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        getCategoryColor={getCategoryColor}
      />
    </section>
  );
};

export default Events;