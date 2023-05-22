import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//layout

import RootLayout from "./layouts/rootLayout";

//pages

import HomePage from "./pages/homePage";
import LoginForm from "./pages/loginForm";
import SignupForm from "./pages/signupForm";
import LoggedIn from "./pages/loggedIn";
import SetUsername from "./pages/setUsername";
import Events from "./pages/events";
import TheEvent from "./components/innerEvents/innerEvent";
import Dashboard from "./pages/dashboard";
import EventInvite from "./pages/eventInvite";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />}></Route>
      <Route path="/register" element={<SignupForm />}></Route>
      <Route path="/login" element={<LoginForm />}></Route>
      <Route path="/profile" element={<LoggedIn />}></Route>
      <Route path="/logout" element={<RootLayout />}></Route>
      <Route path="/register/setUsername" element={<SetUsername />}></Route>
      <Route path="/events" element={<Events />}></Route>
      <Route path="/events/:id" element={<TheEvent />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/events/invite/:link" element={<EventInvite />}></Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
