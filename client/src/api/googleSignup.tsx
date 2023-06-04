import { Button, useToast } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function SignUpGoogle({ loading, setLoading }: any) {
  const navigate = useNavigate();
  const toast = useToast();

  const succesfulSignIn = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const credential = JSON.stringify({
        credential: credentialResponse.credential,
      });

      fetch("/register/googleOauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credential,
      }).then(async (response) => {
        const newResponse = await response.json();
        setLoading(false);
        if (response.ok) {
          toast({
            title: "Registration Succesful.",
            description: `${newResponse.message}`,
            status: "success",
            duration: 4000,
          });
          navigate("/login");
        } else {
          toast({
            title: "Registration failed.",
            description: `${newResponse.message}`,
            status: "error",
            duration: 4000,
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {loading ? (
        <Button
          isLoading
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
            text="signup_with"
            onError={() => {
              console.log("Failed");
            }}
          />
        </Button>
      ) : (
        <Button
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
            text="signup_with"
            onError={() => {
              console.log("Failed");
            }}
          />
        </Button>
      )}
    </>
  );
}
