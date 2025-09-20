import axios from 'axios'
const baseurl = 'http://localhost:3001/api/blog'

let token = null
const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = async() => {
    const response = await axios.get(baseurl)
    return response.data
}

const create = async(newObject) => {
    const config = {
        headers: {Authorization: token}
    }

    const response = await axios.post(baseurl, newObject, config)
    return response.data
}

const update = async(id, newObject) => {
    const response = await axios.put(`${baseurl}/${id}`, newObject)
    return response.data
}

const deleteBlog = async(id) => {
    const config = {
        headers: {Authorization: token}
    }
    const response = await axios.delete(`${baseurl}/${id}`, config)
    return response.data
}

export default {getAll, create, setToken, update, deleteBlog}