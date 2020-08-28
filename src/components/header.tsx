import React from "react";
import { withRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
const User = dynamic(
  () => {
    return import("../components/user");
  },
  { ssr: false }
);
import Head from 'next/head'

// 页面顶部
const Header = ({ router }) => {
  // 切换菜单项函数
  const handleSwitchItem = (key: string) => {
    router.push(key);
  };
  return (
    <div className="odraw-header-div">
      <Head>
        <title>ODraw 抽签平台</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="https://static.ouorz.com/odraw_ico.ico" id="favicon" type="image/vnd.microsoft.icon" />
      </Head>
      <Link href="/">
        <div className="odraw-header-logo">
          <img src="https://static.ouorz.com/odraw_demo_logo.png" />
        </div>
      </Link>
      <div className="odraw-header-title">
        <h1>抽签平台</h1>
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
        <User />
      </div>
    </div>
  );
};

export default withRouter(Header);
