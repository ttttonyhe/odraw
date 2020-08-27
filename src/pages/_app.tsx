import "antd/dist/antd.min.css";
import React from "react";
import { NameProvider } from "../utils/currentUserNameContext";
import { JWTProvider } from "../utils/currentUserJWTContext";
import Header from "../components/header";
import Footer from "../components/footer";
import "../assets/main.scss";

function MyApp({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = React.useState<string>();
  const [currentJWT, setCurrentJWT] = React.useState<string>();
  React.useEffect(() => {
    setCurrentUser(window.localStorage.getItem("odrawUserName"));
    setCurrentJWT(window.localStorage.getItem("odrawUser"));
  });
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
