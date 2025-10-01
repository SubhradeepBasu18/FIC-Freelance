import { Calendar, MapPin, ArrowRight } from "lucide-react";

export interface Event {
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

interface FeaturedEventsProps {
    featuredEvents: Event[];
    onEventClick: (event: Event) => void;
    getCategoryColor: (category: string) => string;
    getCategoryGradient: (category: string) => string;
}

const FeaturedEventCard = ({ 
    event, 
    onClick, 
    getCategoryColor, 
    getCategoryGradient 
    }: EventCardProps) => (
    <div
        className="group relative bg-zinc-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50"
        onClick={() => onClick(event)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick(event)}
    >
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getCategoryGradient(event.category)}`}></div>
        
        {/* Image/Header */}
        <div className={`relative h-48 bg-gradient-to-br ${getCategoryGradient(event.category)} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${getCategoryColor(event.category)}`}>
            {event.category}
            </span>
        </div>
        <div className="relative text-center px-6">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/20">
            <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-semibold text-lg leading-tight block">
            {event.title}
            </span>
        </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors leading-tight">
            {event.title}
            </h3>
            
            <div className="space-y-3">
            <div className="flex items-center gap-3 text-zinc-400">
                <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                <p className="text-zinc-400 text-xs font-medium">Date</p>
                <p className="text-white font-medium text-sm">{event.date}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 text-zinc-400">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                <MapPin className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                <p className="text-zinc-400 text-xs font-medium">Venue</p>
                <p className="text-white font-medium text-sm">{event.venue}</p>
                </div>
            </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <span className="text-cyan-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                View Details
                <ArrowRight className="w-4 h-4" />
            </span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
        </div>
        </div>
    </div>
);

const FeaturedEvents = ({ 
    featuredEvents, 
    onEventClick, 
    getCategoryColor, 
    getCategoryGradient 
    }: FeaturedEventsProps) => (
    <div className="mb-24">
        <div className="flex items-center justify-between mb-12">
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured Events</h2>
            <p className="text-zinc-400 text-lg">Curated selection of must-attend events</p>
        </div>
        <div className="h-px flex-1 ml-8 bg-gradient-to-r from-zinc-700 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredEvents.map((event) => (
            <FeaturedEventCard
            key={event.id}
            event={event}
            onClick={onEventClick}
            getCategoryColor={getCategoryColor}
            getCategoryGradient={getCategoryGradient}
            variant="featured"
            />
        ))}
        </div>
    </div>
);

export default FeaturedEvents;