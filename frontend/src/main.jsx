import { StrictMode, useReducer } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {configureStore} from '@reduxjs/toolkit'
import {Provider} from "react-redux"
import App from './App.jsx'
import notificationReducer from './reducers/notificationreducer.js'
import blogReducer from './reducers/blogReducer.js'
import userReducer from './reducers/userReducer.js'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blog: blogReducer,
    user: userReducer
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </StrictMode>,
)
