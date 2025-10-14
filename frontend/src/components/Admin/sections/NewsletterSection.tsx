import React, { useEffect, useState } from 'react';
import { FileText, ExternalLink, Edit2, Trash2, ChevronDown, ChevronUp, Plus, Upload, X, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { getAllNewsletters, addNewsletter, updateNewsletter, deleteNewsletter } from '@/configApi/publications.admin';

interface Newsletter {
  id: string;
  title: string;
  authors?: string;
  createdAt: string;
  isPublic: boolean;
  fileUrl?: string;
}

const NewsletterSection: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; newsletter: Newsletter | null }>({
    isOpen: false,
    newsletter: null
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    isPublic: true,
  });

  // Fetch newsletters on component mount
  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setIsLoading(true);
      const response = await getAllNewsletters();
      if (response.status === 200) {
        const transformedNewsletters = response.data.newsletters.map((newsletter: any) => ({
          id: newsletter._id,
          title: newsletter.title,
          authors: newsletter.authors,
          createdAt: newsletter.createdAt,
          isPublic: newsletter.isPublic,
          fileUrl: newsletter.fileUrl,
        }));
        setNewsletters(transformedNewsletters);
        setError(null);
      } else {
        setError('Failed to fetch newsletters');
      }
    } catch (error) {
      setError('Error fetching newsletters');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEditClick = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter);
    setFormData({
      title: newsletter.title,
      authors: newsletter.authors || '',
      isPublic: newsletter.isPublic,
    });
    setSelectedFile(null);
  };

  const handleEditSubmit = async () => {
    if (!editingNewsletter) return;

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('authors', formData.authors || '');
      formDataToSend.append('isPublic', String(formData.isPublic));
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await updateNewsletter(editingNewsletter.id, formData);
      
      if (response.status === 200) {
        await fetchNewsletters();
        setEditingNewsletter(null);
        setSelectedFile(null);
        resetForm();
        setError(null);
      } else {
        setError('Failed to update newsletter');
      }
    } catch (error) {
      setError('Error updating newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async () => {
    if (!formData.title.trim() || !formData.authors.trim() || !selectedFile) {
      setError('Please fill all required fields and select a file');
      return;
    }

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('authors', formData.authors);
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('isPublic', String(formData.isPublic));

      const response = await addNewsletter(formDataToSend);
      
      if (response.status === 201) {
        await fetchNewsletters();
        setShowAddModal(false);
        setSelectedFile(null);
        resetForm();
        setError(null);
      } else {
        setError('Failed to add newsletter');
      }
    } catch (error) {
      setError('Error adding newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (newsletter: Newsletter) => {
    setDeleteConfirm({
      isOpen: true,
      newsletter
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.newsletter) return;

    try {
      setIsLoading(true);
      const response = await deleteNewsletter(deleteConfirm.newsletter.id);
      
      if (response.status === 200) {
        await fetchNewsletters();
        setDeleteConfirm({ isOpen: false, newsletter: null });
        setError(null);
      } else {
        setError('Failed to delete newsletter');
      }
    } catch (error) {
      setError('Error deleting newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, newsletter: null });
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      isPublic: true,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGoogleDrivePreviewUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.split('/d/')[1]?.split('/')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const toggleVisibility = () => {
    setFormData(prev => ({
      ...prev,
      isPublic: !prev.isPublic
    }));
  };

  if (isLoading && newsletters.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="ml-2 text-white">Loading newsletters...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.newsletter && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Delete Newsletter</h3>
              <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
              
              <p className="text-gray-300 text-lg mb-2">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.newsletter.title}</span>?
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Newsletter Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Manage your newsletter publications and PDF files</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-400 disabled:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 mx-auto sm:mx-0"
        >
          <Plus size={20} />
          Add Newsletter
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
            Processing...
          </div>
        </div>
      )}

      {/* Newsletters Grid */}
      <div className="space-y-6">
        {newsletters.length === 0 && !isLoading ? (
          <div className="text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Newsletters Yet</h3>
            <p className="text-gray-300 text-lg mb-6">Get started by creating your first newsletter</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 mx-auto"
            >
              <Plus size={20} />
              Create Your First Newsletter
            </button>
          </div>
        ) : (
          newsletters.map((newsletter) => (
            <div
              key={newsletter.id}
              className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Header Section */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  {/* Title and Metadata */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-cyan-500/10 rounded-lg mt-1">
                        <FileText className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{newsletter.title}</h3>
                        <p className="text-gray-300 text-lg mb-3">{newsletter.authors}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-400">
                            Published: {formatDate(newsletter.createdAt)}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            newsletter.isPublic 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                          }`}>
                            {newsletter.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {newsletter.fileUrl && (
                        <>
                          <button
                            onClick={() => toggleExpand(newsletter.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
                          >
                            {expandedId === newsletter.id ? (
                              <>
                                <ChevronUp size={16} />
                                Hide PDF
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                View PDF
                              </>
                            )}
                          </button>
                          <a
                            href={newsletter.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                          >
                            <ExternalLink size={16} />
                            Open PDF
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditClick(newsletter)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-cyan-500/20 disabled:bg-zinc-600 text-cyan-400 rounded-lg transition-all duration-300 hover:scale-110 border border-cyan-400/30"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(newsletter)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg transition-all duration-300 hover:scale-110 border border-red-400/30"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* PDF Viewer Section */}
              {expandedId === newsletter.id && newsletter.fileUrl && (
                <div className="border-t border-gray-700 bg-black/30">
                  <div className="p-4">
                    <iframe
                      src={getGoogleDrivePreviewUrl(newsletter.fileUrl)}
                      className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg border border-gray-600"
                      title={`PDF Viewer - ${newsletter.title}`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Newsletter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Add New Newsletter</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    placeholder="Enter newsletter title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Authors *</label>
                  <textarea
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 resize-none"
                    placeholder="Enter newsletter authors"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">PDF File *</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white hover:bg-zinc-700/50 transition-all duration-300 flex items-center justify-center gap-2">
                        <Upload size={18} />
                        {selectedFile ? selectedFile.name : 'Choose PDF File'}
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
                      formData.isPublic
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-zinc-800 text-gray-400 border border-gray-600'
                    } hover:scale-105`}
                  >
                    {formData.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                    {formData.isPublic ? 'Public' : 'Private'}
                  </button>
                  <p className="text-sm text-gray-400">
                    {formData.isPublic 
                      ? 'This newsletter will be visible to all users' 
                      : 'This newsletter will only be visible to admins'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                  setSelectedFile(null);
                }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={!formData.title.trim() || !formData.authors.trim() || !selectedFile || isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Check size={18} />
                {isLoading ? 'Adding...' : 'Add Newsletter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingNewsletter && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Edit Newsletter</h2>
              <button
                onClick={() => {
                  setEditingNewsletter(null);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    placeholder="Enter newsletter title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Authors *</label>
                  <textarea
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 resize-none"
                    placeholder="Enter newsletter authors"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Update PDF File (Optional)</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white hover:bg-zinc-700/50 transition-all duration-300 flex items-center justify-center gap-2">
                        <Upload size={18} />
                        {selectedFile ? selectedFile.name : 'Choose New PDF File'}
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Leave empty to keep current file
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
                      formData.isPublic
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-zinc-800 text-gray-400 border border-gray-600'
                    } hover:scale-105`}
                  >
                    {formData.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                    {formData.isPublic ? 'Public' : 'Private'}
                  </button>
                  <p className="text-sm text-gray-400">
                    {formData.isPublic 
                      ? 'This newsletter will be visible to all users' 
                      : 'This newsletter will only be visible to admins'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setEditingNewsletter(null);
                  setSelectedFile(null);
                }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={!formData.title.trim() || !formData.authors.trim() || isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Check size={18} />
                {isLoading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterSection;