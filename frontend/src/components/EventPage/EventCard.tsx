import SpotlightCard from '@/components/ui/SpotlightCard';
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

    return (
        <SpotlightCard 
            className="h-full custom-spotlight-card" 
            spotlightColor="rgba(0, 229, 255, 0.2)"
        >
            <div className="p-6 h-full flex flex-col">
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div>
                            <h3 className="text-2xl italic font-bold light-text">{event.title}</h3>
                            <p className="text-accent text-sm capitalize">{event.type}</p>
                        </div>
                    </div>
                </div>

                {/* Event Description */}
                <p className="text-gray-300 mb-6 flex-grow leading-relaxed">
                    {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-accent mr-2" />
                        <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-accent mr-2" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-accent mr-2" />
                        <span>{event.location}</span>
                    </div>
                </div>

                {/* Register Button */}
                <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-accent light-text py-3 px-4 rounded-lg font-semibold text-center hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <span>Register on Unstop</span>
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </SpotlightCard>
    );
};

export default EventCard;