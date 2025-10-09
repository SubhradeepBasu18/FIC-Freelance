// JournalSection.tsx (Updated)
import React, { useEffect, useState } from 'react';
import { FileText, ExternalLink, Edit2, Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { getAllJournals, addJournal, updateJournal, deleteJournal } from '@/configApi/publications.admin';

interface Journal {
  id: string;
  title: string;
  authors?: string;
  journal?: string;
  isPublic: boolean;
  fileUrl?: string;
  createdAt: string;
  file?: File;
}

const JournalSection: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [deletingJournalId, setDeletingJournalId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    isPublic: false,
    file: null as File | null,
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    file: '',
  });

  // Fetch journals on component mount
  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const response = await getAllJournals();
      if (response.status === 200) {
        // console.log("Response: ", response.data);
        
        const transformedJournals = response.data.journals.map((journal: Journal) => ({
            id: journal._id, // Map _id to id
            title: journal.title,
            authors: journal.authors,
            createdAt: journal.createdAt,
            isPublic: journal.isPublic,
            fileUrl: journal.fileUrl,
          }));

        setJournals(transformedJournals);
      } else {
        console.error('Failed to fetch journals:', response.data);
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoading(false);
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
      file: null,
    });
    setFormErrors({ title: '', file: '' });
  };

  const handleAddClick = () => {
    setShowAddModal(true);
    setFormData({
      title: '',
      authors: '',
      journal: '',
      isPublic: false,
      file: null,
    });
    setFormErrors({ title: '', file: '' });
  };

  const validateForm = (isEdit: boolean = false) => {
    const errors = { title: '', file: '' };
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!isEdit && !formData.file) {
      errors.file = 'PDF file is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleEditSubmit = async () => {
    if (!editingJournal || !validateForm(true)) return;

    try {
      const journalData = new FormData();
      journalData.append('title', formData.title);
      journalData.append('authors', formData.authors);
      journalData.append('journal', formData.journal);
      journalData.append('isPublic', String(formData.isPublic));
      
      if (formData.file) {
        journalData.append('file', formData.file);
      }

    //   console.log("Journal Data: ", formData);
      

      const response = await updateJournal(editingJournal.id, formData);
      
      if (response.status === 200) {
        await fetchJournals(); // Refresh the list
        setEditingJournal(null);
      } else {
        console.error('Failed to update journal:', response.data);
        alert('Failed to update journal. Please try again.');
      }
    } catch (error) {
      console.error('Error updating journal:', error);
      alert('Error updating journal. Please try again.');
    }
  };

  const handleAddSubmit = async () => {
    if (!validateForm()) return;

    try {
      const journalData = new FormData();
      journalData.append('title', formData.title);
      journalData.append('authors', formData.authors);
      journalData.append('journal', formData.journal);
      journalData.append('isPublic', String(formData.isPublic));
      
      if (formData.file) {
        journalData.append('file', formData.file);
      }
    //   console.log('Journal Data:  ', formData);
      

      const response = await addJournal(formData);
      
      if (response.status === 201 || response.status === 200) {
        await fetchJournals(); // Refresh the list
        setShowAddModal(false);
        alert('Journal added successfully!');
      } else {
        console.error('Failed to add journal:', response.data);
        alert('Failed to add journal. Please try again.');
      }
    } catch (error) {
      console.error('Error adding journal:', error);
      alert('Error adding journal. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingJournalId) return;

    try {
      const response = await deleteJournal(deletingJournalId);
      
      if (response.status === 200) {
        await fetchJournals(); // Refresh the list
        setDeletingJournalId(null);
        alert('Journal deleted successfully!');
      } else {
        console.error('Failed to delete journal:', response.data);
        alert('Failed to delete journal. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert('Error deleting journal. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setFormErrors({ ...formErrors, file: 'Please select a PDF file' });
        return;
      }
      setFormData({ ...formData, file });
      setFormErrors({ ...formErrors, file: '' });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Research Journals</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Journal
        </button>
      </div>

      {/* Journals List */}
      <div className="space-y-4">
        {journals.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            No journals found. Add your first journal to get started.
          </div>
        ) : (
          journals.map((journal) => (
            <div
              key={journal.id}
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
                          {journal.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                          {journal.authors && (
                            <span className="flex items-center gap-1">
                              <span className="text-zinc-500">Authors:</span>
                              <span className="text-zinc-300">{journal.authors}</span>
                            </span>
                          )}
                          {journal.journal && (
                            <span className="flex items-center gap-1">
                              <span className="text-zinc-500">Journal:</span>
                              <span className="text-zinc-300">{journal.journal}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="text-zinc-500">Published:</span>
                            <span className="text-zinc-300">{formatDate(journal.createdAt)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {journal.fileUrl && (
                        <>
                          <button
                            onClick={() => toggleExpand(journal.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                          >
                            {expandedId === journal.id ? (
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
                            href={journal.fileUrl}
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
                      onClick={() => handleEditClick(journal)}
                      className="p-2.5 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors duration-200 group"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => setDeletingJournalId(journal.id)}
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
                      journal.isPublic
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}
                  >
                    {journal.isPublic ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>
              </div>

              {/* PDF Viewer Section */}
              {expandedId === journal.id && journal.fileUrl && (
                <div className="border-t border-zinc-800 bg-black/30">
                  <div className="p-4">
                    <iframe
                      src={getGoogleDrivePreviewUrl(journal.fileUrl)}
                      className="w-full h-[600px] rounded-lg border border-zinc-800"
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
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">Add New Journal</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setFormErrors({ ...formErrors, title: '' });
                  }}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter journal title"
                />
                {formErrors.title && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Authors
                </label>
                <input
                  type="text"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter authors (e.g., John Doe, Jane Smith)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Journal Name
                </label>
                <input
                  type="text"
                  value={formData.journal}
                  onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter journal name"
                />
              </div>

              <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
                PDF File *
            </label>
            
            {/* Custom File Input Container */}
            <div className="relative">
                <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="file-upload-add"
                />
                <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="flex-1">
                    {formData.file ? formData.file.name : 'Choose PDF file'}
                </span>
                <button
                    type="button"
                    className="px-3 py-1.5 bg-zinc-700 text-white rounded-md text-sm hover:bg-zinc-600 transition-colors duration-200"
                >
                    Browse
                </button>
                </div>
            </div>
            
            {formErrors.file && (
                <p className="text-red-400 text-sm mt-1">{formErrors.file}</p>
            )}
            <p className="text-zinc-400 text-sm mt-1">Only PDF files are accepted</p>
            </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-5 h-5 bg-zinc-800 border-zinc-700 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-zinc-300 cursor-pointer">
                  Make this journal public
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Journal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingJournal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">Edit Journal</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setFormErrors({ ...formErrors, title: '' });
                  }}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter journal title"
                />
                {formErrors.title && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Authors
                </label>
                <input
                  type="text"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter authors (e.g., John Doe, Jane Smith)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Journal Name
                </label>
                <input
                  type="text"
                  value={formData.journal}
                  onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter journal name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    PDF File (Leave empty to keep current file)
                </label>
                
                {/* Custom File Input Container */}
                <div className="relative">
                    <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="file-upload-edit"
                    />
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="flex-1">
                        {formData.file 
                        ? formData.file.name 
                        : editingJournal?.fileUrl 
                            ? 'Current file: ' + editingJournal.fileUrl.split('/').pop()
                            : 'Choose new PDF file (optional)'}
                    </span>
                    <button
                        type="button"
                        className="px-3 py-1.5 bg-zinc-700 text-white rounded-md text-sm hover:bg-zinc-600 transition-colors duration-200"
                    >
                        Browse
                    </button>
                    </div>
                </div>
  
  {formErrors.file && (
    <p className="text-red-400 text-sm mt-1">{formErrors.file}</p>
  )}
  <p className="text-zinc-400 text-sm mt-1">Only PDF files are accepted</p>
</div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="editIsPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-5 h-5 bg-zinc-800 border-zinc-700 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="editIsPublic" className="text-sm font-medium text-zinc-300 cursor-pointer">
                  Make this journal public
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setEditingJournal(null)}
                className="px-5 py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={!formData.title.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingJournalId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">Delete Journal</h2>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete this journal? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingJournalId(null)}
                  className="px-5 py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalSection;