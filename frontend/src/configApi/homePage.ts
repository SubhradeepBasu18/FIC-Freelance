import axios from "axios";

export const getLastUploadedGroupPhoto = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/get-last-uploaded-group-photo`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching last uploaded group photo:', error);
        return null;
    }
};

export const uploadGroupPhoto = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('groupPhoto', file);

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/change-group-photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        const data = await response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error uploading group photo:', error);
        return null;
    }
};

export const getAllGroupPhotos = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/get-all-group-photos`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        const data = await response.data;
        console.log(data);
        return data.groupPhotos;
    } catch (error) {
        console.error('Error fetching all group photos:', error);
        return null;
    }
};

export const deleteGroupPhoto = async (id: string) => {
    try {
        console.log(id);
        
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/delete-group-photo/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        const data = await response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error deleting group photo:', error);
        return null;
    }
};
