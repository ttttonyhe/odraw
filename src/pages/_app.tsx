import "antd/dist/antd.min.css";
import React from "react";
import { Provider } from "../utils/currentUserContext";

function MyApp({ Component, pageProps }) {
  const [currentUserName, setCurrentUserName] = React.useState<string>("");
  return (
    <Provider value={currentUserName}>
      <Component setCurrentUserName={setCurrentUserName} {...pageProps} />
    </Provider>
  );
}

export default MyApp;
