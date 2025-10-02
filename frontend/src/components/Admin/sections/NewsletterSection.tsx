import React from 'react';

interface Publication {
    id: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi?: string;
    abstract: string;
    pdfUrl?: string;
    spotifyLink?: string;
    tags: string[];
    isFeatured: boolean;
    createdAt: string;
    type: 'article' | 'podcast' | 'newsletter' | 'journal';
  }
  

interface NewsletterSectionProps {
  publications: Publication[];
  onEdit: (publication: Publication) => void;
  onDelete: (publicationId: string) => void;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ publications, onEdit, onDelete }) => {
  const newsletters = publications.filter(pub => pub.type === 'newsletter');
  
  return (
    <div className="space-y-4">
      {newsletters.map((publication) => (
        <div key={publication.id} className="bg-zinc-900 rounded-xl border border-gray-800 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{publication.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(publication)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(publication.id)}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Download PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsletterSection;
