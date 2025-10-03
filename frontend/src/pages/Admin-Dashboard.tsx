import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Team from "../components/Admin/Team"
import Events from "../components/Admin/Events"
import Publications from "../components/Admin/Publications"
import JournalSection from "../components/Admin/sections/JournalSection";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('team');
  const navigate = useNavigate();

  const tabs = [
    { id: 'team', label: 'Team' },
    { id: 'events', label: 'Events' },
    { id: 'publications', label: 'Publications' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Details' },
    { id: 'access', label: 'Access' }
  ];

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 relative">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-gray-800 px-8 py-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold italic text-white">Admin Dashboard</h1>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors border border-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-zinc-800 text-gray-400 hover:bg-gray-750 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="px-8 py-8">
        {activeTab === 'team' && <Team />}  
        {activeTab === 'events' && <Events />} 
        {activeTab === 'publications' && <Publications />} 
                {activeTab !== 'team' && activeTab !== 'events' && activeTab !== 'publications' && (
          <div className="text-center py-16 bg-zinc-900 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-2">
              {tabs.find(t => t.id === activeTab)?.label} Section
            </h3>
            <p className="text-gray-400">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}