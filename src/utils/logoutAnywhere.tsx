import React from "react";
import { reactLocalStorage } from "reactjs-localstorage";

// 登出组件
const LogOut = () => {
  React.useEffect(() => {
    reactLocalStorage.remove("odrawUser");
    reactLocalStorage.remove("odrawUserName");
    window.location.reload();
  });
  return <div></div>;
};
export default LogOut;
