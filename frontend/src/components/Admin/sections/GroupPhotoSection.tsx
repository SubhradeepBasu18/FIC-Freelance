import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X, Check, AlertTriangle, Image, Camera, Upload, FileUp } from 'lucide-react';
import { uploadGroupPhoto, getAllGroupPhotos, deleteGroupPhoto } from '@/configApi/homePage';

interface GroupPhoto {
    public_id?: string;
    secure_url: string;
    uploadedAt: string;
}

const GroupPhotoSection: React.FC = () => {
    const [groupPhotos, setGroupPhotos] = useState<GroupPhoto[]>([]);
    const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
    const [photoDeleteConfirm, setPhotoDeleteConfirm] = useState<{ isOpen: boolean; photo: GroupPhoto | null }>({
        isOpen: false,
        photo: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch group photos from backend
    const fetchGroupPhotos = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await getAllGroupPhotos();
            
            if (response) {
                // Transform the response data to match our GroupPhoto interface
                const photos = response;
                console.log(photos);
                setGroupPhotos(photos);
            } else {
                setError('Failed to fetch group photos');
            }
        } catch (error) {
            setError('Error fetching group photos');
            console.error('Error fetching photos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle file upload to backend
    const handleFileUpload = async (file: File): Promise<GroupPhoto> => {
        setIsUploading(true);
        try {
            const response = await uploadGroupPhoto(file);
            
            if (response && response.success) {
                return {
                    public_id: response.groupPhotoPath,
                    secure_url: response.groupPhotoPath,
                    uploadedAt: new Date().toISOString()
                };
            } else {
                throw new Error(response?.message || 'Failed to upload photo');
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    // Delete group photo using the API function
    const handleDeleteGroupPhoto = async (id: string): Promise<boolean> => {
        if (!id) {
            throw new Error('Photo ID is required for deletion');
        }

        setIsDeleting(true);
        try {
            const photoId = id.split("/")[1];
            
            const response = await deleteGroupPhoto(photoId);
            
            if (response) {
                return true;
            } else {
                throw new Error(response?.message || 'Failed to delete photo');
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Delete failed');
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchGroupPhotos();
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelection(file);
        }
    };

    const handleAddPhotoSubmit = async () => {
        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        try {
            setError(null);
            
            const newPhoto = await handleFileUpload(selectedFile);
            setGroupPhotos(prev => [newPhoto, ...prev]);
            setShowAddPhotoModal(false);
            resetForm();
            
            // Refresh the list to ensure we have the latest data
            fetchGroupPhotos();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error uploading photo');
            console.error('Upload error:', error);
        }
    };

    const handlePhotoDeleteClick = (photo: GroupPhoto) => {
        setPhotoDeleteConfirm({
            isOpen: true,
            photo
        });
    };

    const handlePhotoDeleteConfirm = async () => {
        if (!photoDeleteConfirm.photo?.public_id) return;

        try {
            setIsLoading(true);
            const success = await handleDeleteGroupPhoto(photoDeleteConfirm.photo.public_id);
            
            if (success) {
                setGroupPhotos(prev => prev.filter(photo => photo.public_id !== photoDeleteConfirm.photo?.public_id));
                setPhotoDeleteConfirm({ isOpen: false, photo: null });
                setError(null);
            } else {
                throw new Error('Failed to delete photo');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error deleting group photo');
            console.error('Delete error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoDeleteCancel = () => {
        setPhotoDeleteConfirm({ isOpen: false, photo: null });
        setError(null);
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreviewUrl('');
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

    if (isLoading && groupPhotos.length === 0) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="ml-2 text-white">Loading group photos...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Delete Confirmation Modal */}
            {photoDeleteConfirm.isOpen && photoDeleteConfirm.photo && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-400/30 p-6 max-w-md w-full transform scale-95 animate-in fade-in-0 zoom-in-95">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Delete Group Photo</h3>
                            <div className="w-12 h-1 bg-red-400 mx-auto mb-4"></div>
                            <p className="text-gray-300 text-lg mb-2">
                                Are you sure you want to delete this photo?
                            </p>
                            <p className="text-red-400 text-sm">
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handlePhotoDeleteCancel}
                                disabled={isLoading || isDeleting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handlePhotoDeleteConfirm}
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
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Group Photos</h2>
                    <div className="w-16 h-1 bg-white mx-auto sm:mx-0 mb-4"></div>
                    <p className="text-gray-300 text-lg">Manage team group photos and memories</p>
                </div>
                <button
                    onClick={() => setShowAddPhotoModal(true)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 mx-auto sm:mx-0"
                >
                    <Camera size={20} />
                    Upload Photo
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

            {/* Group Photos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupPhotos.length === 0 && !isLoading ? (
                    <div className="col-span-full text-center py-16 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-blue-400/20">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Photos Yet</h3>
                        <p className="text-gray-300 text-lg mb-6">Upload your first group photo to get started</p>
                        <button
                            onClick={() => setShowAddPhotoModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 mx-auto"
                        >
                            <Upload size={20} />
                            Upload Your First Photo
                        </button>
                    </div>
                ) : (
                    groupPhotos.map((photo) => (
                        <div
                            key={photo.public_id}
                            className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
                        >
                            <div className="p-4">
                                {/* Photo */}
                                <div className="mb-4 rounded-xl overflow-hidden">
                                    <img
                                        src={photo.secure_url}
                                        alt="Group photo"
                                        className="w-full h-48 object-cover transition-all duration-300 hover:scale-105"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                        }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => window.open(photo.secure_url, '_blank')}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-blue-500/20 text-blue-400 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-blue-400/30"
                                    >
                                        <Image size={16} />
                                        View
                                    </button>
                                    <button
                                        onClick={() => handlePhotoDeleteClick(photo)}
                                        disabled={isLoading || isDeleting}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-red-500/20 disabled:bg-zinc-600 text-red-400 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-red-400/30"
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

            {/* Upload Photo Modal */}
            {showAddPhotoModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-blue-400/20 max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-in fade-in-0 zoom-in-95">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">Upload Group Photo</h2>
                            <button
                                onClick={() => {
                                    setShowAddPhotoModal(false);
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
                                {/* File Upload Area */}
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
                                                <p className="text-gray-400 text-sm">Please wait while we upload your photo</p>
                                            </div>
                                        </div>
                                    ) : selectedFile ? (
                                        <div className="space-y-4">
                                            <Check className="w-12 h-12 text-green-400 mx-auto" />
                                            <div>
                                                <p className="text-white font-semibold">File Selected</p>
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
                                                className="text-red-400 hover:text-red-300 text-sm font-semibold"
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
                                                Select File
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Preview */}
                                {previewUrl && !isUploading && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Preview</label>
                                        <div className="border border-gray-600 rounded-lg overflow-hidden">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700">
                            <button
                                onClick={() => {
                                    setShowAddPhotoModal(false);
                                    resetForm();
                                }}
                                disabled={isUploading}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-600"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPhotoSubmit}
                                disabled={!selectedFile || isUploading}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        Upload Photo
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

export default GroupPhotoSection;