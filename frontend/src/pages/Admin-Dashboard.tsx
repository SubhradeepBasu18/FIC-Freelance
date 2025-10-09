import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Team from "../components/Admin/Team"
import Events from "../components/Admin/Events"
import Publications from "../components/Admin/Publications"
import Access from "../components/Admin/Access";
import GallerySection from '@/components/Admin/sections/GallerySection';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
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
      <div className="min-h-screen bg-zinc-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-zinc-400 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-zinc-950 text-gray-100">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-gray-800 px-8 py-6">
          <div className="flex justify-between items-center">
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
        </div>

        {/* Unauthorized Content */}
        <div className="flex items-center justify-center min-h-[80vh] px-8">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-12 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              You are not authorized to access the admin dashboard. Please log in with administrator credentials.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoToLogin}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Go to Login
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full px-6 py-3 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors duration-200 font-medium"
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
              <AvatarFallback>{currentSession?.email?.charAt(0).toUpperCase() || "A"}</AvatarFallback> 
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