import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, AlertTriangle, Eye, EyeOff, FileText } from 'lucide-react';
import { getAllArticles, addArticle, updateArticle, deleteArticle } from '@/configApi/publications.admin';

interface Article {
  _id?: string;
  id?: string;
  title: string;
  textContent?: string;
  authors?: string;
  journal?: string;
  createdAt: string;
  isPublic: boolean;
}

const ArticleManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; article: Article | null }>({
    isOpen: false,
    article: null
  });
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newArticle, setNewArticle] = useState<Omit<Article, 'id' | 'createdAt'>>({
    title: '',
    textContent: '',
    authors: '',
    journal: '',
    isPublic: true,
  });

  // Fetch all articles on component mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const result = await getAllArticles();
      if (result.status === 200) {
        setArticles(result.data.articles || result.data || []);
        setError(null);
      } else {
        setError('Failed to load articles');
      }
    } catch (error) {
      setError('Error loading articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (article: Article, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle({ ...article });
    setSelectedArticle(null);
  };

  const handleSaveEdit = async () => {
    if (editingArticle && editingArticle._id) {
      try {
        setIsLoading(true);
        const result = await updateArticle(
          editingArticle._id,
          editingArticle.title,
          editingArticle.authors || '',
          editingArticle.textContent || '',
          editingArticle.isPublic
        );

        if (result.status === 200) {
          await loadArticles();
          setEditingArticle(null);
          setError(null);
        } else {
          setError('Failed to update article');
        }
      } catch (error) {
        setError('Error updating article');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTogglePublic = () => {
    if (editingArticle) {
      setEditingArticle({
        ...editingArticle,
        isPublic: !editingArticle.isPublic,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
  };

  const handleDeleteClick = (article: Article) => {
    setDeleteConfirm({
      isOpen: true,
      article
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.article?._id) return;

    try {
      setIsLoading(true);
      const result = await deleteArticle(deleteConfirm.article._id);
      if (result.status === 200) {
        await loadArticles();
        setDeleteConfirm({ isOpen: false, article: null });
        setSelectedArticle(null);
        setError(null);
      } else {
        setError('Failed to delete article');
      }
    } catch (error) {
      setError('Error deleting article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, article: null });
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setNewArticle({
      title: '',
      textContent: '',
      authors: '',
      journal: '',
      isPublic: true,
    });
  };

  const handleAddArticle = async () => {
    try {
      setIsLoading(true);
      const result = await addArticle(newArticle);
      
      if (result.status === 201 || result.status === 200) {
        await loadArticles();
        setShowAddModal(false);
        setNewArticle({
          title: '',
          textContent: '',
          authors: '',
          journal: '',
          isPublic: true,
        });
        setError(null);
      } else {
        setError('Failed to add article');
      }
    } catch (error) {
      setError('Error adding article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewArticleTogglePublic = () => {
    setNewArticle(prev => ({
      ...prev,
      isPublic: !prev.isPublic
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-2 text-white">Loading articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.article && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Delete Article</h3>
              <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
              
              <p className="text-gray-300 text-lg mb-2">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.article.title}</span>?
              </p>
              <p className="text-red-400 text-sm">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Article Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Manage your published articles and research papers</p>
        </div>
        <button
          onClick={handleAddClick}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-400 disabled:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 mx-auto sm:mx-0"
        >
          <Plus size={20} />
          Add Article
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Articles Yet</h3>
            <p className="text-gray-300 text-lg mb-6">Get started by creating your first article</p>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 mx-auto"
            >
              <Plus size={20} />
              Create Your First Article
            </button>
          </div>
        ) : (
          articles.map((article: Article) => (
            <div
              key={article._id || article.id}
              onClick={(e) => handleCardClick(article, e)}
              className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{article.title}</h3>
                  {article.authors && (
                    <p className="text-gray-300 text-lg mb-2">{article.authors}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <p className="text-gray-400 text-sm">
                      {formatDate(article.createdAt)}
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      article.isPublic 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                    }`}>
                      {article.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(article);
                    }}
                    disabled={isLoading}
                    className="p-2 bg-zinc-800 hover:bg-cyan-500/20 disabled:bg-zinc-600 text-cyan-400 rounded-lg transition-all duration-300 hover:scale-110 border border-cyan-400/30"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(article);
                    }}
                    disabled={isLoading}
                    className="p-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg transition-all duration-300 hover:scale-110 border border-red-400/30"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {article.textContent && (
                <p className="text-gray-300 text-sm line-clamp-3">
                  {article.textContent}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Article Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Add New Article</h2>
              <button
                onClick={handleAddModalClose}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newArticle.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    placeholder="Enter article title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Authors</label>
                  <input
                    type="text"
                    name="authors"
                    value={newArticle.authors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    placeholder="Enter authors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Journal</label>
                  <input
                    type="text"
                    name="journal"
                    value={newArticle.journal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    placeholder="Enter journal name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    type="button"
                    onClick={handleNewArticleTogglePublic}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
                      newArticle.isPublic
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-zinc-800 text-gray-400 border border-gray-600'
                    } hover:scale-105`}
                  >
                    {newArticle.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                    {newArticle.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Content</label>
                  <textarea
                    name="textContent"
                    value={newArticle.textContent || ''}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 resize-none"
                    placeholder="Enter article content"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={handleAddModalClose}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleAddArticle}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Check size={18} />
                {isLoading ? 'Adding...' : 'Add Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-start p-6 border-b border-gray-700">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-white mb-3">{selectedArticle.title}</h2>
                {selectedArticle.authors && (
                  <p className="text-gray-300 text-lg mb-2">Authors: {selectedArticle.authors}</p>
                )}
                <div className="flex items-center gap-4">
                  <p className="text-gray-400 text-sm">
                    Published: {formatDate(selectedArticle.createdAt)}
                  </p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedArticle.isPublic 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}>
                    {selectedArticle.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedArticle.textContent ? (
                <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.textContent}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-8">No content available</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  handleEdit(selectedArticle);
                  closeModal();
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Edit2 size={18} />
                Edit Article
              </button>
              <button
                onClick={closeModal}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Edit Article</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Title *</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    type="button"
                    onClick={handleTogglePublic}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
                      editingArticle.isPublic
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-zinc-800 text-gray-400 border border-gray-600'
                    } hover:scale-105`}
                  >
                    {editingArticle.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                    {editingArticle.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Authors</label>
                  <input
                    type="text"
                    value={editingArticle.authors || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, authors: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Journal</label>
                  <input
                    type="text"
                    value={editingArticle.journal || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, journal: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Content</label>
                  <textarea
                    value={editingArticle.textContent || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, textContent: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Check size={18} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManagement;