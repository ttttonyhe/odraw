import React from "react";
import axios from "axios";
import Qs from "qs";
import { reactLocalStorage } from "reactjs-localstorage";
import { Input, notification } from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  KeyOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Router from "next/router";

const openNotificationWithIcon = (type: string, des: string) => {
  notification[type]({
    message: "提示",
    description: des,
  });
};

const LoginMain = ({ router, ...contextProps }) => {
  const [userName, setUserName] = React.useState<string>("");
  const [passWord, setPassWord] = React.useState<string>("");
  const [loginStatus, setLoginStatus] = React.useState<boolean>(false);

  const doLoginAction = () => {
    setLoginStatus(true);
    axios
      .post(
        "https://node.ouorz.com/userLogin",
        Qs.stringify({
          username: userName,
          password: passWord,
        })
      )
      .then((res) => {
        if (res.data.token) {
          if (typeof window !== "undefined") {
          reactLocalStorage.set("odrawUser", res.data.token);
          reactLocalStorage.set("odrawUserName", res.data.name);
          }
          contextProps.setCurrentUser(reactLocalStorage.get("odrawUserName"));
          contextProps.setCurrentJWT(reactLocalStorage.get("odrawUser"));
          if (typeof window !== "undefined") {
          Router.push("/");
          }
        } else {
          setLoginStatus(false);
          openNotificationWithIcon("error", "用户名或密码可能其一或全部不正确");
        }
      })
      .catch(() => {
        setLoginStatus(false);
        openNotificationWithIcon("error", "用户名或密码可能其一或全部不正确");
      });
  };

  return (
    <div>
      <div className="odraw-login-div">
        <div className="odraw-login-notice">
          <div className="odraw-login-notice-div">
            <h2>
              <InfoCircleOutlined />
              &nbsp;&nbsp;演示账户
            </h2>
            <p>
              ODraw 平台抽签数据需先行由管理员完成抽签进程，用户方可查看抽签号
              <br/><br/>
              <b>管理员账户</b>
              <br/>
              用户名：odrawAdmin
              <br/>
              密码：666666
              <br/><br/>
              <b>示例用户</b>
              <br/>
              用户名：中国科学技术大学
              <br/>
              密码：666666
            </p>
          </div>
        </div>
        <div className="odraw-login-form">
          <h2>账户登录</h2>
          <p>ODraw 抽签平台演示站点</p>
          <div className="odraw-login-input-div">
            <div>
              <Input
                size="large"
                type="text"
                placeholder="用户名"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                prefix={<UserOutlined />}
                allowClear={true}
                onPressEnter={doLoginAction}
              />
            </div>
            <div>
              <Input
                size="large"
                type="password"
                placeholder="密码"
                onChange={(e) => {
                  setPassWord(e.target.value);
                }}
                prefix={<KeyOutlined />}
                allowClear={true}
                onPressEnter={doLoginAction}
              />
            </div>
          </div>
          <div>
            <button onClick={doLoginAction}>
              {loginStatus ? (
                <span>
                  <LoadingOutlined />
                  &nbsp;正在登陆
                </span>
              ) : (
                "登录账户"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginMain;
