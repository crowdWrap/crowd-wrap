import { Flex } from "@chakra-ui/react";
import { useAuth } from "../src/hooks/authContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// const LoadingScreen = () => (
//   <Flex
//     width={"100vw"}
//     height={"100vh"}
//     justifyContent={"center"}
//     alignItems={"center"}
//   >
//     <h1>Loading...</h1>
//   </Flex>
// );

export default function RequiresAuth() {
  const { authed, loading } = useAuth();
  let location = useLocation();

  console.log("Auth loading: ", loading);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  if (!loading && !authed) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return <Outlet />;
}
