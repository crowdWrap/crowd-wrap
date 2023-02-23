import {createBrowserRouter, createRoutesFromElements, NavLink, Link, Route, RouterProvider} from 'react-router-dom'

//layout
import RootLayout from './layouts/rootLayout'

//pages

import HomePage from './pages/homePage'
import LoginForm from './pages/loginForm'
import SignupForm from './pages/signupForm'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<HomePage/>}></Route>
      <Route path='/register'element={<SignupForm/>}></Route>
      <Route path='/login'element={<LoginForm/>}></Route>
    </Route>
  )
)

export default function App() {


  return (
    <RouterProvider router={router}/>
  )
} 