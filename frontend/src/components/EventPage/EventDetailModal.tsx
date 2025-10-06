import { Calendar, Clock, MapPin, Tag, X } from "lucide-react";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    image: string;
    registrationUrl: string;
}

interface EventDetailModalProps {
    event: Event | null;
    onClose: () => void;
    getCategoryColor: (category: string) => string;
}

const EventDetailModal = ({ event, onClose, getCategoryColor }: EventDetailModalProps) => {
    if (!event) return null;
    console.log('event: ', event);
    

    return (
        <div 
        className="fixed inset-0 bg-zinc-950/95 backdrop-blur-xl z-[9999] flex items-start justify-center p-4 pt-24 animate-in fade-in duration-300 overflow-y-auto"
        onClick={onClose}
        >
        <div 
            className="bg-zinc-900 rounded-2xl max-w-2xl w-full my-8 border border-zinc-700/50 shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-8 duration-400 relative"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Minimal Close Button */}
            <button
            className="absolute -top-4 -right-4 w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all duration-200 border border-zinc-600/50 shadow-lg z-20"
            onClick={onClose}
            >
            <X className="w-4 h-4" />
            </button>

            {/* Clean Header */}
            <div className="p-6 border-b border-zinc-800">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${getCategoryColor(event.category).split(' ')[0]}`}></div>
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white leading-tight tracking-tight">
                    {event.title}
                    </h2>
                </div>
                </div>
                
                <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getCategoryColor(event.category)} backdrop-blur-sm`}>
                    {event.category}
                </span>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Registration Open</span>
                </div>
                </div>
            </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
            {/* Elegant Hero */}
            <div className="h-40 bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-xl flex items-center justify-center relative overflow-hidden border border-zinc-700">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent"></div>
                <div className="relative text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/10">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-medium text-lg block">{event.title}</span>
                </div>
            </div>

            {/* Refined Details Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/30 hover:border-zinc-600 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                    <p className="text-zinc-400 text-sm font-medium mb-1">Date</p>
                    <p className="text-white font-semibold">{event.date}</p>
                    </div>
                </div>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/30 hover:border-zinc-600 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center border border-violet-500/20">
                    <Clock className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                    <p className="text-zinc-400 text-sm font-medium mb-1">Time</p>
                    <p className="text-white font-semibold">{event.time}</p>
                    </div>
                </div>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/30 hover:border-zinc-600 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center border border-rose-500/20">
                    <MapPin className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                    <p className="text-zinc-400 text-sm font-medium mb-1">Venue</p>
                    <p className="text-white font-semibold">{event.venue}</p>
                    </div>
                </div>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/30 hover:border-zinc-600 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                    <Tag className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                    <p className="text-zinc-400 text-sm font-medium mb-1">Category</p>
                    <p className="text-white font-semibold">{event.category}</p>
                    </div>
                </div>
                </div>
            </div>

            {/* Professional Description */}
            <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                Event Overview
                </h3>
                <p className="text-zinc-300 leading-relaxed text-[15px] tracking-wide">
                {event.description}
                </p>
            </div>

            {/* Sophisticated Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-white text-zinc-900 hover:bg-zinc-100 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
                onClick={() => window.open(event.registrationUrl, '_blank')}
                >
                <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                </div>
                Register Now
                </button>
                <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 border border-zinc-600 hover:border-zinc-500 hover:scale-[1.02] flex items-center justify-center gap-3">
                <Calendar className="w-5 h-5" />
                Add to Calendar
                </button>
            </div>

            {/* Minimal Stats */}
            <div className="flex items-center justify-around pt-4 border-t border-zinc-800">
                <div className="text-center">
                <p className="text-white font-bold text-lg">24</p>
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Seats</p>
                </div>
                <div className="h-8 w-px bg-zinc-700"></div>
                <div className="text-center">
                <p className="text-white font-bold text-lg">98%</p>
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Booked</p>
                </div>
                <div className="h-8 w-px bg-zinc-700"></div>
                <div className="text-center">
                <p className="text-white font-bold text-lg">4.8</p>
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Rating</p>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default EventDetailModal;

