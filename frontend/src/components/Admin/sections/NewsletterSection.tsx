import React, { useEffect, useState } from 'react';
import { FileText, ExternalLink, Edit2, Trash2, ChevronDown, ChevronUp, Plus, Upload } from 'lucide-react';
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
  const [deletingNewsletterId, setDeletingNewsletterId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    isPublic: true, // Default to public
  });

  // Fetch newsletters on component mount
  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await getAllNewsletters();
      if (response.status === 200) {
        console.log('Fetched newsletters:', response.data);
        // Transform the data to convert _id to id
        const transformedNewsletters = response.data.newsletters.map((newsletter: any) => ({
          id: newsletter._id, // Map _id to id
          title: newsletter.title,
          authors: newsletter.authors,
          createdAt: newsletter.createdAt,
          isPublic: newsletter.isPublic,
          fileUrl: newsletter.fileUrl,
        }));
        setNewsletters(transformedNewsletters);
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
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
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('authors', formData.authors || '');
      formDataToSend.append('isPublic', String(formData.isPublic));
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await updateNewsletter(editingNewsletter.id, formData);
      
      if (response.status === 200) {
        await fetchNewsletters(); // Refresh the list
        setEditingNewsletter(null);
        setSelectedFile(null);
        resetForm();
      } else {
        console.error('Update failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error updating newsletter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async () => {
    if (!formData.title.trim() || !formData.authors.trim() || !selectedFile) {
      alert('Please fill all required fields and select a file');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('authors', formData.authors);
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('isPublic', String(formData.isPublic));

      const response = await addNewsletter(formDataToSend);
      
      if (response.status === 201) {
        await fetchNewsletters(); // Refresh the list
        setShowAddModal(false);
        setSelectedFile(null);
        resetForm();
      } else {
        console.error('Add failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error adding newsletter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNewsletterId) return;

    try {
      setLoading(true);
      
      const response = await deleteNewsletter(deletingNewsletterId);
      
      if (response.status === 200) {
        await fetchNewsletters(); // Refresh the list
        setDeletingNewsletterId(null);
      } else {
        console.error('Delete failed with status:', response.status);
        console.error('Delete response data:', response.data);
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      if (error.response) {
        console.error('Error response:', error.response);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      isPublic: true, // Reset to public
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

  if (loading && newsletters.length === 0) {
    return <div className="text-white text-center py-8">Loading newsletters...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Newsletter Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Newsletter
        </button>
      </div>

      {/* Newsletters List */}
      <div className="space-y-4">
        {newsletters.map((newsletter) => (
          <div
            key={newsletter.id}
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-300"
          >
            {/* Header Section */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Title and Metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
                        {newsletter.title}
                      </h3>
                      <p className="text-zinc-400 mb-3">{newsletter.authors}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <span className="text-zinc-500">Published:</span>
                          <span className="text-zinc-300">{formatDate(newsletter.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {newsletter.fileUrl && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            toggleExpand(newsletter.id);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                        >
                          {expandedId === newsletter.id ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide PDF
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              View PDF
                            </>
                          )}
                        </button>
                        <a
                          href={newsletter.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open PDF
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit and Delete Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleEditClick(newsletter);
                    }}
                    className="p-2.5 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors duration-200 group"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      setDeletingNewsletterId(newsletter.id);
                    }}
                    className="p-2.5 bg-red-600/10 text-red-400 rounded-lg hover:bg-red-600/20 transition-colors duration-200 group"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    newsletter.isPublic
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}
                >
                  {newsletter.isPublic ? '🌐 Public' : '🔒 Private'}
                </span>
              </div>
            </div>

            {/* PDF Viewer Section - Only show for the expanded newsletter */}
            {expandedId === newsletter.id && newsletter.fileUrl && (
              <div className="border-t border-zinc-800 bg-black/30">
                <div className="p-4">
                  <iframe
                    src={getGoogleDrivePreviewUrl(newsletter.fileUrl)}
                    className="w-full h-[600px] rounded-lg border border-zinc-800"
                    title={`PDF Viewer - ${newsletter.title}`}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Newsletter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">Add New Newsletter</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter newsletter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Authors *
                </label>
                <textarea
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter newsletter authors"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  PDF File *
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 transition-colors duration-200 flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      {selectedFile ? selectedFile.name : 'Choose PDF File'}
                    </div>
                  </label>
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>

              {/* Public/Private Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Visibility *
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={formData.isPublic === true}
                      onChange={() => setFormData({ ...formData, isPublic: true })}
                      className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-zinc-300">Public</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={formData.isPublic === false}
                      onChange={() => setFormData({ ...formData, isPublic: false })}
                      className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-zinc-300">Private</span>
                    </div>
                  </label>
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  {formData.isPublic 
                    ? 'This newsletter will be visible to all users' 
                    : 'This newsletter will only be visible to admins'
                  }
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                  setSelectedFile(null);
                }}
                className="px-5 py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={!formData.title.trim() || !formData.authors.trim() || !selectedFile || loading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Newsletter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingNewsletter && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">Edit Newsletter</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter newsletter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Authors *
                </label>
                <textarea
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter newsletter authors"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Update PDF File (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 transition-colors duration-200 flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      {selectedFile ? selectedFile.name : 'Choose New PDF File'}
                    </div>
                  </label>
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  Leave empty to keep current file
                </p>
              </div>

              {/* Public/Private Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Visibility *
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={formData.isPublic === true}
                      onChange={() => setFormData({ ...formData, isPublic: true })}
                      className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-zinc-300">Public</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={formData.isPublic === false}
                      onChange={() => setFormData({ ...formData, isPublic: false })}
                      className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-zinc-300">Private</span>
                    </div>
                  </label>
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  {formData.isPublic 
                    ? 'This newsletter will be visible to all users' 
                    : 'This newsletter will only be visible to admins'
                  }
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingNewsletter(null);
                  setSelectedFile(null);
                }}
                className="px-5 py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={!formData.title.trim() || !formData.authors.trim() || loading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingNewsletterId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">Delete Newsletter</h2>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete this newsletter? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingNewsletterId(null)}
                  className="px-5 py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterSection;