import React, { useState, useEffect } from 'react';
import type { Publication, PublicationFormData } from '../../types/publication';

interface PublicationFormProps {
  publication?: Publication;
  onSave: (data: Publication) => void;
  onCancel: () => void;
  isEditing: boolean;
}

// Publication form component for adding/editing publications
export const PublicationForm: React.FC<PublicationFormProps> = ({
  publication,
  onSave,
  onCancel,
  isEditing
}) => {
  const [formData, setFormData] = useState<PublicationFormData>({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    abstract: '',
    pdfUrl: '',
    tags: '',
    isFeatured: false
  });

  useEffect(() => {
    if (publication && isEditing) {
      setFormData({
        ...publication,
        tags: publication.tags.join(', ')
      });
    }
  }, [publication, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const publicationData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      year: Number(formData.year)
    };
    onSave(publicationData as Publication);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isEditing ? 'Edit Publication' : 'Add New Publication'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Publication Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Enter publication title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Authors *
            </label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="e.g., John Doe, Jane Smith, et al."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Journal/Conference *
              </label>
              <input
                type="text"
                name="journal"
                value={formData.journal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="Journal name or conference"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 5}
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              DOI (Digital Object Identifier)
            </label>
            <input
              type="text"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="10.1234/example.doi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Abstract *
            </label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Enter publication abstract"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              PDF URL
            </label>
            <input
              type="url"
              name="pdfUrl"
              value={formData.pdfUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/publication.pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="machine learning, AI, data science (comma separated)"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-zinc-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-300">
              Feature this publication
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-300 bg-zinc-800 border border-gray-700 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Update Publication' : 'Create Publication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Publication interface
export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
  pdfUrl?: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}

// Publication form data interface
export interface PublicationFormData {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  pdfUrl: string;
  tags: string;
  isFeatured: boolean;
}

// Main Publications component
export default function Publications() {
  const [publications, setPublications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('all');

  // Load publications from localStorage on component mount
  useEffect(() => {
    const savedPublications = localStorage.getItem('admin-publications');
    if (savedPublications) {
      setPublications(JSON.parse(savedPublications));
    } else {
      // Initialize with mock data
      const mockPublications = [
        {
          id: '1',
          title: 'Advanced Machine Learning Techniques for Predictive Analysis',
          authors: 'John Doe, Jane Smith, Robert Johnson',
          journal: 'Journal of Artificial Intelligence Research',
          year: 2024,
          doi: '10.1234/jair.2024.001',
          abstract: 'This paper explores advanced machine learning techniques and their applications in predictive analysis across various domains including healthcare, finance, and climate science.',
          pdfUrl: 'https://example.com/papers/ml-techniques.pdf',
          tags: ['machine learning', 'predictive analysis', 'AI'],
          isFeatured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Neural Networks in Computer Vision: A Comprehensive Survey',
          authors: 'Alice Brown, Michael Chen',
          journal: 'IEEE Conference on Computer Vision',
          year: 2023,
          doi: '10.1109/cvpr.2023.456',
          abstract: 'A comprehensive survey of neural network architectures and their applications in computer vision tasks, including object detection, segmentation, and image generation.',
          pdfUrl: '',
          tags: ['neural networks', 'computer vision', 'deep learning'],
          isFeatured: false,
          createdAt: new Date().toISOString()
        }
      ];
      setPublications(mockPublications);
    }
  }, []);

  // Save publications to localStorage whenever publications change
  useEffect(() => {
    localStorage.setItem('admin-publications', JSON.stringify(publications));
  }, [publications]);

  const handleAddPublication = () => {
    setEditingPublication(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditPublication = (publication) => {
    setEditingPublication(publication);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeletePublication = (publicationId) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      setPublications(publications.filter(pub => pub.id !== publicationId));
    }
  };

  const handleSavePublication = (publicationData) => {
    if (isEditing && editingPublication) {
      // Update existing publication
      setPublications(publications.map(pub => 
        pub.id === editingPublication.id 
          ? { ...publicationData, id: editingPublication.id }
          : pub
      ));
    } else {
      // Add new publication
      const newPublication = {
        ...publicationData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setPublications([...publications, newPublication]);
    }
    
    setShowForm(false);
    setEditingPublication(null);
    setIsEditing(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPublication(null);
    setIsEditing(false);
  };

  const filteredPublications = publications.filter(pub => {
    if (filter === 'featured') return pub.isFeatured;
    if (filter === 'recent') return pub.year >= new Date().getFullYear() - 1;
    return true;
  });

  const getCitation = (pub) => {
    return `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}.${pub.doi ? ` DOI: ${pub.doi}` : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Publications Management</h2>
          <p className="text-gray-400">Manage research publications and papers</p>
        </div>
        <button
          onClick={handleAddPublication}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Publication
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
          }`}
        >
          All Publications
        </button>
        <button
          onClick={() => setFilter('featured')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'featured'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
          }`}
        >
          Featured
        </button>
        <button
          onClick={() => setFilter('recent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'recent'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
          }`}
        >
          Recent (Last 2 Years)
        </button>
      </div>

      {/* Publications List */}
      {filteredPublications.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 rounded-xl border border-gray-800">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No Publications Found</h3>
          <p className="text-gray-400 mb-4">
            {publications.length === 0 
              ? "Get started by adding your first publication" 
              : "No publications match the current filter"}
          </p>
          {publications.length === 0 && (
            <button
              onClick={handleAddPublication}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Publication
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPublications.map((publication) => (
            <div
              key={publication.id}
              className="bg-zinc-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {publication.title}
                    </h3>
                    {publication.isFeatured && (
                      <span className="inline-block px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-blue-400 text-sm mb-2">
                    {publication.authors}
                  </p>
                  
                  <p className="text-gray-400 text-sm mb-2">
                    <span className="font-medium">{publication.journal}</span>
                    {publication.year && `, ${publication.year}`}
                    {publication.doi && ` • DOI: ${publication.doi}`}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {publication.abstract}
              </p>

              {publication.tags && publication.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {publication.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3 justify-between items-center">
                <div className="flex gap-2">
                  {publication.pdfUrl && (
                    <a
                      href={publication.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </a>
                  )}
                  <button
                    onClick={() => navigator.clipboard.writeText(getCitation(publication))}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                    title="Copy citation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Citation
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPublication(publication)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePublication(publication.id)}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publication Form Modal */}
      {showForm && (
        <PublicationForm
          publication={editingPublication}
          onSave={handleSavePublication}
          onCancel={handleCancelForm}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}

