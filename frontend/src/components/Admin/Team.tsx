import { useEffect, useState, type ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, Linkedin, X, Check, AlertTriangle } from 'lucide-react';
import { getAllTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '@/configApi/team.admin';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  avatar: string;
  linkedin: string;
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAddingMember, setIsAddingMember] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; member: TeamMember | null }>({
    isOpen: false,
    member: null
  });
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    linkedin: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllTeamMembers = async() => {
      setIsLoading(true);
      const {status, data, error} = await getAllTeamMembers();
      if(status === 200){
        setTeamMembers(data.team);
      }else{
        setError(error?.message || "Failed to fetch team members")
      }
      setIsLoading(false);
    }
    fetchAllTeamMembers()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.position || !formData.linkedin) {
      setError('All fields are required');
      return;
    }

    if (!avatarFile) {
      setError('Avatar image is required');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('position', formData.position);
      submitData.append('linkedin', formData.linkedin);
      submitData.append('avatar', avatarFile);

      const {status, data, error} = await addTeamMember(submitData);
      if(status === 201){
        setTeamMembers([...teamMembers, data.teamMember]);
        resetForm();
        setIsAddingMember(false);
        setError(null);
      }else{
        setError(error?.message || "Failed to add team member");
      }
    } catch (err: any) {
      setError(err.message || "Failed to add team member");
    }
    setIsLoading(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      position: member.position,
      linkedin: member.linkedin,
    });
    setAvatarPreview(member.avatar);
    setAvatarFile(null); // Reset file when starting edit
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.position || !formData.linkedin) {
      setError('All fields are required');
      return;
    }

    if (!editingId) return;

    setIsLoading(true);
    try {
      // Create FormData for update
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('position', formData.position);
      submitData.append('linkedin', formData.linkedin);
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      const {status, data, error} = await updateTeamMember(editingId, submitData);
      if(status === 200){
        setTeamMembers((prevMembers) =>
          prevMembers.map((member) =>
            member._id === editingId ? data.teamMember : member
          )
        );
        resetForm();
        setEditingId(null);
        setError(null);
      }else{
        setError(error?.message || "Failed to update team member");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update team member");
    }
    setIsLoading(false);
  };

  const handleDeleteClick = (member: TeamMember) => {
    setDeleteConfirm({
      isOpen: true,
      member
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.member) return;

    setIsLoading(true);
    try {
      const {status, data, error} = await deleteTeamMember(deleteConfirm.member._id);
      if(status === 200){
        setTeamMembers((prevMembers) => prevMembers.filter((member) => member._id !== deleteConfirm.member!._id));
        setError(null);
      }else{
        setError(error?.message || "Failed to delete team member");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete team member");
    }
    
    setDeleteConfirm({ isOpen: false, member: null });
    setIsLoading(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, member: null });
  };

  const resetForm = () => {
    setFormData({ name: '', position: '', linkedin: '' });
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const handleCancel = () => {
    setIsAddingMember(false);
    setEditingId(null);
    resetForm();
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.member && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Delete Team Member</h3>
              <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
              
              <p className="text-gray-300 text-lg mb-2">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.member.name}</span>?
              </p>
              <p className="text-red-400 text-sm">
                This action cannot be undone.
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
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Team Management</h2>
          <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
          <p className="text-gray-300 text-lg">Manage your team members, positions, and contact information</p>
        </div>
        <button
          onClick={() => setIsAddingMember(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-400 disabled:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 mx-auto sm:mx-0"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
            Processing...
          </div>
        </div>
      )}

      {/* Add Member Form */}
      {isAddingMember && (
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 mb-8 border border-cyan-400/20 transform hover:scale-[1.01] transition-all duration-300">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Position</label>
              <input
                type="text"
                name="position"
                placeholder="Enter position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Avatar Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-blue-600 file:text-white hover:file:from-cyan-600 hover:file:to-blue-700 disabled:opacity-50 transition-all duration-300"
              />
              {avatarPreview && (
                <div className="mt-3 flex items-center gap-4">
                  <p className="text-sm text-gray-300">Preview:</p>
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50"
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-300">LinkedIn URL</label>
              <input
                type="text"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Check size={18} />
              {isLoading ? 'Saving...' : 'Save Member'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <div key={member._id} className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
            {editingId === member._id ? (
              // Edit Mode
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white text-center mb-4">Edit Member</h4>
                
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                    placeholder="Full Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-300">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                    placeholder="Position"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">Avatar (Leave empty to keep current)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-blue-600 file:text-white disabled:opacity-50"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    {avatarPreview ? (
                      <>
                        <img 
                          src={avatarPreview} 
                          alt="New avatar preview" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-green-400"
                        />
                        <span className="text-xs text-green-400">New avatar selected</span>
                      </>
                    ) : (
                      <>
                        <img 
                          src={member.avatar} 
                          alt="Current avatar" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-400"
                        />
                        <span className="text-xs text-gray-400">Current avatar</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-300">LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="LinkedIn URL"
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg text-sm font-semibold transition-all duration-300"
                  >
                    <Check size={14} />
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 border border-gray-600"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-cyan-500/20 disabled:bg-zinc-600 text-cyan-400 rounded-lg transition-all duration-300 hover:scale-110 border border-cyan-400/30"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(member)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg transition-all duration-300 hover:scale-110 border border-red-400/30"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-gray-300 text-lg mb-4">{member.position}</p>

                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Linkedin size={16} />
                    LinkedIn Profile
                  </a>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && !isAddingMember && (
        <div className="text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-cyan-400/20">
          <p className="text-gray-300 text-xl">No team members yet. Click "Add Member" to get started.</p>
        </div>
      )}
    </div>
  );
}