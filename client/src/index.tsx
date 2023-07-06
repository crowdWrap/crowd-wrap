import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css_group/index.module.css";
import App from "./App";
import AuthProvider from "./hooks/authContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};
export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "Inter, Roboto, sans-serif",
      },
    },
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
    Toast: {
      baseStyle: {
        fontFamily: "Inter, sans-serif",
        ".chakra-alert__title": {
          fontWeight: "900",
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "Inter, sans-serif",
      },
    },
    Text: {
      baseStyle: {
        fontFamily: "Inter, sans-serif",
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const initialOptions = {
  clientId: `${process.env.REACT_APP_PAYPAL_CLIENT_ID}`,
  components: "buttons",
  currency: "USD",
};

root.render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChakraProvider>
    </PayPalScriptProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
