import { useEffect } from "react";
import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blog'



const blogSlice = createSlice({
    name: 'blog',
    initialState: [],
    reducers: {
        newBlog (state, action) {
            return action.payload
        },

        addBlog (state, action) {
            state.push(action.payload)
        },

        updatedBlog(state, action) {
            const updatedBlog = action.payload

            return state.map(b => b.id === updatedBlog.id ? updatedBlog : b)
        },

        removeBlog(state, action) {
            return state.filter(b => b.id !== action.payload)
        }
    }
})


export const {newBlog, addBlog, updatedBlog, removeBlog} = blogSlice.actions
export default blogSlice.reducer

