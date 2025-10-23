import { useState, useEffect } from 'react';
import { getAllPodcasts } from '@/configApi/publications.admin';

interface Podcast {
  _id: string;
  title: string;
  hosts: string;
  spotifyLink: string;
  isPublic: boolean;
}

const PodcastsPage = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const response = await getAllPodcasts();
        console.log(response);
        if (response.status === 200) {
          const publicPodcasts = response.data.podcasts.filter(
            (podcast: Podcast) => podcast.isPublic
          );
          setPodcasts(publicPodcasts);
        }
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const handlePodcastClick = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
  };

  const handleCloseModal = () => {
    setSelectedPodcast(null);
  };

  // Podcast Card Skeleton
  const PodcastCardSkeleton = () => (
    <div className="bg-black rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 bg-gray-800 rounded-full"></div>
        </div>
        <div className="h-6 bg-gray-800 rounded mb-4 w-5/6"></div>
        <div className="space-y-2 mb-6 flex-1">
          <div className="h-3 bg-gray-800 rounded w-3/4"></div>
        </div>
        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Our Podcasts
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tune in to engaging conversations about finance, markets, and economics. Expert insights
            and thought-provoking discussions delivered straight to your ears.
          </p>
        </div>

        {/* Podcasts Grid */}
        <div className="mb-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {[...Array(6)].map((_, index) => (
                <PodcastCardSkeleton key={index} />
              ))}
            </div>
          ) : podcasts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {podcasts.map((podcast) => (
                <div
                  key={podcast._id}
                  className="cursor-pointer h-full transform transition-all duration-300 hover:scale-[1.02] group"
                  onClick={() => handlePodcastClick(podcast)}
                >
                  <div className="bg-black rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col hover:border-white/40 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
                    {/* Gradient top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-gray-800 via-white to-gray-800 group-hover:from-white group-hover:via-gray-400 group-hover:to-white transition-all duration-300"></div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Podcast Icon */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center border-2 border-gray-700 group-hover:border-white/40 group-hover:scale-110 transition-all duration-300 relative">
                          {/* Spotify Green Accent */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <svg className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors duration-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 14.34c-.23 0-.39-.07-.56-.17-1.82-1.09-4.11-1.34-6.81-.73-.21.05-.42.08-.63.08-.58 0-1.05-.47-1.05-1.05 0-.5.35-.92.83-1.02 3.21-.72 5.94-.4 8.14.94.43.26.57.83.31 1.26-.18.3-.5.69-1.23.69zm1.47-3.45c-.27 0-.47-.09-.68-.2-2.07-1.23-5.22-1.59-7.67-.87-.29.09-.55.13-.81.13-.7 0-1.27-.57-1.27-1.27 0-.59.41-1.08.98-1.23 1.22-.36 2.48-.54 3.73-.54 2.21 0 4.34.54 6.14 1.56.52.3.69 1 .39 1.52-.21.38-.61.9-1.81.9zm1.6-3.61c-.3 0-.53-.09-.77-.23-2.39-1.42-6.38-1.85-9.45-1.02-.33.09-.65.14-.98.14-.82 0-1.49-.67-1.49-1.49 0-.69.47-1.28 1.12-1.44 1.45-.42 2.96-.63 4.48-.63 2.56 0 5.03.59 7.13 1.71.6.32.82 1.1.5 1.7-.23.44-.68 1.26-2.54 1.26z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 text-center group-hover:text-gray-100 transition-colors duration-300">
                        {podcast.title}
                      </h3>

                      {/* Hosts */}
                      <div className="mt-auto pt-4 border-t border-gray-800 group-hover:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center justify-center mb-3">
                          <div className="flex -space-x-2">
                            {podcast.hosts.split(',').slice(0, 3).map((host, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-black"
                                title={host.trim()}
                              >
                                {host.trim().charAt(0)}
                              </div>
                            ))}
                            {podcast.hosts.split(',').length > 3 && (
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-black">
                                +{podcast.hosts.split(',').length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 text-center line-clamp-1">
                          Hosted by {podcast.hosts}
                        </p>

                        {/* Listen Badge */}
                        <div className="mt-4 flex items-center justify-center text-xs text-gray-400 group-hover:text-white transition-colors duration-300">
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          <span className="font-medium">Listen on Spotify</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-black p-12 rounded-2xl border border-gray-800 max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                  <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 14.34c-.23 0-.39-.07-.56-.17-1.82-1.09-4.11-1.34-6.81-.73-.21.05-.42.08-.63.08-.58 0-1.05-.47-1.05-1.05 0-.5.35-.92.83-1.02 3.21-.72 5.94-.4 8.14.94.43.26.57.83.31 1.26-.18.3-.5.69-1.23.69zm1.47-3.45c-.27 0-.47-.09-.68-.2-2.07-1.23-5.22-1.59-7.67-.87-.29.09-.55.13-.81.13-.7 0-1.27-.57-1.27-1.27 0-.59.41-1.08.98-1.23 1.22-.36 2.48-.54 3.73-.54 2.21 0 4.34.54 6.14 1.56.52.3.69 1 .39 1.52-.21.38-.61.9-1.81.9zm1.6-3.61c-.3 0-.53-.09-.77-.23-2.39-1.42-6.38-1.85-9.45-1.02-.33.09-.65.14-.98.14-.82 0-1.49-.67-1.49-1.49 0-.69.47-1.28 1.12-1.44 1.45-.42 2.96-.63 4.48-.63 2.56 0 5.03.59 7.13 1.71.6.32.82 1.1.5 1.7-.23.44-.68 1.26-2.54 1.26z"/>
                  </svg>
                </div>
                <p className="text-xl font-semibold text-white mb-2">No Podcasts Available</p>
                <p className="text-gray-400">Check back later for new episodes.</p>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ),
              title: "Expert Conversations",
              description: "In-depth discussions with industry leaders and finance professionals"
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: "Fresh Perspectives",
              description: "Unique insights on market trends, investment strategies, and economics"
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Regular Episodes",
              description: "New episodes released regularly to keep you informed and engaged"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-black p-6 rounded-xl border border-gray-800 hover:border-white/30 transition-all duration-300 group hover:transform hover:scale-[1.02]"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center mb-4 border border-gray-800 text-gray-400 group-hover:text-white group-hover:border-gray-700 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-black rounded-2xl p-8 border border-gray-800 mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Episodes Released" },
              { number: "20+", label: "Expert Guests" },
              { number: "10K+", label: "Listeners" },
              { number: "4.8★", label: "Average Rating" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-16">
          <div className="bg-black rounded-2xl p-10 border border-gray-800 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">Subscribe on Spotify</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Never miss an episode! Follow us on Spotify to get notified when we release new
                conversations about finance, markets, and economics.
              </p>
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 14.34c-.23 0-.39-.07-.56-.17-1.82-1.09-4.11-1.34-6.81-.73-.21.05-.42.08-.63.08-.58 0-1.05-.47-1.05-1.05 0-.5.35-.92.83-1.02 3.21-.72 5.94-.4 8.14.94.43.26.57.83.31 1.26-.18.3-.5.69-1.23.69zm1.47-3.45c-.27 0-.47-.09-.68-.2-2.07-1.23-5.22-1.59-7.67-.87-.29.09-.55.13-.81.13-.7 0-1.27-.57-1.27-1.27 0-.59.41-1.08.98-1.23 1.22-.36 2.48-.54 3.73-.54 2.21 0 4.34.54 6.14 1.56.52.3.69 1 .39 1.52-.21.38-.61.9-1.81.9zm1.6-3.61c-.3 0-.53-.09-.77-.23-2.39-1.42-6.38-1.85-9.45-1.02-.33.09-.65.14-.98.14-.82 0-1.49-.67-1.49-1.49 0-.69.47-1.28 1.12-1.44 1.45-.42 2.96-.63 4.48-.63 2.56 0 5.03.59 7.13 1.71.6.32.82 1.1.5 1.7-.23.44-.68 1.26-2.54 1.26z"/>
                </svg>
                Follow on Spotify
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Podcast Spotify Modal */}
      {selectedPodcast && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-black border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient top accent */}
            <div className="h-1.5 bg-gradient-to-r from-gray-800 via-white to-gray-800"></div>
            
            {/* Modal Header */}
            <div className="bg-black border-b border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center border-2 border-gray-700 relative flex-shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-transparent"></div>
                      <svg className="w-8 h-8 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 14.34c-.23 0-.39-.07-.56-.17-1.82-1.09-4.11-1.34-6.81-.73-.21.05-.42.08-.63.08-.58 0-1.05-.47-1.05-1.05 0-.5.35-.92.83-1.02 3.21-.72 5.94-.4 8.14.94.43.26.57.83.31 1.26-.18.3-.5.69-1.23.69zm1.47-3.45c-.27 0-.47-.09-.68-.2-2.07-1.23-5.22-1.59-7.67-.87-.29.09-.55.13-.81.13-.7 0-1.27-.57-1.27-1.27 0-.59.41-1.08.98-1.23 1.22-.36 2.48-.54 3.73-.54 2.21 0 4.34.54 6.14 1.56.52.3.69 1 .39 1.52-.21.38-.61.9-1.81.9zm1.6-3.61c-.3 0-.53-.09-.77-.23-2.39-1.42-6.38-1.85-9.45-1.02-.33.09-.65.14-.98.14-.82 0-1.49-.67-1.49-1.49 0-.69.47-1.28 1.12-1.44 1.45-.42 2.96-.63 4.48-.63 2.56 0 5.03.59 7.13 1.71.6.32.82 1.1.5 1.7-.23.44-.68 1.26-2.54 1.26z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {selectedPodcast.title}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Hosted by {selectedPodcast.hosts}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {selectedPodcast.hosts.split(',').slice(0, 3).map((host, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-black"
                          title={host.trim()}
                        >
                          {host.trim().charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-3xl font-light w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-900"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Spotify Embed */}
            <div className="flex-1 overflow-hidden bg-black p-6">
              <div className="w-full h-full flex items-center justify-center">
                <iframe
                  src={selectedPodcast.spotifyLink.replace('/episode/', '/embed/episode/')}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                  title={selectedPodcast.title}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-800 p-6 bg-black">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-400 text-sm">
                  Enjoy this episode? Follow us on Spotify for more
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => window.open(selectedPodcast.spotifyLink, '_blank')}
                    className="flex-1 sm:flex-none bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 14.34c-.23 0-.39-.07-.56-.17-1.82-1.09-4.11-1.34-6.81-.73-.21.05-.42.08-.63.08-.58 0-1.05-.47-1.05-1.05 0-.5.35-.92.83-1.02 3.21-.72 5.94-.4 8.14.94.43.26.57.83.31 1.26-.18.3-.5.69-1.23.69zm1.47-3.45c-.27 0-.47-.09-.68-.2-2.07-1.23-5.22-1.59-7.67-.87-.29.09-.55.13-.81.13-.7 0-1.27-.57-1.27-1.27 0-.59.41-1.08.98-1.23 1.22-.36 2.48-.54 3.73-.54 2.21 0 4.34.54 6.14 1.56.52.3.69 1 .39 1.52-.21.38-.61.9-1.81.9zm1.6-3.61c-.3 0-.53-.09-.77-.23-2.39-1.42-6.38-1.85-9.45-1.02-.33.09-.65.14-.98.14-.82 0-1.49-.67-1.49-1.49 0-.69.47-1.28 1.12-1.44 1.45-.42 2.96-.63 4.48-.63 2.56 0 5.03.59 7.13 1.71.6.32.82 1.1.5 1.7-.23.44-.68 1.26-2.54 1.26z"/>
                    </svg>
                    Open in Spotify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PodcastsPage;