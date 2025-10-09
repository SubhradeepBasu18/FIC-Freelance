import axios, {type AxiosResponse} from "axios";

interface Event{
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    registrationUrl: string;
    type: string;
    icon: string;
    createdAt: string;
    updatedAt: string;

}

interface GetAllEventsResponse {
    status: number;
    data: Event[] | string; // Data can either be an array of events or an error message
}

const getAllEvents = async(): Promise<GetAllEventsResponse> => {
    try {
        const response : AxiosResponse<Event[]> = await axios.get(`${import.meta.env.VITE_BASE_URL}/event/getAllEvents`)
        return {status: 200, data: response.data}
    } catch (error: any) {
        console.log(error)
        return { status: error.response.status, data: error.response.data };
    }
}

export {getAllEvents}