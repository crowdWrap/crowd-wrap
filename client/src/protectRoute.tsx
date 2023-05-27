import { useAuth } from "../src/hooks/authContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequiresAuth() {
  const { authed } = useAuth();
  let location = useLocation();

  if (!authed) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return <Outlet />;
}
