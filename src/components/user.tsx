import Link from "next/link";
import { LoginOutlined } from "@ant-design/icons";
import currentUserNameContext from "../utils/currentUserNameContext";
import LogOut from "../utils/logoutAnywhere";
import Router from "next/router";
import React from "react";

const User = () => {
  // 读取 Context
  const currentUserName = React.useContext(currentUserNameContext);
  const [logOutStatus, setLogOutStatus] = React.useState<boolean>(false);
  // 登出函数
  const userLogout = () => {
    // 渲染 logout 组件
    setLogOutStatus(true);
  };
  // 切换菜单项函数
  const handleSwitchItem = (key: string) => {
    Router.push(key);
  };
  if (currentUserName) {
    return (
      <div className="odraw-header-item-logout" onClick={userLogout}>
        <a
          className={
            "in " +
            (currentUserName
              ? currentUserName.length === 4
                ? "in-four"
                : ""
              : "")
          }
        >
          {currentUserName}
        </a>
        <a className="out">
          {currentUserName.length > 4 ? (
            <span>
              <LoginOutlined />
              &nbsp;
            </span>
          ) : (
            ""
          )}
          账户登出
        </a>
        {logOutStatus ? <LogOut /> : ""}
      </div>
    );
  } else {
    return (
      <Link href="/login">
        <div
          className={
            "odraw-header-item-login " +
            (Router.pathname === "/login" ? "odraw-header-item-current" : "")
          }
          onClick={() => {
            handleSwitchItem("/login");
          }}
        >
          <a>账户登录</a>
        </div>
      </Link>
    );
  }
};

export default User;
