import axios from "axios";

// Article APIs
const getAllArticles = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/publication/get-all-articles`);
        return {status: response.status, data: response.data};
    } catch (error) {
        console.error("Error fetching articles:", error);
        return {status: error.response?.status, data: error.response?.data};
    }
}

const updateArticle = async(id: string, title: string, authors: string, textContent: string, isPublic: boolean) => {
    try {
        console.log("isPublic: ", isPublic);
        
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/publication/update-article/${id}`, {
            title,
            authors,
            textContent,
            isPublic: String(isPublic)
        },{
            withCredentials: true
        });
        return {status: response.status, data: response.data};
    } catch (error) {
        console.error("Error updating articles:", error);
        return {status: error.response?.status, data: error.response?.data};
    }
}

const addArticle = async(article: Article) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/publication/add-article`, article, {
            withCredentials: true
        });
        return {status: response.status, data: response.data};
    } catch (error) {
        console.error("Error adding article:", error);
        return {status: error.response?.status, data: error.response?.data};
    }
}

const deleteArticle = async(id: string) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/publication/delete-article/${id}`, {
            withCredentials: true
        });
        return {status: response.status, data: response.data};
    } catch (error) {
        console.error("Error deleting article:", error);
        return {status: error.response?.status, data: error.response?.data};
    }
}

// Podcast APIs
const getAllPodcasts = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/publication/get-all-podcasts`);
        return {status: response.status, data: response.data};
    } catch (error) {
        console.error("Error fetching podcasts:", error);
        return {status: error.response?.status, data: error.response?.data};
    }
}

const addPodcast = async(podcast: Podcast) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/publication/add-podcast`, podcast, {
            withCredentials: true
        });
        return {status: response.status, data: response.data};
    } catch (error) {
        console.error("Error adding podcast:", error);
        return {status: error.response?.status, data: error.response?.data};
    }
}

const deletePodcast = async(id: string) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/publication/delete-podcast/${id}`, {
            withCredentials: true
        });
        return {status: response.status, data: response.data};
    } catch (error) {
        console.error("Error deleting podcast:", error);
        return {status: error.response?.status, data: error.response?.data};
    }
}

const updatePodcast = async(id: string, title: string, hosts: string, spotifyLink: string, isPublic: boolean) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/publication/update-podcast/${id}`, {
            title,
            hosts,
            spotifyLink,
            isPublic
        },{
            withCredentials: true
        });
        return {status: response.status, data: response.data};
    } catch (error) {
        console.error("Error updating podcast:", error);
        return {status: error.response?.status, data: error.response?.data};
    }
}

export {
    getAllArticles,
    updateArticle,
    addArticle,
    deleteArticle,
    getAllPodcasts,
    addPodcast,
    deletePodcast,
    updatePodcast
}