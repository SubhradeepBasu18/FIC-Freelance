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
  fileUrl?: string;
  updatedAt?: string;
  __v?: number;
}

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'file'>('text');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getAllArticles();
        if (response.status == 200) {
          // Filter only public articles
          const publicArticles = response.data.articles.filter(
            (article: Article) => article.isPublic
          );
          setArticles(publicArticles);
          console.log(publicArticles);
          
          // Check if there's an article ID in the URL
          handleUrlArticleId(response.data.articles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Handle opening articles from shared URLs
  const handleUrlArticleId = (allArticles: Article[]) => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article');
    
    if (articleId && allArticles.length > 0) {
      const article = allArticles.find(a => 
        a.id?.toString() === articleId || a._id === articleId
      );
      if (article && article.isPublic) {
        setSelectedArticle(article);
        // Clean the URL but keep the parameters for sharing
        window.history.replaceState({}, '', `${window.location.pathname}?article=${articleId}`);
      }
    }
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setViewMode('text'); // Reset to text view when opening new article
    // Update URL when article is opened
    const articleId = article.id || article._id;
    window.history.replaceState({}, '', `${window.location.pathname}?article=${articleId}`);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    setViewMode('text'); // Reset view mode when closing
    // Clean URL when modal is closed
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleShareArticle = async () => {
    if (!selectedArticle) return;

    try {
      // Use query parameter instead of route parameter
      const articleId = selectedArticle.id || selectedArticle._id;
      const articleUrl = `${window.location.origin}${window.location.pathname}?article=${articleId}`;
      
      // Use the Clipboard API to copy the URL
      await navigator.clipboard.writeText(articleUrl);
      
      // Show success notification
      setShowShareNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowShareNotification(false);
      }, 3000);
      
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      const articleId = selectedArticle.id || selectedArticle._id;
      textArea.value = `${window.location.origin}${window.location.pathname}?article=${articleId}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowShareNotification(true);
      setTimeout(() => {
        setShowShareNotification(false);
      }, 3000);
    }
  };

  // Check if file is viewable in browser (PDF, images, text files)
  const isFileViewable = (fileUrl: string) => {
    if (!fileUrl) return false;
    
    const viewableExtensions = ['.txt', '.html', '.htm'];
    const viewablePatterns = ['/image/', '/upload/', 'cloudinary'];
    
    return (
      viewableExtensions.some(ext => fileUrl.toLowerCase().includes(ext)) ||
      viewablePatterns.some(pattern => fileUrl.toLowerCase().includes(pattern))
    );
  };

  // Get file type for display
  const getFileType = (fileUrl: string) => {
    if (!fileUrl) return 'Unknown';
    
    if (fileUrl.toLowerCase().includes('.pdf')) return 'PDF';
    if (fileUrl.toLowerCase().includes('.html') || fileUrl.toLowerCase().includes('.htm')) return 'HTML';
    if (fileUrl.toLowerCase().includes('.txt')) return 'Text';
    if (fileUrl.toLowerCase().includes('/image/')) return 'Image';
    
    return 'File';
  };

  // Check if file is PDF
  const isPdfFile = (fileUrl: string) => {
    return fileUrl && fileUrl.toLowerCase().includes('.pdf');
  };

  // Get proper PDF URL for embedding
  const getPdfEmbedUrl = (fileUrl: string) => {
    if (!fileUrl) return '';
    
    // For PDFs, we can try to use Google Docs viewer as a fallback
    if (isPdfFile(fileUrl)) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    }
    
    return fileUrl;
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

                      {/* File indicator */}
                      {article.fileUrl && (
                        <div className="mt-3 flex items-center justify-start">
                          <div className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/30 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {getFileType(article.fileUrl)} Available
                          </div>
                        </div>
                      )}
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
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-black border border-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-white/10"
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

              {/* View Mode Toggle */}
              {(selectedArticle.fileUrl || selectedArticle.textContent) && (
                <div className="mt-6 flex border border-gray-800 rounded-lg p-1 bg-gray-900/50 w-fit">
                  <button
                    onClick={() => setViewMode('text')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'text'
                        ? 'bg-white text-black shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Text View
                    </div>
                  </button>
                  {selectedArticle.fileUrl && (
                    <button
                      onClick={() => setViewMode('file')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        viewMode === 'file'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {getFileType(selectedArticle.fileUrl)} View
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6 md:p-8 bg-black">
              {viewMode === 'text' ? (
                <div className="max-w-none">
                  {selectedArticle.textContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-300 leading-relaxed mb-6 text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  {selectedArticle.fileUrl ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-400 text-sm">
                          {getFileType(selectedArticle.fileUrl)} Document - {selectedArticle.title}
                        </p>
                        <a
                          href={selectedArticle.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download {getFileType(selectedArticle.fileUrl)}
                        </a>
                      </div>
                      <div className="flex-1 border border-gray-800 rounded-lg overflow-hidden">
                        {isPdfFile(selectedArticle.fileUrl) ? (
                          // For PDFs, use Google Docs viewer as a reliable fallback
                          <iframe
                            src={getPdfEmbedUrl(selectedArticle.fileUrl)}
                            className="w-full h-full min-h-[500px]"
                            title={`PDF - ${selectedArticle.title}`}
                            sandbox="allow-scripts allow-same-origin allow-popups"
                          />
                        ) : (
                          // For other file types (HTML, text, etc.)
                          <iframe
                            src={selectedArticle.fileUrl}
                            className="w-full h-full min-h-[500px]"
                            title={`${getFileType(selectedArticle.fileUrl)} - ${selectedArticle.title}`}
                            sandbox="allow-scripts allow-same-origin"
                          />
                        )}
                      </div>
                      {isPdfFile(selectedArticle.fileUrl) && (
                        <div className="mt-3 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                          <p className="text-yellow-400 text-sm text-center">
                            <strong>Note:</strong> PDF viewing may be limited. For best experience, download the file.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-xl font-semibold text-white mb-2">File Not Available</p>
                      <p className="text-gray-400 mb-6">This article doesn't have an attached file.</p>
                      <button
                        onClick={() => setViewMode('text')}
                        className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                      >
                        Switch to Text View
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-800 p-6 md:p-8 bg-black">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-400 text-sm">
                  Enjoyed this article? Share it with your network.
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleShareArticle}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Article
                  </button>
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
        </div>
      )}

      {/* Share Notification */}
      {showShareNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-60 animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Article link copied to clipboard!
          </div>
        </div>
      )}
    </section>
  );
};

export default ArticlesPage;