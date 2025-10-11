import { useState, useEffect } from 'react';
import { getAllJournals } from '@/configApi/publications.admin';

interface journal {
  id: number;
  _id?: string;
  title: string;
  description: string;
  fileUrl: string;
  authors: string;
  isPublic: boolean;
  createdAt: string;
}

const journalsPage = () => {
  const [journals, setjournals] = useState<journal[]>([]);
  const [selectedjournal, setSelectedjournal] = useState<journal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchjournals = async () => {
      try {
        setLoading(true);
        const response = await getAllJournals();
        console.log(response.data.journals);
        if (response.status === 200) {
          const publicjournals = response.data.journals.filter(
            (journal: journal) => journal.isPublic
          );
          setjournals(publicjournals);
        }
      } catch (error) {
        console.error('Error fetching journals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchjournals();
  }, []);

  const handlejournalClick = (journal: journal) => {
    setSelectedjournal(journal);
  };

  const handleCloseModal = () => {
    setSelectedjournal(null);
  };

  const handleDownload = (fileUrl: string, title: string) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // journal Card Skeleton
  const JournalCardSkeleton = () => (
    <div className="bg-black rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-800 rounded w-3/4"></div>
          <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
        </div>
        <div className="space-y-2 mb-6 flex-1">
          <div className="h-3 bg-gray-800 rounded"></div>
          <div className="h-3 bg-gray-800 rounded w-5/6"></div>
          <div className="h-3 bg-gray-800 rounded w-4/6"></div>
        </div>
        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
          </div>
          <div className="h-3 bg-gray-800 rounded w-24"></div>
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
            Our journals
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay informed with our curated journals featuring market analysis, research insights,
            and expert perspectives on the latest trends in finance and economics.
          </p>
        </div>

        {/* journals Grid */}
        <div className="mb-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              {[...Array(4)].map((_, index) => (
                <JournalCardSkeleton key={index} />
              ))}
            </div>
          ) : journals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              {journals.map((journal) => (
                <div
                  key={journal.id || journal._id}
                  className="cursor-pointer h-full transform transition-all duration-300 hover:scale-[1.02] group"
                  onClick={() => handlejournalClick(journal)}
                >
                  <div className="bg-black rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col hover:border-white/40 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
                    {/* Gradient top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-gray-800 via-white to-gray-800 group-hover:from-white group-hover:via-gray-400 group-hover:to-white transition-all duration-300"></div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Header with Title and PDF Icon */}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white line-clamp-2 flex-1 group-hover:text-gray-100 transition-colors duration-300">
                          {journal.title}
                        </h3>
                        <div className="ml-4 w-14 h-14 bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center border border-gray-700 group-hover:border-white/30 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                          <svg className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>

                      {/* Description with fade effect */}
                      <div className="relative mb-6 flex-1">
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                          {journal.description}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
                      </div>

                      {/* Authors and Date */}
                      <div className="pt-4 border-t border-gray-800 group-hover:border-gray-700 transition-colors duration-300">
                        {/* Authors */}
                        <div className="flex items-center mb-3">
                        <div className="flex items-center mb-3">
                            <div className="flex -space-x-2">
                                <div
                                className="w-7 h-7 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-black"
                                title={journal.authors}
                                >
                                {journal.authors.charAt(0)}  {/* Display the first letter of authors */}
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 ml-3">
                                {journal.authors}
                            </span>
                        </div>

                          {/* <span className="text-xs text-gray-500 ml-3">
                            {journal.authors.length} {journal.authors.length === 1 ? 'Author' : 'Authors'}
                          </span> */}
                        </div>

                        {/* Date and View Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(journal.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <div className="flex items-center text-xs text-gray-400 group-hover:text-white transition-colors duration-300">
                            <span className="font-medium">View PDF</span>
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
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
                  <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-white mb-2">No journals Available</p>
                <p className="text-gray-400">Check back later for new editions.</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: "Market Analysis",
              description: "In-depth research and analysis of market trends and opportunities"
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              ),
              title: "Expert Insights",
              description: "Curated perspectives from industry leaders and professionals"
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              ),
              title: "Regular Updates",
              description: "Quarterly editions keeping you informed on the latest developments"
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
              { number: "24+", label: "Issues Published" },
              { number: "30+", label: "Contributing Writers" },
              { number: "5K+", label: "Subscribers" },
              { number: "100+", label: "Pages of Content" }
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
        <div className="text-center mt-16">
          <div className="bg-black rounded-2xl p-10 border border-gray-800 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">Subscribe to Our journal</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get the latest editions delivered directly to your inbox. Join our community of finance
                enthusiasts and stay ahead of market trends.
              </p>
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all duration-300">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* journal PDF Viewer Modal */}
      {selectedjournal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-black border border-gray-800 rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl shadow-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient top accent */}
            <div className="h-1.5 bg-gradient-to-r from-gray-800 via-white to-gray-800"></div>
            
            {/* Modal Header */}
            <div className="bg-black border-b border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {selectedjournal.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {selectedjournal.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-2">
                        {selectedjournal.authors.split(' ').slice(0, 3).map((author, idx) => (
                        <div
                            key={idx}
                            className="w-7 h-7 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-black"
                            title={author}
                        >
                            {author.charAt(0)}
                        </div>
                        ))}
                    </div>
                    <span className="text-gray-400">
                        {selectedjournal.authors}
                    </span>
                </div>

                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">
                      {new Date(selectedjournal.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
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

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-950 p-4">
              <iframe
                src={selectedjournal.fileUrl}
                className="w-full h-full rounded-lg border border-gray-800"
                title={selectedjournal.title}
              />
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-800 p-6 bg-black">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-400 text-sm">
                  Download this journal for offline reading
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => window.open(selectedjournal.fileUrl, '_blank')}
                    className="flex-1 sm:flex-none bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => handleDownload(selectedjournal.fileUrl, selectedjournal.title)}
                    className="flex-1 sm:flex-none bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
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

export default journalsPage;