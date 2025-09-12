import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import App from './components/App'
import Login from "./components/Login"
import Register from "./components/Register"
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    Component: App
  },
  {

    path: "/register",
    Component: Register
  },
  {
    path: "/login",
    Component: Login
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="h-full w-full flex flex-row justify-center items-center drop-shadow-md">
      {/* <App /> */}
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
)
