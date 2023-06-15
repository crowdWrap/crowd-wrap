import { useAuth } from "../src/hooks/authContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequiresAuth() {
  const { authed, loading, user } = useAuth();
  let location = useLocation();
  if (!loading && !authed) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (user && !user.usernameSet) {
    return <Navigate to="/profile/setUsername" />;
  }

  return <Outlet />;
}
