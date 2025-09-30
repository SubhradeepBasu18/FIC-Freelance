// AdminDashboard.js
import React, { useState } from 'react';
import Team from "./Team"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('team');

  const tabs = [
    { id: 'team', label: 'Team' },
    { id: 'events', label: 'Events' },
    { id: 'publications', label: 'Publications' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Details' },
    { id: 'access', label: 'Access' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative pt-15">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <nav className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="px-8 py-8">
        {activeTab === 'team' && <Team />}  {/* Conditionally render Team component */}

        {activeTab !== 'team' && (
          <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
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
