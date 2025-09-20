import { useEffect } from "react";
import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blog'



const blogSlice = createSlice({
    name: 'blog',
    initialState: [],
    reducers: {
        setBlog (state, action) {
            return action.payload
        },

        addBlog (state, action) {
            return state.push(action.payload)
        }
    }
})


export const {setBlog, addBlog} = blogSlice.actions
export default blogSlice.reducer

