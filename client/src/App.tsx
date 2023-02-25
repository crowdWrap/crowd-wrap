import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'

//layout

import RootLayout from './layouts/rootLayout'

//pages

import HomePage from './pages/homePage'
import LoginForm from './pages/loginForm'
import SignupForm from './pages/signupForm'
import LoggedIn from './pages/loggedIn'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<HomePage/>}></Route>
      <Route path='/register'element={<SignupForm/>}></Route>
      <Route path='/login'element={<LoginForm/>}></Route>
      <Route path='/profile' element={<LoggedIn/>}></Route>
      <Route path='/logout' element={<RootLayout/>}></Route>
    </Route>
  )
)

export default function App() {


  return (
    <RouterProvider router={router}/>
  )
} 