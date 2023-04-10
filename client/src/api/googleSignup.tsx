import { GoogleLogin } from "@react-oauth/google";
// eslint-disable-next-line
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function SignUpGoogle() {
  const navigate = useNavigate();

  const succesfulSignIn = async (credentialResponse: any) => {
    try {
      const credential = JSON.stringify({
        credential: credentialResponse.credential,
      });

      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credential,
      }).then(async (response) => {
        if (response.ok) {
          navigate("/login");
        } else {
          const newResponse = await response.json();
          console.log(newResponse.message);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <GoogleLogin
      onSuccess={succesfulSignIn}
      onError={() => {
        console.log("Failed");
      }}
    />
  );
}
