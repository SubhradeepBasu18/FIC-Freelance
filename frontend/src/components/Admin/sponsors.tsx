import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X, Check, AlertTriangle, Image, Upload, FileUp } from 'lucide-react';
import { addNewSponsor, getAllSponsors, deleteSponsor } from '@/configApi/sponsors.admins';

interface Sponsor {
    id: string;
    name: string;
    url: string;
}

const SponsorsPage: React.FC = () => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [showAddSponsorModal, setShowAddSponsorModal] = useState(false);
    const [sponsorDeleteConfirm, setSponsorDeleteConfirm] = useState<{ isOpen: boolean; sponsor: Sponsor | null }>({
        isOpen: false,
        sponsor: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [sponsorName, setSponsorName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadSponsorLogo = async (file: File, name: string): Promise<{ success: boolean; sponsor?: Sponsor }> => {
        // Simulate upload - replace with actual upload logic
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSponsor: Sponsor = {
                    id: Date.now().toString(),
                    name,
                    url: URL.createObjectURL(file) // In real app, this would be the uploaded image URL
                };
                resolve({ success: true, sponsor: newSponsor });
            }, 2000);
        });
    };

    // Fetch sponsors from backend
    const fetchSponsors = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await getAllSponsors();
            console.log(response)
            setSponsors(response.data.sponsor);
        } catch (error) {
            setError('Error fetching sponsors');
            console.error('Error fetching sponsors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelection(file);
        }
    };

    const handleAddSponsorSubmit = async () => {
        if (!selectedFile || !sponsorName.trim()) {
            setError('Please provide both sponsor name and logo');
            return;
        }

        try {
            setError(null);
            setIsUploading(true);
            
            const response = await addNewSponsor(sponsorName.trim(), selectedFile)
            console.log(response.status);
            console.log(response.data.sponsor);

            
            
            if (response.status === 201) {
                console.log('Successfully sponsor added!');
                
                setSponsors(prev => [response.data.newsponsor!, ...prev]);
                setShowAddSponsorModal(false);
                resetForm();
                fetchSponsors()
            } else {
                console.log('Failed to add sponsor');
                
                throw new Error('Failed to add sponsor');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error adding sponsor');
            console.error('Add sponsor error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSponsorDeleteClick = (sponsor: Sponsor) => {
        setSponsorDeleteConfirm({
            isOpen: true,
            sponsor
        });
    };

    const handleSponsorDeleteConfirm = async () => {
        if (!sponsorDeleteConfirm.sponsor?._id) return;

        try {
            setIsLoading(true);
            
            const response = await deleteSponsor(sponsorDeleteConfirm.sponsor._id)
            
            if (response.status === 200) {
                setSponsors(prev => prev.filter(sponsor => sponsor._id !== sponsorDeleteConfirm.sponsor?._id));
                setSponsorDeleteConfirm({ isOpen: false, sponsor: null });
                setError(null);
            } else {
                throw new Error('Failed to delete sponsor');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error deleting sponsor');
            console.error('Delete error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSponsorDeleteCancel = () => {
        setSponsorDeleteConfirm({ isOpen: false, sponsor: null });
        setError(null);
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setSponsorName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.classList.add('border-blue-400', 'bg-blue-500/10');
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10');
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10');
        
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFileSelection(file);
        }
    };

    const handleFileSelection = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPEG, PNG, GIF, etc.)');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setSelectedFile(file);
        setError(null);
        
        // Create preview
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (isLoading && sponsors.length === 0) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="ml-2 text-white">Loading sponsors...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Delete Confirmation Modal */}
            {sponsorDeleteConfirm.isOpen && sponsorDeleteConfirm.sponsor && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Delete Sponsor</h3>
                            <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
                            <p className="text-gray-300 text-lg mb-2">
                                Are you sure you want to delete <strong>{sponsorDeleteConfirm.sponsor.name}</strong>?
                            </p>
                            <p className="text-red-400 text-sm">
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleSponsorDeleteCancel}
                                disabled={isLoading || isDeleting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSponsorDeleteConfirm}
                                disabled={isLoading || isDeleting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                            >
                                {(isLoading || isDeleting) ? (
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
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Sponsors</h2>
                    <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
                    <p className="text-gray-300 text-lg">Manage sponsors and their logos</p>
                </div>
                <button
                    onClick={() => setShowAddSponsorModal(true)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 mx-auto sm:mx-0"
                >
                    <Plus size={20} />
                    Add Sponsor
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {(isLoading || isUploading || isDeleting) && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                        {isUploading ? 'Uploading...' : isDeleting ? 'Deleting...' : 'Processing...'}
                    </div>
                </div>
            )}

            {/* Sponsors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sponsors.length === 0 && !isLoading ? (
                    <div className="col-span-full text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-blue-400/20">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Sponsors Yet</h3>
                        <p className="text-gray-300 text-lg mb-6">Add your first sponsor to get started</p>
                        <button
                            onClick={() => setShowAddSponsorModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 mx-auto"
                        >
                            <Plus size={20} />
                            Add Your First Sponsor
                        </button>
                    </div>
                ) : (
                    sponsors.map((sponsor) => (
                        <div
                            key={sponsor._id}
                            className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
                        >
                            <div className="p-4">
                                {/* Sponsor Logo */}
                                <div className="mb-4 rounded-xl overflow-hidden bg-white p-4">
                                    <img
                                        src={sponsor.image}
                                        alt={sponsor.name}
                                        className="w-full h-32 object-contain transition-all duration-300 hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/200x100?text=Logo+Not+Found';
                                        }}
                                    />
                                </div>

                                {/* Sponsor Name */}
                                <h3 className="text-xl font-bold text-white text-center mb-4 truncate">
                                    {sponsor.name}
                                </h3>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSponsorDeleteClick(sponsor)}
                                        disabled={isLoading || isDeleting}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-red-400/30"
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

            {/* Add Sponsor Modal */}
            {showAddSponsorModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-blue-400/20 max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">Add New Sponsor</h2>
                            <button
                                onClick={() => {
                                    setShowAddSponsorModal(false);
                                    resetForm();
                                }}
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

                            <div className="space-y-6">
                                {/* Sponsor Name Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Sponsor Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={sponsorName}
                                        onChange={(e) => setSponsorName(e.target.value)}
                                        placeholder="Enter sponsor name"
                                        className="w-full px-4 py-3 bg-zinc-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
                                    />
                                </div>

                                {/* File Upload Area */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Sponsor Logo *
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                                            ${selectedFile 
                                                ? 'border-green-400 bg-green-500/10' 
                                                : 'border-gray-600 hover:border-blue-400 hover:bg-blue-500/10'
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={triggerFileInput}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                        
                                        {isUploading ? (
                                            <div className="space-y-4">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                                                <div>
                                                    <p className="text-white font-semibold">Uploading...</p>
                                                    <p className="text-gray-400 text-sm">Please wait while we upload the logo</p>
                                                </div>
                                            </div>
                                        ) : selectedFile ? (
                                            <div className="space-y-4">
                                                <Check className="w-12 h-12 text-green-400 mx-auto" />
                                                <div>
                                                    <p className="text-white font-semibold">Logo Selected</p>
                                                    <p className="text-gray-400 text-sm">{selectedFile.name}</p>
                                                    <p className="text-gray-400 text-xs">
                                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        resetForm();
                                                    }}
                                                    className="text-white-400 hover:text-black-500 text-sm font-semibold cursor-pointer"
                                                >
                                                    Choose different file
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                                <div>
                                                    <p className="text-white font-semibold">Click to upload or drag and drop</p>
                                                    <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 5MB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-all duration-300 mx-auto"
                                                >
                                                    <FileUp size={16} />
                                                    Select Logo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Preview */}
                                {previewUrl && !isUploading && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Logo Preview</label>
                                        <div className="border border-gray-600 rounded-lg overflow-hidden bg-white p-4">
                                            <img
                                                src={previewUrl}
                                                alt="Logo preview"
                                                className="w-full h-32 object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
                            <button
                                onClick={() => {
                                    setShowAddSponsorModal(false);
                                    resetForm();
                                }}
                                disabled={isUploading}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSponsorSubmit}
                                disabled={!selectedFile || !sponsorName.trim() || isUploading}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        Add Sponsor
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SponsorsPage;