import { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import Team from "../components/Admin/Team"
import Events from "../components/Admin/Events"
import Publications from "../components/Admin/Publications"
import Access from "../components/Admin/Access";
import GallerySection from '@/components/Admin/sections/GallerySection';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getCurrentSession, logoutAdmin } from "../configApi/admin";

export default function AdminDashboard() {
    const [currentSession, setCurrentSession] = useState({});
      
  const [activeTab, setActiveTab] = useState('team');
  const [showLogout, setShowLogout] = useState(false);  // State to toggle logout button visibility
  const navigate = useNavigate();

  const tabs = [
    { id: 'team', label: 'Team' },
    { id: 'events', label: 'Events' },
    { id: 'publications', label: 'Publications' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Details' },
    { id: 'access', label: 'Access' }
  ];

  useEffect(() => {
    const fetchCurrentSession = async () => {
      const { status, data } = await getCurrentSession();
      if (status === 200) {
        setCurrentSession(data);
        // console.log("currentSession: ", data);
      }
    }
    fetchCurrentSession();
  }, [])

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    const { status } = await logoutAdmin();
    if (status === 200) {
      navigate('/signin ');
    }
  };

  const toggleLogoutButton = () => {
    setShowLogout(!showLogout); // Toggle visibility of logout button
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 relative">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-gray-800 px-8 py-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold italic text-white">Admin Dashboard</h1>
          
          
          
          {/* Back to Home Button */}
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
        <nav className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap items-center">
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
          </div>
          {/* Avatar & Logout Button */} 
          <div className="relative"> 
            <Avatar onClick={toggleLogoutButton} className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center bg-zinc-700 text-white font-semibold"> 
                {/* Placeholder Avatar */} 
                <AvatarFallback>{currentSession?.email?.charAt(0).toUpperCase() || "JD"}</AvatarFallback> 
                {/* Use initials as fallback */} 
                </Avatar> 
                {showLogout && ( 
                    <button 
                      onClick={handleLogout} 
                      className="absolute top-14 right-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg border border-red-500 transition-all duration-200 font-medium z-10 flex items-center gap-2" 
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout 
                    </button> 
                )}
          </div>
        </nav>
      </div>

      {/* Content Area */}
      <div className="px-8 py-8">
        {activeTab === 'team' && <Team />}  
        {activeTab === 'events' && <Events />} 
        {activeTab === 'publications' && <Publications />} 
        {activeTab === 'access' && <Access />}
        {activeTab === 'gallery' && <GallerySection />}
        {activeTab !== 'team' && activeTab !== 'events' && activeTab !== 'publications' && activeTab !== 'access' && activeTab !== 'gallery' && (
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
