import axios from "axios";

export const getAll = () => {
    return axios.get('http://localhost:3001/api/blog').then(response => response.data)
}