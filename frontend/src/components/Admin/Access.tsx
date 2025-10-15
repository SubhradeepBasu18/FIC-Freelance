import { useEffect, useState } from 'react';
import { Trash2, UserPlus, Shield, Crown, X, AlertTriangle, Check } from 'lucide-react';
import { addAdmin, getAllAdmins, getCurrentSession, removeAdmin, handoverSuperAdmin } from '@/configApi/admin';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  _id: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export default function AdminAccessPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentSession, setCurrentSession] = useState<AdminUser | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; user: AdminUser | null }>({
    isOpen: false,
    user: null
  });
  const [currentSuperAdminId, setCurrentSuperAdminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchAllAdmins();
    fetchCurrentSession();
  }, []);

  const fetchAllAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAdmins();
      if (response.status === 200) {
        setUsers(response.data.admins);
        setError(null);
      } else {
        setError('Failed to fetch admins');
      }
    } catch (error) {
      setError('Error fetching admins');
    } finally {
      setIsLoading(false);
    }
  }

  const fetchCurrentSession = async () => {
    try {
      const response = await getCurrentSession();
      if (response.status === 200) {
        setCurrentSession(response.data);
      }
    } catch (error) {
      console.error('Error fetching current session:', error);
    }
  }

  const handleAdd = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await addAdmin(newEmail.trim());

      if (response.status === 200) {
        alert('Your temporary password: ' + response.data.password);
        setUsers([...users, { _id: Date.now().toString(), email: newEmail.trim(), role: 'admin' }]);
        setNewEmail('');
        setError(null);
        fetchAllAdmins();
      } else {
        setError('Failed to add admin');
      }
    } catch (error) {
      setError('Error adding admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHandover = (userId: string) => {
    setCurrentSuperAdminId(userId);
    setShowHandoverModal(true);
  };

  const confirmHandover = async (toId: string) => {
    if (!currentSuperAdminId) return;

    try {
      setIsLoading(true);
      const { status, data } = await handoverSuperAdmin(toId);
      
      if (status === 200) {
        alert('Superadmin handovered successfully');
        fetchAllAdmins();
        navigate('/signin');
        setError(null);
      } else {
        setError('Failed to handover superadmin');
      }
    } catch (error) {
      setError('Error during superadmin handover');
    } finally {
      setIsLoading(false);
      setShowHandoverModal(false);
      setCurrentSuperAdminId(null);
    }
  };

  const handleRemoveClick = (user: AdminUser) => {
    setDeleteConfirm({
      isOpen: true,
      user
    });
  };

  const handleRemoveConfirm = async () => {
    if (!deleteConfirm.user) return;

    try {
      setIsLoading(true);
      const response = await removeAdmin(deleteConfirm.user._id);
      
      if (response.status === 200) {
        setUsers(users.filter(user => user._id !== deleteConfirm.user?._id));
        setDeleteConfirm({ isOpen: false, user: null });
        setError(null);
        fetchAllAdmins();
      } else {
        setError('Failed to remove admin');
      }
    } catch (error) {
      setError('Error removing admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, user: null });
    setError(null);
  };

  const superAdmin = users.find(u => u.role === 'superadmin');
  const eligibleAdmins = users.filter(u => u.role === 'admin');

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
        <span className="ml-2 text-white">Loading admins...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.user && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Remove Admin</h3>
              <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
              
              <p className="text-gray-300 text-lg mb-2">
                Are you sure you want to remove <span className="text-white font-semibold break-all">{deleteConfirm.user.email}</span>?
              </p>
              <p className="text-red-400 text-sm">
                This admin will lose all access privileges.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleRemoveConfirm}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Access Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Manage administrator accounts and permissions</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
            Processing...
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-amber-400/20 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-8 py-6 border-b border-gray-700">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Shield className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide text-center sm:text-left">ACCESS PLAYGROUND</h1>
          </div>
        </div>

        {/* Add New User Section */}
        <div className="px-4 sm:px-8 py-6 bg-zinc-900/30">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Enter email address"
                disabled={currentSession?.role !== 'superadmin' || isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={currentSession?.role !== 'superadmin' || isLoading || !newEmail.trim()}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-amber-400 disabled:to-orange-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/30 flex-shrink-0"
            >
              <UserPlus size={20} />
              <span className="hidden sm:inline">{isLoading ? 'Adding...' : 'Add Admin'}</span>
              <span className="sm:hidden">{isLoading ? '...' : 'Add'}</span>
            </button>
          </div>
          {currentSession?.role !== 'superadmin' && (
            <p className="text-amber-400 text-sm mt-2 text-center sm:text-left">
              Only SuperAdmin can add new administrators
            </p>
          )}
        </div>

        {/* Users List */}
        <div className="px-4 sm:px-8 py-6">
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-amber-400/20">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Administrators</h3>
                <p className="text-gray-300 text-lg mb-6">Add the first administrator to get started</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className={`bg-gradient-to-br rounded-2xl border p-4 sm:p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${
                    user.role === 'superadmin' 
                      ? 'from-amber-900/20 to-zinc-900 border-amber-400/30 hover:shadow-amber-500/10' 
                      : 'from-zinc-900 to-black border-gray-700 hover:border-amber-400/30 hover:shadow-amber-500/5'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    {/* User Info Section */}
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                        user.role === 'superadmin'
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        {user.role === 'superadmin' ? (
                          <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Email with responsive breakpoints */}
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 break-all sm:break-words">
                          {user.email}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'superadmin'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          }`}>
                            {user.role === 'superadmin' ? (
                              <>
                                <Crown className="w-3 h-3 mr-1" />
                                SuperAdmin
                              </>
                            ) : (
                              'Admin'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0 w-full lg:w-auto justify-end lg:justify-start">
                      {user.role === 'superadmin' ? (
                        <button
                          onClick={() => handleHandover(user._id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-amber-400 disabled:to-orange-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base flex-1 lg:flex-none justify-center"
                        >
                          <Crown size={16} />
                          <span className="hidden sm:inline">Handover</span>
                          <span className="sm:hidden">Transfer</span>
                        </button>
                      ) : (
                        <div className="w-0 lg:w-[100px]"></div>
                      )}
                      <button
                        onClick={() => handleRemoveClick(user)}
                        disabled={user.role === 'superadmin' || isLoading}
                        className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
                          user.role === 'superadmin'
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-red-400 hover:bg-red-500/20 hover:scale-110 border border-red-400/30'
                        }`}
                        title={user.role === 'superadmin' ? 'Cannot remove SuperAdmin' : 'Remove admin'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="px-4 sm:px-8 py-4 bg-zinc-900/30 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-base sm:text-lg text-center sm:text-left">
              Total administrators: <span className="text-white font-semibold">{users.length}</span>
            </p>
            {superAdmin && (
              <p className="text-gray-400 text-base sm:text-lg flex items-center gap-2 justify-center sm:justify-start">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                SuperAdmin: <span className="text-amber-300 font-semibold break-all sm:break-words max-w-[200px] sm:max-w-none">{superAdmin.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Handover Modal */}
      {showHandoverModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-amber-400/20 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="p-4 sm:p-6 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Handover SuperAdmin Role</h2>
              </div>
              <div className="w-12 h-1 bg-amber-400 mb-4"></div>
              <p className="text-gray-300 text-base sm:text-lg">
                Select an administrator to transfer the SuperAdmin role to. Your role will be changed to Admin and you will be logged out.
              </p>
              <p className="text-amber-400 text-sm mt-2 font-semibold">
                ⚠️ This action cannot be undone!
              </p>
            </div>
            
            <div className="p-4 sm:p-6 max-h-64 overflow-y-auto">
              {eligibleAdmins.length > 0 ? (
                <div className="space-y-3">
                  {eligibleAdmins.map((admin) => (
                    <button
                      key={admin._id}
                      onClick={() => confirmHandover(admin._id)}
                      disabled={isLoading}
                      className="w-full px-4 py-4 bg-zinc-800/50 hover:bg-amber-500/20 border border-gray-600 hover:border-amber-400 rounded-lg text-left transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-white font-medium group-hover:text-amber-300 transition-colors break-all">
                            {admin.email}
                          </span>
                          <p className="text-gray-400 text-sm">Admin</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No eligible administrators available</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowHandoverModal(false);
                  setCurrentSuperAdminId(null);
                }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}