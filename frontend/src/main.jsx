import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {configureStore} from '@reduxjs/toolkit'
import {Provider} from "react-redux"
import App from './App.jsx'
import notificationReducer from './reducers/notificationreducer.js'

const store = configureStore({
  reducer: {
    notification: notificationReducer
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </StrictMode>,
)
