import axios from "axios";
const baseurl = 'http://localhost:3001/api/user'

const getUser = async() => {
    const response = await axios.get(baseurl)
    return response.data
}

const getUserById = async(id) => {
    const response = await axios.get(`${baseurl}/${id}`)
    return response.data
}


export default {getUser, getUserById}

