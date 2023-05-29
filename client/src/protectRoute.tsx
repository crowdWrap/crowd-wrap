import { Flex } from "@chakra-ui/react";
import { useAuth } from "../src/hooks/authContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequiresAuth() {
  const { authed, loading } = useAuth();
  let location = useLocation();

  if (!loading && !authed) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return <Outlet />;
}
