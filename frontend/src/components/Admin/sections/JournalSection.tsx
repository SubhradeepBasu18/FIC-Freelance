import React from 'react';

interface Journal {
    id: string;
    title: string;
    authors?: string;
    journal?: string;
    createdAt: string;
    isPublic: boolean;
    fileUrl?: string;
  }
  

interface JournalSectionProps {
  journals: Journal[];
  onEdit: (journal: Journal) => void;
  onDelete: (journalId: string) => void;
}

const JournalSection: React.FC<JournalSectionProps> = ({ journals, onEdit, onDelete }) => {
  
  return (
    <div className="space-y-4">
      {journals.map((journal) => (
        <div key={journal.id} className="bg-zinc-900 rounded-xl border border-gray-800 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{journal.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(journal)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(journal.id)}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          <a href={journal.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Download PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default JournalSection;
