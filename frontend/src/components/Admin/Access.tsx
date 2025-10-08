import React, { useEffect, useState } from 'react';
import { Trash2, UserPlus, Shield, Crown } from 'lucide-react';
import { addAdmin, getAllAdmins } from '@/configApi/admin';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export default function AdminAccessPanel() {
  const [users, setUsers] = useState<AdminUser[]>([
    // { id: '1', email: 'superadmin@gmail.com', role: 'SuperAdmin' },
    // { id: '2', email: 'admin1@gmail.com', role: 'Admin' },
    // { id: '3', email: 'admin2@gmail.com', role: 'Admin' },
    // { id: '4', email: 'admin3@gmail.com', role: 'Admin' },
    // { id: '5', email: 'admin4@gmail.com', role: 'Admin' },
  ]);
  
  const [newEmail, setNewEmail] = useState('');
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [currentSuperAdminId, setCurrentSuperAdminId] = useState<string | null>(null);

  useEffect(()=>{
    const fetchAllAdmins = async () => {
        const response = await getAllAdmins();
        if (response.status === 200) {
            console.log(response.data);
            setUsers(response.data.admins);
        }
    }
    fetchAllAdmins();
  },[])
  const handleAdd = async () => {
    if (newEmail.trim() && newEmail.includes('@')) {
      const newUser: AdminUser = {
        id: Date.now().toString(),
        email: newEmail.trim(),
        role: 'admin'
      };
    //   setUsers([...users, newUser]);
    //   setNewEmail('');
    const response = await addAdmin(newEmail.trim());

    if (response.status === 200) {
        console.log("Admin added successfully");
      // If the admin is successfully added, update the local state with the new user
      setUsers([...users, newUser]);
      setNewEmail(''); // Reset the email input field
    } else {
      // Handle error (e.g., show a message to the user)
      console.error('Failed to add admin:', response.data);
      // Optionally display an error message to the user
    }
    }
  };

  const handleHandover = (fromId: string) => {
    setCurrentSuperAdminId(fromId);
    setShowHandoverModal(true);
  };

  const confirmHandover = (toId: string) => {
    if (currentSuperAdminId) {
      setUsers(users.map(user => {
        if (user.id === currentSuperAdminId) {
          return { ...user, role: 'admin' };
        }
        if (user.id === toId) {
          return { ...user, role: 'superadmin' };
        }
        return user;
      }));
    }
    setShowHandoverModal(false);
    setCurrentSuperAdminId(null);
  };

  const handleRemove = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.role === 'superadmin') {
      alert('Cannot remove SuperAdmin. Please handover the role first.');
      return;
    }
    setUsers(users.filter(user => user.id !== id));
  };

  const superAdmin = users.find(u => u.role === 'superadmin');
  const eligibleAdmins = users.filter(u => u.role === 'admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 border-b border-slate-600/50">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white tracking-wide">ACCESS PLAYGROUND</h1>
            </div>
          </div>

          {/* Add New User Section */}
          <div className="px-8 py-6 bg-slate-800/30">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleAdd}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/50"
              >
                <UserPlus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="px-8 py-6">
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`backdrop-blur-sm border rounded-lg px-6 py-4 flex items-center justify-between transition-all duration-200 group ${
                    user.role === 'superadmin' 
                      ? 'bg-gradient-to-r from-amber-900/30 to-slate-900/40 border-amber-700/50 hover:from-amber-900/40 hover:to-slate-900/50' 
                      : 'bg-slate-900/40 border-slate-700/50 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      user.role === 'superadmin'
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      {user.role === 'superadmin' ? (
                        <Crown className="w-5 h-5" />
                      ) : (
                        user.email.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      user.role === 'superadmin'
                        ? 'bg-amber-600/30 text-amber-200 border border-amber-600/50'
                        : 'bg-slate-700/50 text-slate-200'
                    }`}>
                      {user.role === 'superadmin' ? (
                        <span className="flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5" />
                          SuperAdmin
                        </span>
                      ) : (
                        'Admin'
                      )}
                    </span>
                    {user.role === 'superadmin' ? (
                      <button
                        onClick={() => handleHandover(user.id)}
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-200 font-medium text-sm border border-amber-500"
                      >
                        Handover
                      </button>
                    ) : (
                      <div className="w-[88px]"></div>
                    )}
                    <button
                      onClick={() => handleRemove(user.id)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        user.role === 'superadmin'
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      title={user.role === 'superadmin' ? 'Cannot remove SuperAdmin' : 'Remove user'}
                      disabled={user.role === 'superadmin'}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="px-8 py-4 bg-slate-800/30 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                Total administrators: <span className="text-white font-semibold">{users.length}</span>
              </p>
              {superAdmin && (
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  SuperAdmin: <span className="text-amber-300 font-semibold">{superAdmin.email}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Handover Modal */}
      {showHandoverModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Handover SuperAdmin Role</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-slate-300 mb-6">
                Select an administrator to transfer the SuperAdmin role to. Your role will be changed to Admin.
              </p>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {eligibleAdmins.length > 0 ? (
                  eligibleAdmins.map((admin) => (
                    <button
                      key={admin.id}
                      onClick={() => confirmHandover(admin.id)}
                      className="w-full px-4 py-3 bg-slate-900/50 hover:bg-slate-700 border border-slate-600 hover:border-amber-500 rounded-lg text-left transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {admin.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium group-hover:text-amber-300 transition-colors">
                          {admin.email}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No eligible administrators available</p>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700">
              <button
                onClick={() => {
                  setShowHandoverModal(false);
                  setCurrentSuperAdminId(null);
                }}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}