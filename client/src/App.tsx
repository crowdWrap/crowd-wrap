import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/homePage";
import LoginForm from "./pages/form/loginForm";
import SignupForm from "./pages/form/signupForm";
import SetUsername from "./pages/form/setUsername";
import Events from "./pages/events";
import TheEvent from "./components/innerEvents/innerEvent";
import EventInvite from "./pages/eventInvite";
import RootLayout from "./layouts/layout";
import RequiresAuth from "./protectRoute";
import InnerProtection from "./components/innerEvents/protectInnerEvent";
import Settings from "./pages/settings";
import ForgotPassword from "./pages/forgotPassword";
import Feed from "./pages/feed";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/login/forgot" element={<ForgotPassword />} />
      <Route path="/profile/setUsername" element={<SetUsername />} />
      <Route path="/events/invite/:link" element={<EventInvite />} />
      <Route element={<RequiresAuth />}>
        <Route path="/settings" element={<Settings />} />
        <Route path="/events" element={<Events />}></Route>

        <Route
          path="/events/:id"
          element={
            <InnerProtection>
              <TheEvent />
            </InnerProtection>
          }
        />
        <Route path="/feed" element={<Feed />}></Route>
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
