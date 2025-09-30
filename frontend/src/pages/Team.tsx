import { useState, type ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, Linkedin, X, Check } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      linkedIn: 'https://linkedin.com/in/sarahjohnson',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      linkedIn: 'https://linkedin.com/in/michaelchen',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      linkedIn: 'https://linkedin.com/in/emilyrodriguez',
    },
  ]);

  const [isAddingMember, setIsAddingMember] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '',
    linkedIn: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAdd = () => {
    if (formData.name && formData.role) {
      const newMember: TeamMember = {
        id: Date.now(),
        ...formData,
        avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      };
      setTeamMembers([...teamMembers, newMember]);
      setFormData({ name: '', role: '', avatar: '', linkedIn: '' });
      setIsAddingMember(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleUpdate = () => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === editingId ? { ...member, ...formData } : member
      )
    );
    setEditingId(null);
    setFormData({ name: '', role: '', avatar: '', linkedIn: '' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
    }
  };

  const handleCancel = () => {
    setIsAddingMember(false);
    setEditingId(null);
    setFormData({ name: '', role: '', avatar: '', linkedIn: '' });
  };

  return (
    <div className="max-w-7xl">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Team Management</h2>
          <p className="text-gray-400">Manage your team members, roles, and contact information</p>
        </div>
        <button
          onClick={() => setIsAddingMember(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Add Member Form */}
      {isAddingMember && (
        <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-white">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              name="role"
              placeholder="Role/Position"
              value={formData.role}
              onChange={handleInputChange}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              name="avatar"
              placeholder="Avatar URL (optional)"
              value={formData.avatar}
              onChange={handleInputChange}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              name="linkedIn"
              placeholder="LinkedIn URL"
              value={formData.linkedIn}
              onChange={handleInputChange}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
            >
              <Check size={18} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
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
          <div key={member.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
            {editingId === member.id ? (
              // Edit Mode
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  placeholder="Avatar URL"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleInputChange}
                  placeholder="LinkedIn URL"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <Check size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all"
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
                    className="w-16 h-16 rounded-full bg-gray-800"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-red-400 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{member.role}</p>

                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
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

      {teamMembers.length === 0 && (
        <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-lg">No team members yet. Click "Add Member" to get started.</p>
        </div>
      )}
    </div>
  );
}
