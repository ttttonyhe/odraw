import "antd/dist/antd.min.css";
import React from "react";
import { NameProvider } from "../utils/currentUserNameContext";
import { JWTProvider } from "../utils/currentUserJWTContext";
import Header from "../components/header";
import Footer from "../components/footer";
import "../assets/main.scss";

const jwt =
  typeof window !== "undefined" ? window.localStorage.getItem("odrawUser") : "";
const name =
  typeof window !== "undefined"
    ? window.localStorage.getItem("odrawUserName")
    : "";

function MyApp({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = React.useState<string>(name);
  const [currentJWT, setCurrentJWT] = React.useState<string>(jwt);
  return (
    <NameProvider value={currentUser}>
      <JWTProvider value={currentJWT}>
        <Header />
        <Component
          setCurrentUser={setCurrentUser}
          setCurrentJWT={setCurrentJWT}
          {...pageProps}
        />
        <Footer />
      </JWTProvider>
    </NameProvider>
  );
}

export default MyApp;
