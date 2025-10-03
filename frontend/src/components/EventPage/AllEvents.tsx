import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

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

interface AllEventsProps {
    events: Event[];
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    onEventClick: (event: Event) => void;
    getCategoryColor: (category: string) => string;
}

const EventCard = ({ event, onClick, getCategoryColor }: EventCardProps) => (
    <div
        className="group bg-zinc-900/60 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-300 border border-zinc-800 hover:border-zinc-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30"
        onClick={() => onClick(event)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick(event)}
    >
        <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors flex-1 pr-3 leading-tight">
            {event.title}
        </h3>
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${getCategoryColor(event.category)}`}>
            {event.category}
        </span>
        </div>
        
        <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed tracking-wide">
        {event.description}
        </p>
        
        <div className="space-y-3">
        <div className="flex items-center gap-3 text-zinc-400">
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-white font-medium text-sm">{event.date}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-white font-medium text-sm">{event.time}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center border border-rose-500/20">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <span className="text-white font-medium text-sm">{event.venue}</span>
        </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
        <span className="text-cyan-400 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Learn More
            <ArrowRight className="w-3 h-3" />
        </span>
        {event.isFeatured && (
            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs font-medium border border-amber-500/20">
            Featured
            </span>
        )}
        </div>
    </div>
);

const AllEvents = ({
    events,
    categories,
    selectedCategory,
    onCategoryChange,
    onEventClick,
    getCategoryColor
    }: AllEventsProps) => (
    <div>
        <div className="flex items-center justify-between mb-12">
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">All Events</h2>
            <p className="text-zinc-400 text-lg">Browse through our complete event catalog</p>
        </div>
        <div className="h-px flex-1 ml-8 bg-gradient-to-r from-zinc-700 to-transparent"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
            <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border backdrop-blur-sm ${
                selectedCategory === category
                ? "bg-white text-zinc-900 border-white shadow-lg scale-105"
                : "bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-700/50 hover:border-zinc-600 hover:text-white"
            }`}
            >
            {category}
            </button>
        ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
            <EventCard
            key={event.id}
            event={event}
            onClick={onEventClick}
            getCategoryColor={getCategoryColor}
            variant="standard"
            />
        ))}
        </div>
    </div>
);

export default AllEvents;