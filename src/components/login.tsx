import React from "react";
import axios from "axios";
import Qs from "qs";
import { reactLocalStorage } from "reactjs-localstorage";
import { Input, notification } from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { withRouter } from "next/router";

const openNotificationWithIcon = (type: string, des: string) => {
  notification[type]({
    message: "提示",
    description: des,
  });
};

const LoginMain = ({ router, ...contextProps }) => {
  const [userName, setUserName] = React.useState<string>("");
  const [passWord, setPassWord] = React.useState<string>("");

  const doLoginAction = () => {
    axios
      .post(
        "http://localhost:3344/userLogin",
        Qs.stringify({
          username: userName,
          password: passWord,
        })
      )
      .then((res) => {
        if (res.data.token) {
          reactLocalStorage.set("odrawUser", res.data.token);
          reactLocalStorage.set("odrawUserName", res.data.name);
          contextProps.setCurrentUser(reactLocalStorage.get("odrawUserName"));
          contextProps.setCurrentJWT(reactLocalStorage.get("odrawUser"));
          router.push("/");
        } else {
          openNotificationWithIcon("error", "用户名或密码可能其一或全部不正确");
        }
      })
      .catch(() => {
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
              &nbsp;&nbsp;账户登入提示
            </h2>
            <p>
              欢迎使用第九届「挑战杯·中国联通」安徽省大学生创业计划竞赛抽签平台。账户初始登入用户名为 <b>学校全称(中文)</b>，密码为 <b>666666</b>。请在首次登入后立刻修改密码。
            </p>
          </div>
          <div className="odraw-login-notice-copyright">
            <p>&copy; 2020 安徽工程大学团委会</p>
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
            <button onClick={doLoginAction}>登录账户</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(LoginMain);
