import { useState, useEffect } from 'react';
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
          "textContent": "Artificial intelligence is poised to revolutionize multiple industries, from healthcare to autonomous driving. In this article, we explore the current state of AI and its future potential. We’ll look at the breakthroughs in deep learning, neural networks, and reinforcement learning that are driving AI forward. Along the way, we will also discuss the ethical considerations and risks involved in this rapidly evolving technology.          Artificial intelligence is poised to revolutionize multiple industries, from healthcare to autonomous driving. In this article, we explore the current state of AI and its future potential. We’ll look at the breakthroughs in deep learning, neural networks, and reinforcement learning that are driving AI forward. Along the way, we will also discuss the ethical considerations and risks involved in this rapidly evolving technology. Artificial intelligence is poised to revolutionize multiple industries, from healthcare to autonomous driving. In this article, we explore the current state of AI and its future potential. We’ll look at the breakthroughs in deep learning, neural networks, and reinforcement learning that are driving AI forward. Along the way, we will also discuss the ethical considerations and risks involved in this rapidly evolving technology. Artificial intelligence is poised to revolutionize multiple industries, from healthcare to autonomous driving. In this article, we explore the current state of AI and its future potential. We’ll look at the breakthroughs in deep learning, neural networks, and reinforcement learning that are driving AI forward. Along the way, we will also discuss the ethical considerations and risks involved in this rapidly evolving technology",
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
    
  
  


const App = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [activeSection, setActiveSection] = useState<'article' | 'podcast' | 'newsletter' | 'journal'>('article');

  useEffect(() => {
    const savedPublications = localStorage.getItem('publications');
    if (savedPublications) {
      setPublications(JSON.parse(savedPublications));
    }
  }, []);

//   const handleEditPublication = (publication: Publication) => {
//     // Implement edit functionality
//   };

//   const handleDeletePublication = (publicationId: string) => {
//     if (window.confirm('Are you sure you want to delete this publication?')) {
//       setPublications(publications.filter(pub => pub.id !== publicationId));
//     }
//   };

  const handleSectionChange = (section: 'article' | 'podcast' | 'newsletter' | 'journal') => {
    setActiveSection(section);
  };

  return (
    <div>
      {/* Section Navigation Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleSectionChange('article')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${activeSection === 'article' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
        >
          Articles
        </button>
        <button
          onClick={() => handleSectionChange('podcast')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${activeSection === 'podcast' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
        >
          Podcasts
        </button>
        <button
          onClick={() => handleSectionChange('newsletter')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${activeSection === 'newsletter' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
        >
          Newsletters
        </button>
        <button
          onClick={() => handleSectionChange('journal')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${activeSection === 'journal' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
        >
          Journals
        </button>
      </div>

      {/* Section Content */}
      {activeSection === 'article' && (
        <ArticleSection
          articlesList={articles}
        />
      )}
      {activeSection === 'podcast' && (
        <PodcastManagement
          
        />
      )}
      {activeSection === 'newsletter' && (
        <NewsletterSection
          publications={publications}
        />
      )}
      {activeSection === 'journal' && (
        <JournalSection
          journalsList={journals}
        />
      )}
    </div>
  );
};

export default App;