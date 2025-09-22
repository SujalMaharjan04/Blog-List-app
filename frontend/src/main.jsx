import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { LikeContextProvider, NotificationContextProvider }from './context.jsx'
 
import App from './App.jsx'

const query = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationContextProvider>
      
        <QueryClientProvider client = {query} >
          <App />
        </QueryClientProvider>
      
    </NotificationContextProvider>
  </StrictMode>,
)
