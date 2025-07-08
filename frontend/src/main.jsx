import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import router from './router.jsx';
import App from './App.jsx'
 import { UserProvider } from "./context/UserContext.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
     <RouterProvider router={router} />
     </UserProvider>
  </StrictMode>,
)
