import axios from "axios";

const getAllEvents = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/event/getAllEvents`);
        if(response.status === 200){
            return {status: response.status, data: response.data};
        }else{
            return {status: response.status, error: response.data};
        }
    } catch (error) {
        return {status: error.status, error: error.response.data};
    }
}

const addEvent = async(formData: FormData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/event/addEvent`, formData,{
            withCredentials: true
        });
        if(response.status === 201){
            return {status: response.status, data: response.data};
        }else{
            return {status: response.status, error: response.data};
        }
    } catch (error) {
        return {status: error.status, error: error.response.data};
    }
}

const updateEvent = async(_id: string, formData: FormData) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/event/updateEvent/${_id}`, formData,{
            withCredentials: true
        });
        if(response.status === 200){
            return {status: response.status, data: response.data};
        }else{
            return {status: response.status, error: response.data};
        }
    } catch (error) {
        return {status: error.status, error: error.response.data};
    }
}

const deleteEvent = async(_id: string) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/event/deleteEvent/${_id}`,{
            withCredentials: true
        });
        if(response.status === 200){
            return {status: response.status, data: response.data};
        }else{
            return {status: response.status, error: response.data};
        }
    } catch (error) {
        return {status: error.status, error: error.response.data};
    }
}

export {
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent
}