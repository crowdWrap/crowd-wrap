import { GoogleLogin } from "@react-oauth/google";
// eslint-disable-next-line
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";
import { Button, useToast } from "@chakra-ui/react";
import { constants } from "../constants";

export default function SignInGoogle({ loading, setLoading }: any) {
  const { setAuthed, setUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const succesfulSignIn = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const credential = JSON.stringify({
        credential: credentialResponse.credential,
      });

      fetch("/login/googleOauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credential,
      }).then(async (response) => {
        const newResponse = await response.json();
        setLoading(false);
        if (newResponse.message === "Needs username") {
          setAuthed(true);
          toast({
            title: "Please set username.",
            status: "warning",
            duration: constants.toastDuration,
          });
          navigate("/register/setUsername");
        } else if (response.ok) {
          toast({
            title: "Login Succesful.",
            description: `${newResponse.message}`,
            status: "success",
            duration: constants.toastDuration,
          });
          setUser(newResponse.user);
          setAuthed(true);
          setLoading(false);
        } else {
          toast({
            title: "Login failed.",
            description: `${newResponse.message}.`,
            status: "error",
            duration: constants.toastDuration,
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error.",
        description: `${error}.`,
        status: "error",
        duration: constants.toastDuration,
      });
    }
  };
  return (
    <>
      <Button
        isDisabled={loading ? true : false}
        colorScheme="palevioletred"
        style={{
          border: "2px solid palevioletred",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      >
        <GoogleLogin
          onSuccess={succesfulSignIn}
          theme="filled_blue"
          logo_alignment="center"
          shape="square"
          size="large"
          type="icon"
          text="signin_with"
          onError={() => {
            console.log("Failed");
          }}
        />
      </Button>
    </>
  );
}
