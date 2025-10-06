import axios, {type AxiosResponse} from 'axios'

interface Album{
    _id: string;
    name: string;
    coverImage: string;
    mediaItems: string[]
    isPublic: boolean
    createdAt: string
    updatedAt: string
}

interface GetAllAlbumsResponse {
    status: number;
    data: Album[] | string; // Data can either be an array of events or an error message
}

const getAllAlbums = async(): Promise<GetAllAlbumsResponse> => {
    try {
        const response: AxiosResponse<Album[]> = await axios.get(`${import.meta.env.VITE_BASE_URL}/gallery/get-all-albums`)
        console.log(response.data)
        return {status: 200, data: response.data}
    } catch (error:any) {
        console.log(error)
        return {status: error.response.status, data: error.response.data}
    }
}

const getAllImages = async() => {
    try {
        const response: AxiosResponse<String[]> = await axios.get(`${import.meta.env.VITE_BASE_URL}/gallery/get-all-images`)
        console.log(response.data)
        return {status: 200, data: response.data}
    } catch (error:any) {
        console.log(error)
        return {status: error.response.status, data: error.response.data}
    }
}

export { getAllAlbums, getAllImages }
