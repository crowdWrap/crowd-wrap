import { GoogleLogin } from "@react-oauth/google";
// eslint-disable-next-line
import { useNavigate } from "react-router-dom";

export default function SignInGoogle() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-restricted-globals
  const urlParams = new URLSearchParams(location.search);
  const redirect = urlParams.get("redirect");
  const succesfulSignIn = async (credentialResponse: any) => {
    try {
      const credential = JSON.stringify({
        credential: credentialResponse.credential,
      });

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credential,
      }).then(async (response) => {
        const newResponse = await response.json();
        // eslint-disable-next-line
        if (newResponse.message == "Needs username") {
          navigate("/register/setUsername");
        } else if (response.ok) {
          if (
            redirect &&
            !redirect.startsWith("http://") &&
            !redirect.startsWith("https://")
          ) {
            window.location.replace(redirect);
            return;
          }
          navigate("/profile");
        } else {
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
