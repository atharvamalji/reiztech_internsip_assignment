import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import App from './App'
import Country from './pages/Country'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "country/:countryCode",
    element: <Country />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
