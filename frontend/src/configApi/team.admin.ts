// team.admin.ts
import axios, {type AxiosResponse} from 'axios';

const getAllTeamMembers = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/aboutUs/getAllTeamMembers`);
        if(response.status === 200){
            return {status: response.status, data: response.data};
        }else{
            return {status: response.status, error: response.data};
        }
    } catch (error) {
        console.log(error);
        return {status: error.status, error: error.response.data};
    }
}

const addTeamMember = async (formData: FormData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/admin/aboutUs/addTeamMember`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log("Response: ", response);
        if (response.status === 201) {
            return { status: response.status, data: response.data };
        } else {
            return { status: response.status, error: response.data };
        }
    } catch (error: any) {
        console.error("Error adding team member:", error);
        return {
            status: error.response?.status || 500,
            error: error.response?.data || { message: 'Failed to add team member' },
        };
    }
};

const updateTeamMember = async (id: string, formData: FormData) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BASE_URL}/admin/aboutUs/updateTeamMember/${id}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log("Update Response: ", response);
        if (response.status === 200) {
            return { status: response.status, data: response.data };
        } else {
            return { status: response.status, error: response.data };
        }
    } catch (error: any) {
        console.error("Error updating team member:", error);
        return {
            status: error.response?.status || 500,
            error: error.response?.data || { message: 'Failed to update team member' },
        };
    }
};

const deleteTeamMember = async (id: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/admin/aboutUs/deleteTeamMember/${id}`,
            {
                withCredentials: true,
            }
        );

        console.log("Delete Response: ", response);
        if (response.status === 200) {
            return { status: response.status, data: response.data };
        } else {
            return { status: response.status, error: response.data };
        }
    } catch (error: any) {
        console.error("Error deleting team member:", error);
        return {
            status: error.response?.status || 500,
            error: error.response?.data || { message: 'Failed to delete team member' },
        };
    }
};

export { getAllTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember };