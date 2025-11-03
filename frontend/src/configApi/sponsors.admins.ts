import axios from "axios"

export const getAllSponsors = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sponsor/`)
        console.log(response.data)
        return {status: response.status, data: response.data}
    } catch (error:any) {
        console.log(error)
        return {status: error.response?.status, data: error.response?.data}
    }
}

export const addNewSponsor = async(name: string, image: File) => {
    try {
        console.log('name', name)
        console.log('image', image)
        
        // Create FormData object for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);
        
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/sponsor/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        })
        console.log(response.data)
        return {status: response.status, data: response.data}
    } catch (error:any) {
        console.log(error)
        return {status: error.response?.status, data: error.response?.data}
    }
}

export const deleteSponsor = async(id: string) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/sponsor/${id}`, {
            withCredentials: true
        })
        console.log(response.data)
        return {status: response.status, data: response.data}
    } catch (error:any) {
        console.log(error)
        return {status: error.response?.status, data: error.response?.data}
    }
}

