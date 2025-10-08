import { useEffect, useState, type ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, Linkedin, X, Check } from 'lucide-react';
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
        console.log("Data: ", data);
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

  const handleDelete = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    setIsLoading(true);
    try {
      const {status, data, error} = await deleteTeamMember(_id);
      if(status === 200){
        setTeamMembers((prevMembers) => prevMembers.filter((member) => member._id !== _id));
        setError(null);
      }else{
        setError(error?.message || "Failed to delete team member");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete team member");
    }
    setIsLoading(false);
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
    <div className="max-w-7xl">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Team Management</h2>
          <p className="text-zinc-400">Manage your team members, positions, and contact information</p>
        </div>
        <button
          onClick={() => setIsAddingMember(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-200 text-center">
          Processing...
        </div>
      )}

      {/* Add Member Form */}
      {isAddingMember && (
        <div className="bg-zinc-900 rounded-xl p-6 mb-6 border border-zinc-800">
          <h3 className="text-xl font-semibold mb-4 text-white">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleInputChange}
              disabled={isLoading}
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Avatar Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
              />
              {avatarPreview && (
                <div className="mt-3">
                  <p className="text-sm text-zinc-400 mb-2">Preview:</p>
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-20 h-20 rounded-full object-cover border border-zinc-700"
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleInputChange}
              disabled={isLoading}
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-all"
            >
              <Check size={18} />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-500 text-white rounded-lg font-medium transition-all"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member._id} className="bg-zinc-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
            {editingId === member._id ? (
              // Edit Mode
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  placeholder="Position"
                />
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Avatar (Leave empty to keep current)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white disabled:opacity-50"
                  />
                  {avatarPreview && (
                    <div className="mt-2 flex items-center gap-3">
                      <img 
                        src={avatarPreview} 
                        alt="New avatar preview" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-xs text-green-400">New avatar selected</span>
                    </div>
                  )}
                  {!avatarPreview && member.avatar && (
                    <div className="mt-2 flex items-center gap-3">
                      <img 
                        src={member.avatar} 
                        alt="Current avatar" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-xs text-zinc-400">Current avatar</span>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="LinkedIn URL"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <Check size={16} />
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-500 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <X size={16} />
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
                    className="w-16 h-16 rounded-full bg-zinc-800 object-cover"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-blue-400 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      disabled={isLoading}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-red-400 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{member.position}</p>

                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
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
        <div className="text-center py-16 bg-zinc-900 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-lg">No team members yet. Click "Add Member" to get started.</p>
        </div>
      )}
    </div>
  );
}