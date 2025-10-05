import React, { useEffect, useState } from 'react';
import { FileText, ExternalLink, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface newsletter {
  id: string;
  title: string;
  authors?: string;
  newsletter?: string;
  createdAt: string;
  isPublic: boolean;
  fileUrl?: string;
}

const newsletterSection: React.FC<{ newslettersList: newsletter[] }> = ({ newslettersList }) => {
  const [newsletters, setnewsletters] = useState(newslettersList);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingnewsletter, setEditingnewsletter] = useState<newsletter | null>(null);
  const [deletingnewsletterId, setDeletingnewsletterId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    newsletter: '',
    isPublic: false,
    fileUrl: '',
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEditClick = (newsletter: newsletter) => {
    setEditingnewsletter(newsletter);
    setFormData({
      title: newsletter.title,
      authors: newsletter.authors || '',
      newsletter: newsletter.newsletter || '',
      isPublic: newsletter.isPublic,
      fileUrl: newsletter.fileUrl || '',
    });
  };

  const handleEditSubmit = () => {
    if (editingnewsletter) {
      setnewsletters(newsletters.map(newsletter => newsletter.id === editingnewsletter.id ? { ...editingnewsletter, ...formData } : newsletter));
      setEditingnewsletter(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingnewsletterId) {
      setnewsletters(newsletters.filter(newsletter => newsletter.id !== deletingnewsletterId));
      setDeletingnewsletterId(null);
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

  return (
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
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                      {newsletter.authors && (
                        <span className="flex items-center gap-1">
                          <span className="text-zinc-500">Authors:</span>
                          <span className="text-zinc-300">{newsletter.authors}</span>
                        </span>
                      )}
                      {newsletter.newsletter && (
                        <span className="flex items-center gap-1">
                          <span className="text-zinc-500">newsletter:</span>
                          <span className="text-zinc-300">{newsletter.newsletter}</span>
                        </span>
                      )}
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
                        onClick={() => toggleExpand(newsletter.id)}
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
                  onClick={() => handleEditClick(newsletter)}
                  className="p-2.5 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors duration-200 group"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => setDeletingnewsletterId(newsletter.id)}
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

          {/* PDF Viewer Section */}
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

      {/* Edit Modal */}
      {editingnewsletter && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">Edit newsletter</h2>
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
                  newsletter Name
                </label>
                <input
                  type="text"
                  value={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter newsletter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  newsletter URL
                </label>
                <input
                  type="text"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter newsletter name"
                />
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
                  Make this newsletter public
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setEditingnewsletter(null)}
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
      {deletingnewsletterId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">Delete newsletter</h2>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete this newsletter? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingnewsletterId(null)}
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

export default newsletterSection;
