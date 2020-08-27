import React from "react";
import currentUserNameContext from "../utils/currentUserNameContext";
import { withRouter } from "next/router";
import Link from "next/link";
import { LoginOutlined } from "@ant-design/icons";
import LogOut from "../utils/logoutAnywhere";

// 页面顶部
const Header = ({ router }) => {
  // 读取 Context
  const currentUserName = React.useContext(currentUserNameContext);
  const [logOutStatus, setLogOutStatus] = React.useState<boolean>(false);
  // 切换菜单项函数
  const handleSwitchItem = (key: string) => {
    router.push(key);
  };
  // 登出函数
  const userLogout = () => {
    // 渲染 logout 组件
    setLogOutStatus(true);
  };
  return (
    <div className="odraw-header-div">
      <Link href="/">
        <div className="odraw-header-logo">
          <img src="https://static.ouorz.com/match_logo.png" />
        </div>
      </Link>
      <div className="odraw-header-title">
        <h1>赛事抽签平台</h1>
      </div>
      <div className="odraw-header-items">
        <Link href="/">
          <div
            className={
              "odraw-header-item-home " +
              (router.pathname === "/" ? "odraw-header-item-current" : "")
            }
            onClick={() => {
              handleSwitchItem("/");
            }}
          >
            <a>首页</a>
          </div>
        </Link>
        {currentUserName ? (
          <div className="odraw-header-item-logout" onClick={userLogout}>
            <a
              className={"in " + (currentUserName.length === 4 ? "in-four" : "")}
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
        ) : (
          <Link href="/login">
            <div
              className={
                "odraw-header-item-login " +
                (router.pathname === "/login"
                  ? "odraw-header-item-current"
                  : "")
              }
              onClick={() => {
                handleSwitchItem("/login");
              }}
            >
              <a>账户登录</a>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default withRouter(Header);
