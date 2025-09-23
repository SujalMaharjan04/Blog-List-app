import axios from "axios";
const baseurl = 'http://localhost:3001/api/user'

const getUser = async() => {
    const response = await axios.get(baseurl)
    return response.data
}


export default {getUser}

