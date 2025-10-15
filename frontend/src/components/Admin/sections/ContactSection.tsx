import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail, MapPin, Globe, X, Check, AlertTriangle, User } from 'lucide-react';

interface Contact {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    location: string;
    website?: string;
    isPublic: boolean;
}

const ContactSection: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; contact: Contact | null }>({
        isOpen: false,
        contact: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Contact>({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        location: '',
        website: '',
        isPublic: true,
    });

    // Mock API functions - replace with actual API calls
    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            // Replace with actual API call
            // const response = await getAllContacts();
            // if (response.status === 200) {
            //   setContacts(response.data.contacts);
            // }

            // Mock data for demonstration
            setTimeout(() => {
                setContacts([
                    {
                        _id: '1',
                        name: 'John Doe',
                        email: 'john.doe@university.edu',
                        phone: '+1 (555) 123-4567',
                        position: 'Professor',
                        department: 'Computer Science',
                        location: 'Science Building, Room 301',
                        website: 'https://cs.university.edu/johndoe',
                        isPublic: true,
                    },
                    {
                        _id: '2',
                        name: 'Jane Smith',
                        email: 'jane.smith@university.edu',
                        phone: '+1 (555) 987-6543',
                        position: 'Department Head',
                        department: 'Mathematics',
                        location: 'Math Building, Room 205',
                        website: '',
                        isPublic: false,
                    }
                ]);
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            setError('Error fetching contacts');
            setIsLoading(false);
        }
    };

    const addContact = async (contact: Contact) => {
        try {
            // Replace with actual API call
            // const response = await createContact(contact);
            // if (response.status === 201) {
            //   return response.data.contact;
            // }

            // Mock implementation
            return new Promise<Contact>((resolve) => {
                setTimeout(() => {
                    const newContact = { ...contact, _id: Date.now().toString() };
                    resolve(newContact);
                }, 500);
            });
        } catch (error) {
            throw new Error('Failed to add contact');
        }
    };

    const updateContact = async (id: string, contact: Contact) => {
        try {
            // Replace with actual API call
            // const response = await updateContact(id, contact);
            // if (response.status === 200) {
            //   return response.data.contact;
            // }

            // Mock implementation
            return new Promise<Contact>((resolve) => {
                setTimeout(() => {
                    resolve(contact);
                }, 500);
            });
        } catch (error) {
            throw new Error('Failed to update contact');
        }
    };

    const deleteContact = async (id: string) => {
        try {
            // Replace with actual API call
            // const response = await deleteContact(id);
            // if (response.status === 200) {
            //   return true;
            // }

            // Mock implementation
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 500);
            });
        } catch (error) {
            throw new Error('Failed to delete contact');
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSubmit = async () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.position.trim()) {
            setError('Name, email, and position are required fields');
            return;
        }

        try {
            setIsLoading(true);
            const newContact = await addContact(formData);
            setContacts(prev => [...prev, newContact]);
            setShowAddModal(false);
            resetForm();
            setError(null);
        } catch (error) {
            setError('Error adding contact');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        if (!editingContact?._id || !formData.name.trim() || !formData.email.trim() || !formData.position.trim()) {
            setError('Name, email, and position are required fields');
            return;
        }

        try {
            setIsLoading(true);
            const updatedContact = await updateContact(editingContact._id, formData);
            setContacts(prev => prev.map(contact =>
                contact._id === editingContact._id ? updatedContact : contact
            ));
            setEditingContact(null);
            resetForm();
            setError(null);
        } catch (error) {
            setError('Error updating contact');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (contact: Contact) => {
        setDeleteConfirm({
            isOpen: true,
            contact
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.contact?._id) return;

        try {
            setIsLoading(true);
            await deleteContact(deleteConfirm.contact._id);
            setContacts(prev => prev.filter(contact => contact._id !== deleteConfirm.contact?._id));
            setDeleteConfirm({ isOpen: false, contact: null });
            setError(null);
        } catch (error) {
            setError('Error deleting contact');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ isOpen: false, contact: null });
        setError(null);
    };

    const handleEditClick = (contact: Contact) => {
        setEditingContact(contact);
        setFormData(contact);
    };

    const handleCancelEdit = () => {
        setEditingContact(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            position: '',
            department: '',
            location: '',
            website: '',
            isPublic: true,
        });
    };

    const toggleVisibility = () => {
        setFormData(prev => ({
            ...prev,
            isPublic: !prev.isPublic
        }));
    };

    if (isLoading && contacts.length === 0) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                <span className="ml-2 text-white">Loading contacts...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Delete Confirmation Modal */}
            {deleteConfirm.isOpen && deleteConfirm.contact && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Delete Contact</h3>
                            <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>

                            <p className="text-gray-300 text-lg mb-2">
                                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.contact.name}</span>?
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
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Contact Management</h2>
                    <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
                    <p className="text-gray-300 text-lg">Manage department contacts and staff information</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 mx-auto sm:mx-0"
                >
                    <Plus size={20} />
                    Add Contact
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
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                        Processing...
                    </div>
                </div>
            )}

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.length === 0 && !isLoading ? (
                    <div className="col-span-full text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-green-400/20">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Contacts Yet</h3>
                        <p className="text-gray-300 text-lg mb-6">Get started by adding your first contact</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 mx-auto"
                        >
                            <Plus size={20} />
                            Create Your First Contact
                        </button>
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <div
                            key={contact._id}
                            className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-gray-700 hover:border-green-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/10"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{contact.name}</h3>
                                            <p className="text-green-300 text-sm">{contact.position}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${contact.isPublic
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                            : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                                        }`}>
                                        {contact.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Mail className="w-4 h-4 text-green-400" />
                                        <span className="text-sm break-all">{contact.email}</span>
                                    </div>
                                    {contact.phone && (
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Phone className="w-4 h-4 text-green-400" />
                                            <span className="text-sm">{contact.phone}</span>
                                        </div>
                                    )}
                                    {contact.department && (
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <span className="text-sm font-medium text-green-400">Dept:</span>
                                            <span className="text-sm">{contact.department}</span>
                                        </div>
                                    )}
                                    {contact.location && (
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <MapPin className="w-4 h-4 text-green-400" />
                                            <span className="text-sm">{contact.location}</span>
                                        </div>
                                    )}
                                    {contact.website && (
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Globe className="w-4 h-4 text-green-400" />
                                            <a
                                                href={contact.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                                            >
                                                {contact.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(contact)}
                                        disabled={isLoading}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-green-500/20 disabled:bg-zinc-600 text-green-400 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-green-400/30"
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(contact)}
                                        disabled={isLoading}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-red-400/30"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Contact Modal */}
            {(showAddModal || editingContact) && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-green-400/20 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">
                                {editingContact ? 'Edit Contact' : 'Add New Contact'}
                            </h2>
                            <button
                                onClick={editingContact ? handleCancelEdit : () => setShowAddModal(false)}
                                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-gray-700 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Position *</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
                                        placeholder="Enter position/title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
                                        placeholder="Enter department"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
                                        placeholder="Enter office location"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Website</label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Visibility</label>
                                    <button
                                        type="button"
                                        onClick={toggleVisibility}
                                        disabled={isLoading}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${formData.isPublic
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                                : 'bg-zinc-800 text-gray-400 border border-gray-600'
                                            } hover:scale-105`}
                                    >
                                        {formData.isPublic ? 'Public' : 'Private'}
                                    </button>
                                    <p className="text-sm text-gray-400">
                                        {formData.isPublic
                                            ? 'This contact will be visible to all users'
                                            : 'This contact will only be visible to admins'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
                            <button
                                onClick={editingContact ? handleCancelEdit : () => setShowAddModal(false)}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={editingContact ? handleEditSubmit : handleAddSubmit}
                                disabled={!formData.name.trim() || !formData.email.trim() || !formData.position.trim() || isLoading}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                            >
                                <Check size={18} />
                                {isLoading ? 'Saving...' : (editingContact ? 'Update Contact' : 'Add Contact')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactSection;