import axios from 'axios'

const login = async(credential) => {
    const user = await axios.post('/api/login', credential)
    return user.data
}

export default {login}