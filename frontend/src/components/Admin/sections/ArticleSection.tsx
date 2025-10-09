import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
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
      setLoading(true);
      const result = await getAllArticles();
      if (result.status === 200) {
        setArticles(result.data.articles || result.data || []);
      } else {
        console.error('Failed to load articles:', result.data);
        alert('Failed to load articles');
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      alert('Error loading articles');
    } finally {
      setLoading(false);
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
        const result = await updateArticle(
          editingArticle._id,
          editingArticle.title,
          editingArticle.authors || '',
          editingArticle.textContent || '',
          editingArticle.isPublic
        );

        console.log('Update result:', result);

        if (result.status === 200) {
          await loadArticles(); // Refresh the list
          setEditingArticle(null);
        } else {
          console.error('Failed to update article:', result.data);
          alert('Failed to update article');
        }
      } catch (error) {
        console.error('Error updating article:', error);
        alert('Error updating article');
      }
    }
  };

  const handleTogglePublic = () => {
    if (editingArticle) {
      setEditingArticle({
        ...editingArticle,
        isPublic: !editingArticle.isPublic,
      });
      console.log('Toggled isPublic to:', !editingArticle.isPublic); // Debug log
    }
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
  };

  const handleDelete = (articleId: string) => {
    setShowDeleteConfirm(articleId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      try {
        const result = await deleteArticle(showDeleteConfirm);
        if (result.status === 200) {
          await loadArticles(); // Refresh the list
          setShowDeleteConfirm(null);
          setSelectedArticle(null);
        } else {
          console.error('Failed to delete article:', result.data);
          alert('Failed to delete article');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting article');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
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
      const result = await addArticle(newArticle);
      
      if (result.status === 201 || result.status === 200) {
        await loadArticles(); // Refresh the list
        setShowAddModal(false);
        setNewArticle({
          title: '',
          textContent: '',
          authors: '',
          journal: '',
          isPublic: true,
        });
      } else {
        console.error('Failed to add article:', result.data);
        alert('Failed to add article');
      }
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Error adding article');
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
    console.log('New article isPublic toggled to:', !newArticle.isPublic); // Debug log
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-white text-center">Loading articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Article Management</h1>
        
        {/* Add Article Button */}
        <button
          onClick={handleAddClick}
          className="mb-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add New Article
        </button>

        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No articles found.</p>
            </div>
          ) : (
            articles.map((article: Article) => (
              <div
                key={article._id || article.id}
                onClick={(e) => handleCardClick(article, e)}
                className="bg-zinc-900 rounded-xl border border-gray-800 p-6 hover:shadow-lg hover:border-gray-700 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                    {article.authors && (
                      <p className="text-sm text-gray-400 mb-1">{article.authors}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        article.isPublic 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {article.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article._id || article.id || '')}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Article Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleAddModalClose}
          >
            <div
              className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Add New Article</h2>
                <button
                  onClick={handleAddModalClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newArticle.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Authors</label>
                  <input
                    type="text"
                    name="authors"
                    value={newArticle.authors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Journal</label>
                  <input
                    type="text"
                    name="journal"
                    value={newArticle.journal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-300">Visibility: </label>
                  <button
                    type="button"
                    onClick={handleNewArticleTogglePublic}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      newArticle.isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {newArticle.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <textarea
                    name="textContent"
                    value={newArticle.textContent || ''}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                <button
                  onClick={handleAddModalClose}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddArticle}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Add Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {selectedArticle && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start p-6 border-b border-gray-800">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedArticle.title}</h2>
                  {selectedArticle.authors && (
                    <p className="text-sm text-gray-400">Authors: {selectedArticle.authors}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-gray-500">
                      Published: {new Date(selectedArticle.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedArticle.isPublic 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {selectedArticle.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
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
                  <p className="text-gray-500 italic">No content available</p>
                )}
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                <button
                  onClick={() => {
                    handleEdit(selectedArticle);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Edit Article
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingArticle && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleCancelEdit}
          >
            <div
              className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Edit Article</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-300">Visibility: </label>
                  <button
                    type="button"
                    onClick={handleTogglePublic}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      editingArticle.isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {editingArticle.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Authors</label>
                  <input
                    type="text"
                    value={editingArticle.authors || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, authors: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Journal</label>
                  <input
                    type="text"
                    value={editingArticle.journal || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, journal: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <textarea
                    value={editingArticle.textContent || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, textContent: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={cancelDelete}
          >
            <div
              className="bg-zinc-900 rounded-2xl border border-gray-800 max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this article? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleManagement;