import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Team from "../components/Admin/Team"
import Events from "../components/Admin/Events"
import Publications from "../components/Admin/Publications"
import Access from "../components/Admin/Access";
import GallerySection from '@/components/Admin/sections/GallerySection';
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { getCurrentSession, logoutAdmin } from "@/configApi/admin";

export default function AdminDashboard() {
  const [currentSession, setCurrentSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('team');
  const [showLogout, setShowLogout] = useState(false);
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
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        const { status, data } = await getCurrentSession();
        
        if (status === 200 && data) {
          setCurrentSession(data);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/signin');
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    const { status } = await logoutAdmin();
    if (status === 200) {
      navigate('/signin');
    }
  };

  const toggleLogoutButton = () => {
    setShowLogout(!showLogout);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black text-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold italic text-white mb-6 tracking-tight">
              Admin Dashboard
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          </div>
        </div>

        {/* Unauthorized Content */}
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                You are not authorized to access the admin dashboard. Please log in with administrator credentials.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={handleGoToLogin}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:scale-105 transition-transform duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Go to Login
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full px-6 py-4 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 hover:text-white transition-all duration-300 font-medium border border-gray-700"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authorized - Show normal dashboard
  return (
    <div className="min-h-screen bg-black text-gray-100 relative">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl md:text-5xl font-bold italic text-white mb-2">Admin Dashboard</h1>
              <div className="w-16 h-1 bg-white mx-auto sm:mx-0"></div>
            </div>
            
            {/* Back to Home Button */}
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 hover:text-white transition-all duration-300 border border-gray-700 hover:scale-105 mx-auto sm:mx-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex-1 sm:flex-none min-w-[120px] text-center ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white border border-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Avatar & Logout Button */} 
            <div className="relative flex justify-center sm:justify-end mt-4 sm:mt-0"> 
              <Avatar 
                onClick={toggleLogoutButton} 
                className="w-12 h-12 rounded-full cursor-pointer flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold border-2 border-white/20 hover:scale-110 transition-transform duration-300"
              > 
                <AvatarFallback className="text-lg">
                  {currentSession?.email?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback> 
              </Avatar> 
              
              {showLogout && ( 
                <button 
                  onClick={handleLogout} 
                  className="absolute top-14 right-0 sm:right-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg shadow-lg border border-red-400/20 transition-all duration-300 font-semibold z-10 flex items-center gap-2 hover:scale-105"
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
      </div>

      {/* Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'team' && <Team />}  
          {activeTab === 'events' && <Events />} 
          {activeTab === 'publications' && <Publications />} 
          {activeTab === 'access' && <Access />}
          {activeTab === 'gallery' && <GallerySection />}
          {activeTab !== 'team' && activeTab !== 'events' && activeTab !== 'publications' && activeTab !== 'access' && activeTab !== 'gallery' && (
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20 p-8 text-center transform hover:scale-[1.01] transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">
                {tabs.find(t => t.id === activeTab)?.label} Section
              </h3>
              <p className="text-gray-300 text-lg">This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}