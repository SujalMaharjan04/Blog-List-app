import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {  NotificationContextProvider, UserContextProvider }from './context.jsx'
import {BrowserRouter as Router} from 'react-router-dom'
import App from './App.jsx'

const query = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <NotificationContextProvider>
        <UserContextProvider>
          <QueryClientProvider client = {query} >
            <App />
          </QueryClientProvider>
        </UserContextProvider>
      </NotificationContextProvider>
    </Router>
  </StrictMode>,
)
