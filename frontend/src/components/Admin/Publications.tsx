import { useState, useEffect } from 'react';
import { FileText, Podcast, Mail, BookOpen } from 'lucide-react';
import ArticleSection from './sections/ArticleSection';
import PodcastManagement from './sections/PodcastSection';
import NewsletterSection from './sections/NewsletterSection';
import JournalSection from './sections/JournalSection';

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
  isPublic: boolean;
  createdAt: string;
  type: 'article' | 'podcast' | 'newsletter' | 'journal';
}

interface Article {
  id: string;
  title: string;
  textContent?: string;
  authors?: string;
  journal?: string;
  createdAt: string;
  isPublic: boolean;
}

interface Journal {
  id: string;
  title: string;
  authors?: string;
  journal?: string;
  createdAt: string;
  isPublic: boolean;
  fileUrl?: string;
}

const articles = [
  {
    "id": "1",
    "title": "Exploring the Future of AI",
    "textContent": "Artificial intelligence is poised to revolutionize multiple industries, from healthcare to autonomous driving. In this article, we explore the current state of AI and its future potential. We'll look at the breakthroughs in deep learning, neural networks, and reinforcement learning that are driving AI forward. Along the way, we will also discuss the ethical considerations and risks involved in this rapidly evolving technology.",
    "createdAt": "2025-09-15T08:30:00Z",
    "authors": "John Doe",
    "isPublic": true
  },
  {
    "id": "2",
    "title": "The Rise of Quantum Computing",
    "textContent": "How quantum computing is changing the landscape of computing power and its potential impact on cryptography.",
    "createdAt": "2025-09-18T12:45:00Z",
    "authors": "John Doe",
    "isPublic": true
  },
  {
    "id": "3",
    "title": "Blockchain: Beyond Cryptocurrency",
    "textContent": "Understanding how blockchain technology is being applied beyond Bitcoin and Ethereum.",
    "createdAt": "2025-09-22T16:10:00Z",
    "authors": "John Doe",
    "isPublic": true
  },
  {
    "id": "4",
    "title": "The Ethics of Artificial Intelligence",
    "textContent": "Exploring the ethical dilemmas associated with the rise of AI and automation.",
    "createdAt": "2025-09-25T09:00:00Z",
    "authors": "John Doe",
    "isPublic": true
  }
]

const journals = [
  {
    "id": "1",
    "title": "Artificial Intelligence in Healthcare",
    "authors": "John Doe, Jane Smith",
    "fileUrl": "https://res.cloudinary.com/dxafl3nuk/image/upload/v1759500152/Department_of_Information_Technology_cy_nw2d32.pdf",
    "isPublic": true,
    "createdAt": "2025-10-01T14:00:00Z",
    "updatedAt": "2025-10-01T14:00:00Z"
  },
  {
    "id": "2",
    "title": "Blockchain Technology: A Revolution",
    "authors": "Alice Brown, Bob White",
    "fileUrl": "https://example.com/journals/blockchain-tech.pdf",
    "isPublic": false,
    "createdAt": "2025-09-15T09:30:00Z",
    "updatedAt": "2025-09-15T09:30:00Z"
  },
  {
    "id": "3",
    "title": "Machine Learning Algorithms for Data Science",
    "authors": "Sara Green, Mark Black",
    "fileUrl": "https://example.com/journals/ml-algorithms.pdf",
    "isPublic": true,
    "createdAt": "2025-08-20T11:45:00Z",
    "updatedAt": "2025-08-20T11:45:00Z"
  }
]

const newsletters = [
  {
    "id": "1",
    "title": "Artificial Intelligence in Healthcare",
    "authors": "John Doe, Jane Smith",
    "fileUrl": "https://res.cloudinary.com/dxafl3nuk/image/upload/v1759500152/Department_of_Information_Technology_cy_nw2d32.pdf",
    "isPublic": true,
    "createdAt": "2025-10-01T14:00:00Z",
    "updatedAt": "2025-10-01T14:00:00Z"
  },
  {
    "id": "2",
    "title": "Blockchain Technology: A Revolution",
    "authors": "Alice Brown, Bob White",
    "fileUrl": "https://example.com/journals/blockchain-tech.pdf",
    "isPublic": false,
    "createdAt": "2025-09-15T09:30:00Z",
    "updatedAt": "2025-09-15T09:30:00Z"
  },
  {
    "id": "3",
    "title": "Machine Learning Algorithms for Data Science",
    "authors": "Sara Green, Mark Black",
    "fileUrl": "https://example.com/journals/ml-algorithms.pdf",
    "isPublic": true,
    "createdAt": "2025-08-20T11:45:00Z",
    "updatedAt": "2025-08-20T11:45:00Z"
  }
]

const App = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [activeSection, setActiveSection] = useState<'article' | 'podcast' | 'newsletter' | 'journal'>('article');

  useEffect(() => {
    const savedPublications = localStorage.getItem('publications');
    if (savedPublications) {
      setPublications(JSON.parse(savedPublications));
    }
  }, []);

  const handleSectionChange = (section: 'article' | 'podcast' | 'newsletter' | 'journal') => {
    setActiveSection(section);
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'article': return <FileText size={18} />;
      case 'podcast': return <Podcast size={18} />;
      case 'newsletter': return <Mail size={18} />;
      case 'journal': return <BookOpen size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const sections = [
    { id: 'article' as const, label: 'Articles', icon: <FileText size={18} /> },
    { id: 'podcast' as const, label: 'Podcasts', icon: <Podcast size={18} /> },
    { id: 'newsletter' as const, label: 'Newsletters', icon: <Mail size={18} /> },
    { id: 'journal' as const, label: 'Journals', icon: <BookOpen size={18} /> }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Publications Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Manage your articles, podcasts, newsletters, and journals</p>
        </div>
      </div>

      {/* Section Navigation Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white border border-gray-700'
            } hover:scale-105`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20 p-6 transform transition-all duration-300">
        {activeSection === 'article' && (
          <ArticleSection articlesList={articles} />
        )}
        {activeSection === 'podcast' && (
          <PodcastManagement />
        )}
        {activeSection === 'newsletter' && (
          <NewsletterSection newslettersList={newsletters} />
        )}
        {activeSection === 'journal' && (
          <JournalSection journalsList={journals} />
        )}
      </div>
      
    </div>
  );
};

export default App;