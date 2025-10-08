import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

interface EventCardProps {
    event: {
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
    };
}

const EventCard = ({ event }: EventCardProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTypeGradient = (type: string) => {
        const gradientMap: { [key: string]: string } = {
            workshop: 'from-blue-500/10 via-blue-600/5 to-transparent',
            conference: 'from-purple-500/10 via-purple-600/5 to-transparent',
            seminar: 'from-green-500/10 via-green-600/5 to-transparent',
            competition: 'from-red-500/10 via-red-600/5 to-transparent',
            default: 'from-zinc-500/10 via-zinc-600/5 to-transparent'
        };
        return gradientMap[type.toLowerCase()] || gradientMap.default;
    };

    const getTypeBorder = (type: string) => {
        const borderMap: { [key: string]: string } = {
            workshop: 'border-blue-500/20',
            conference: 'border-purple-500/20',
            seminar: 'border-green-500/20',
            competition: 'border-red-500/20',
            default: 'border-zinc-500/20'
        };
        return borderMap[type.toLowerCase()] || borderMap.default;
    };

    const getTypeColor = (type: string) => {
        const colorMap: { [key: string]: string } = {
            workshop: 'text-blue-400',
            conference: 'text-purple-400',
            seminar: 'text-green-400',
            competition: 'text-red-400',
            default: 'text-accent'
        };
        return colorMap[type.toLowerCase()] || colorMap.default;
    };

    return (
        <div className="group h-full flex flex-col">
            <div className={`
                relative h-full flex flex-col bg-gradient-to-br ${getTypeGradient(event.type)}
                border ${getTypeBorder(event.type)} rounded-2xl overflow-hidden
                transition-all duration-500 hover:scale-105 hover:shadow-2xl
                hover:shadow-accent/10 backdrop-blur-sm
            `}>
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${getTypeGradient(event.type).replace('bg-gradient-to-br ', '')} rounded-2xl blur-sm group-hover:blur-md transition-all duration-500`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                                    {event.title}
                                </h3>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(event.type)} bg-black/30 backdrop-blur-sm border ${getTypeBorder(event.type)}`}>
                                    {event.type}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-6 flex-1 leading-relaxed line-clamp-3">
                        {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm">
                            <Calendar className={`w-4 h-4 ${getTypeColor(event.type)} mr-3 flex-shrink-0`} />
                            <span className="text-gray-300">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Clock className={`w-4 h-4 ${getTypeColor(event.type)} mr-3 flex-shrink-0`} />
                            <span className="text-gray-300">{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <MapPin className={`w-4 h-4 ${getTypeColor(event.type)} mr-3 flex-shrink-0`} />
                            <span className="text-gray-300 line-clamp-1">{event.location}</span>
                        </div>
                    </div>

                    {/* Register Button */}
                    <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            group/btn w-full py-3 px-4 rounded-xl font-semibold text-center
                            transition-all duration-300 transform hover:scale-105
                            flex items-center justify-center gap-2 backdrop-blur-sm
                            bg-gradient-to-r ${getTypeGradient(event.type)} 
                            border ${getTypeBorder(event.type)}
                            hover:shadow-lg text-white
                        `}
                    >
                        <span>Register Now</span>
                        <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                    </a>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
        </div>
    );
};

export default EventCard;