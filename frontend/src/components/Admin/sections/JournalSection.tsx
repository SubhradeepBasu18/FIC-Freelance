import React, { useEffect, useState } from 'react';
import { FileText, ExternalLink, Edit2, Trash2, ChevronDown, ChevronUp, Plus, Upload, X, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { getAllJournals, addJournal, updateJournal, deleteJournal } from '@/configApi/publications.admin';

interface Journal {
  id: string;
  title: string;
  authors?: string;
  journal?: string;
  isPublic: boolean;
  fileUrl?: string;
  createdAt: string;
}

const JournalSection: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; journal: Journal | null }>({
    isOpen: false,
    journal: null
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    isPublic: true,
  });

  // Fetch journals on component mount
  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setIsLoading(true);
      const response = await getAllJournals();
      if (response.status === 200) {
        const transformedJournals = response.data.journals.map((journal: any) => ({
          id: journal._id,
          title: journal.title,
          authors: journal.authors,
          journal: journal.journal,
          createdAt: journal.createdAt,
          isPublic: journal.isPublic,
          fileUrl: journal.fileUrl,
        }));
        setJournals(transformedJournals);
        setError(null);
      } else {
        setError('Failed to fetch journals');
      }
    } catch (error) {
      setError('Error fetching journals');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEditClick = (journal: Journal) => {
    setEditingJournal(journal);
    setFormData({
      title: journal.title,
      authors: journal.authors || '',
      journal: journal.journal || '',
      isPublic: journal.isPublic,
    });
    setSelectedFile(null);
  };

  const handleEditSubmit = async () => {
    if (!editingJournal) return;

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('authors', formData.authors || '');
      formDataToSend.append('journal', formData.journal || '');
      formDataToSend.append('isPublic', String(formData.isPublic));
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await updateJournal(editingJournal.id, formData);
      
      if (response.status === 200) {
        await fetchJournals();
        setEditingJournal(null);
        setSelectedFile(null);
        resetForm();
        setError(null);
      } else {
        setError('Failed to update journal');
      }
    } catch (error) {
      setError('Error updating journal');
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
      formDataToSend.append('journal', formData.journal);
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('isPublic', String(formData.isPublic));

      const response = await addJournal(formDataToSend);
      
      if (response.status === 201 || response.status === 200) {
        await fetchJournals();
        setShowAddModal(false);
        setSelectedFile(null);
        resetForm();
        setError(null);
      } else {
        setError('Failed to add journal');
      }
    } catch (error) {
      setError('Error adding journal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (journal: Journal) => {
    setDeleteConfirm({
      isOpen: true,
      journal
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.journal) return;

    try {
      setIsLoading(true);
      const response = await deleteJournal(deleteConfirm.journal.id);
      
      if (response.status === 200) {
        await fetchJournals();
        setDeleteConfirm({ isOpen: false, journal: null });
        setError(null);
      } else {
        setError('Failed to delete journal');
      }
    } catch (error) {
      setError('Error deleting journal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, journal: null });
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      journal: '',
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

  if (isLoading && journals.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-2 text-white">Loading journals...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.journal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Delete Journal</h3>
              <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
              
              <p className="text-gray-300 text-lg mb-2">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.journal.title}</span>?
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Research Journal Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Manage your research journal publications and PDF files</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 mx-auto sm:mx-0"
        >
          <Plus size={20} />
          Add Journal
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
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            Processing...
          </div>
        </div>
      )}

      {/* Journals Grid */}
      <div className="space-y-6">
        {journals.length === 0 && !isLoading ? (
          <div className="text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-blue-400/20">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Journals Yet</h3>
            <p className="text-gray-300 text-lg mb-6">Get started by creating your first research journal</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 mx-auto"
            >
              <Plus size={20} />
              Create Your First Journal
            </button>
          </div>
        ) : (
          journals.map((journal) => (
            <div
              key={journal.id}
              className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Header Section */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  {/* Title and Metadata */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg mt-1">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{journal.title}</h3>
                        <div className="space-y-2 mb-3">
                          {journal.authors && (
                            <p className="text-gray-300 text-lg">{journal.authors}</p>
                          )}
                          {journal.journal && (
                            <p className="text-blue-300 text-md">Published in: {journal.journal}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-400">
                            Published: {formatDate(journal.createdAt)}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            journal.isPublic 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                          }`}>
                            {journal.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {journal.fileUrl && (
                        <>
                          <button
                            onClick={() => toggleExpand(journal.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
                          >
                            {expandedId === journal.id ? (
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
                            href={journal.fileUrl}
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
                      onClick={() => handleEditClick(journal)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-blue-500/20 disabled:bg-zinc-600 text-blue-400 rounded-lg transition-all duration-300 hover:scale-110 border border-blue-400/30"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(journal)}
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
              {expandedId === journal.id && journal.fileUrl && (
                <div className="border-t border-gray-700 bg-black/30">
                  <div className="p-4">
                    <iframe
                      src={getGoogleDrivePreviewUrl(journal.fileUrl)}
                      className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg border border-gray-600"
                      title={`PDF Viewer - ${journal.title}`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-blue-400/20 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Add New Research Journal</h2>
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
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                    placeholder="Enter journal title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Authors *</label>
                  <textarea
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 resize-none"
                    placeholder="Enter journal authors"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Journal Name</label>
                  <input
                    type="text"
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                    placeholder="Enter journal name"
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
                      ? 'This journal will be visible to all users' 
                      : 'This journal will only be visible to admins'
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
                {isLoading ? 'Adding...' : 'Add Journal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingJournal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-blue-400/20 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Edit Research Journal</h2>
              <button
                onClick={() => {
                  setEditingJournal(null);
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
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                    placeholder="Enter journal title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Authors *</label>
                  <textarea
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 resize-none"
                    placeholder="Enter journal authors"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Journal Name</label>
                  <input
                    type="text"
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                    placeholder="Enter journal name"
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
                      ? 'This journal will be visible to all users' 
                      : 'This journal will only be visible to admins'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setEditingJournal(null);
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

export default JournalSection;