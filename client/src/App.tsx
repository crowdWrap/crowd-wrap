import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/homePage";
import LoginForm from "./pages/form/loginForm";
import SignupForm from "./pages/form/signupForm";
import LoggedIn from "./pages/loggedIn";
import SetUsername from "./pages/form/setUsername";
import Events from "./pages/events";
import TheEvent from "./components/innerEvents/innerEvent";
import Dashboard from "./pages/dashboard";
import EventInvite from "./pages/eventInvite";
import RootLayout from "./layouts/layout";
import RequiresAuth from "./protectRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/profile/setUsername" element={<SetUsername />} />
      <Route element={<RequiresAuth />}>
        <Route path="/profile" element={<LoggedIn />} />
        <Route path="/events" element={<Events />}></Route>
        <Route path="/events/invite/:link" element={<EventInvite />} />
        <Route path="/events/:id" element={<TheEvent />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
