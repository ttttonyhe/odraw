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

const Login = (contextProps) => {
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
              &nbsp;&nbsp;提示
            </h2>
            <p>
              欢迎使用第九届「挑战杯·中国联通」安徽省大学生创业计划竞赛抽签平台。用户名与初始密码已经发布。
              <br />
              <br />
              请切换并使用<b> Chrome/极速内核 </b>使用本平台。
            </p>
          </div>
          <div className="odraw-login-notice-copyright">
            <p>安徽工程大学团委</p>
          </div>
        </div>
        <div className="odraw-login-form">
          <h2>账户登录</h2>
          <p>第九届「挑战杯·中国联通」安徽省大学生创业计划竞赛</p>
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

export default Login;
