import { useState, useEffect } from 'react';
import { getAllArticles } from '@/configApi/publications.admin';

interface Article {
  id: number;
  _id?: string;
  title: string;
  authors: string;
  textContent: string;
  isPublic: boolean;
  createdAt?: string;
}

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getAllArticles();
        if (response.status === 200) {
          // Filter only public articles
          const publicArticles = response.data.articles.filter(
            (article: Article) => article.isPublic
          );
          setArticles(publicArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  // Get reading time estimate
  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  // Article Card Skeleton
  const ArticleCardSkeleton = () => (
    <div className="bg-black rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-7 bg-gray-800 rounded mb-4 w-5/6"></div>
        <div className="space-y-2 mb-6 flex-1">
          <div className="h-3 bg-gray-800 rounded"></div>
          <div className="h-3 bg-gray-800 rounded w-5/6"></div>
          <div className="h-3 bg-gray-800 rounded w-4/6"></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-800 rounded-full mr-3"></div>
            <div className="h-4 bg-gray-800 rounded w-24"></div>
          </div>
          <div className="h-3 bg-gray-800 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with gradient accent */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Our Articles
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore insightful perspectives on finance, markets, and economics written by our talented
            members and industry experts.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="mb-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {[...Array(6)].map((_, index) => (
                <ArticleCardSkeleton key={index} />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {articles.map((article) => (
                <div
                  key={article.id || article._id}
                  className="cursor-pointer h-full transform transition-all duration-300 hover:scale-[1.02] group"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="bg-black rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col hover:border-white/40 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
                    {/* Gradient top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-gray-800 via-white to-gray-800 group-hover:from-white group-hover:via-gray-400 group-hover:to-white transition-all duration-300"></div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">
                        {article.title}
                      </h3>

                      {/* Preview Text with fade effect */}
                      <div className="relative mb-6 flex-1">
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">
                          {article.textContent}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
                      </div>

                      {/* Author and Reading Time */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800 group-hover:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3 border border-gray-700 group-hover:border-white/30 transition-all duration-300">
                            {article.authors?.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm text-white font-medium block">
                              {article.authors}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getReadingTime(article.textContent)} min read
                            </span>
                          </div>
                        </div>
                        {article.createdAt && (
                          <div className="text-right">
                            <span className="text-xs text-gray-500 block">
                              {new Date(article.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="text-xs text-gray-600">
                              {new Date(article.createdAt).getFullYear()}
                            </span>
                          </div>
                        )}
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
                <p className="text-xl font-semibold text-white mb-2">No Articles Available</p>
                <p className="text-gray-400">Check back later for new content.</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
              title: "Deep Insights",
              description: "Comprehensive analysis and perspectives on complex financial topics"
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: "Expert Authors",
              description: "Written by students, alumni, and industry professionals"
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "Fresh Content",
              description: "Regularly updated with the latest trends and market developments"
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
              { number: "50+", label: "Articles Published" },
              { number: "15+", label: "Contributing Authors" },
              { number: "10K+", label: "Readers" },
              { number: "20+", label: "Topics Covered" }
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
              <h3 className="text-3xl font-bold text-white mb-4">Want to contribute?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Share your insights and knowledge with our community. We welcome submissions from
                students, alumni, and industry professionals.
              </p>
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all duration-300">
                Submit Your Article
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-black border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient top accent */}
            <div className="h-1.5 bg-gradient-to-r from-gray-800 via-white to-gray-800"></div>
            
            {/* Modal Header */}
            <div className="bg-black border-b border-gray-800 p-6 md:p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center text-gray-400 text-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold mr-4 border border-gray-700">
                      {selectedArticle.authors.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-base">{selectedArticle.authors}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {selectedArticle.createdAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(selectedArticle.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        )}
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500">
                          {getReadingTime(selectedArticle.textContent)} min read
                        </span>
                      </div>
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

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6 md:p-8 bg-black">
              <div className="max-w-none">
                {selectedArticle.textContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-300 leading-relaxed mb-6 text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-800 p-6 md:p-8 bg-black">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-400 text-sm">
                  Enjoyed this article? Share it with your network.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ArticlesPage