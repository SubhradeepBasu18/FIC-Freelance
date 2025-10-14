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
        // console.log("isPublic: ", isPublic);
        
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

// Newsletter APIs

const getAllNewsletters = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/publication/get-all-newsletters`);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error fetching newsletters:", error);
        return { status: error.response?.status, data: error.response?.data };
    }
}

const addNewsletter = async (newsletterData: FormData) => {
    try {
        // console.log("Newletter Data: ", newsletterData);
        
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/admin/publication/add-newsletter`, 
            newsletterData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error adding newsletter:", error);
        return { status: error.response?.status, data: error.response?.data };
    }
}

const deleteNewsletter = async (id: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/admin/publication/delete-newsletter/${id}`,
            {
                withCredentials: true
            }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error deleting newsletter:", error);
        return { status: error.response?.status, data: error.response?.data };
    }
}

const updateNewsletter = async (id: string, newsletterData: FormData) => {
    try {
        // console.log("Newletter Data: ", newsletterData);
        // console.log("ID: ", id);
        
        const response = await axios.put(
            `${import.meta.env.VITE_BASE_URL}/admin/publication/update-newsletter/${id}`,
            newsletterData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error updating newsletter:", error);
        return { status: error.response?.status, data: error.response?.data };
    }
}


// Journal APIs

const getAllJournals = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/publication/get-all-journals`);
        // console.log('Response: ', response.data);
        
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error fetching journals:", error);
        return { status: error.response?.status, data: error.response?.data };
    }
}

const addJournal = async(journalData: FormData) => {
    try {
        // console.log("Journal Data: ", journalData);
        
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/admin/publication/add-journal`, 
            journalData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error adding journal:", error);
        return { status: error.response?.status, data: error.response?.data };
    }
}

const updateJournal = async(id: String, journalData: FormData) => {
    try {
        // console.log("Journal Data: ", journalData);
        // console.log("ID: ", id);
        
        const response = await axios.put(
            `${import.meta.env.VITE_BASE_URL}/admin/publication/update-journal/${id}`,
            journalData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error updating journal:", error);
        return { status: error.response?.status, data: error.response?.data };
    }
}

const deleteJournal = async(id: String) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/admin/publication/delete-journal/${id}`,
            {
                withCredentials: true
            }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error deleting journal:", error);
        return { status: error.response?.status, data: error.response?.data };
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
    updatePodcast,
    getAllNewsletters,
    addNewsletter,
    deleteNewsletter,
    updateNewsletter,
    getAllJournals,
    addJournal,
    updateJournal,
    deleteJournal
}