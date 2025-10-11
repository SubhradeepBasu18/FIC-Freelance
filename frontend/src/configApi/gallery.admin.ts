import axios from "axios";

const createAlbum = async(albumData: any) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/gallery/create-album`, albumData,{
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        });
        console.log(response.data);
        return {status: response.status, data: response.data}
    } catch (error) {
        console.log(error);
        return {status: error.response.status, data: error.response.data}
    }
}

const uploadMediaToAlbum = async(albumId: string, mediaData: any) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/gallery/upload-media-to-album/${albumId}`, mediaData,{
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        });
        console.log(response.data);
        return {status: response.status, data: response.data}
    } catch (error) {
        console.log(error);
        return {status: error.response.status, data: error.response.data}
    }
}

const deleteAlbum = async(albumId: string) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/gallery/delete-album/${albumId}`, {
            withCredentials: true
        });
        console.log(response.data);
        return {status: response.status, data: response.data}
    } catch (error) {
        console.log(error);
        return {status: error.response.status, data: error.response.data}
    }
}

const deleteMediaFromAlbumByID = async(albumId: string, mediaUrl: string) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/admin/gallery/delete-media-from-album/${albumId}`, 
            { mediaUrl },
            {
                withCredentials: true
            }
        );
        console.log(response.data);
        return {status: response.status, data: response.data};
    } catch (error: any) {
        console.log("API Error:", error);
        return {
            status: error.response?.status || 500, 
            data: error.response?.data || {message: "Network error"}
        };
    }
}

const updateAlbum = async(albumId: string, albumData: any) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/gallery/update-album/${albumId}`, albumData, {
            withCredentials: true
        });
        console.log(response.data);
        return {status: response.status, data: response.data}
    } catch (error) {
        console.log(error);
        return {status: error.response.status, data: error.response.data}
    }
}

export { createAlbum, uploadMediaToAlbum, deleteAlbum, deleteMediaFromAlbumByID, updateAlbum }
