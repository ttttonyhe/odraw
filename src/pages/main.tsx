import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import Qs from "qs";
import { reactLocalStorage } from "reactjs-localstorage";
import React from "react";

const Main = () => {
  const [JWTToken, setJWTToken] = React.useState<string>(
    reactLocalStorage.get("odrawUser", true)
  );
  const [UserName, setUserName] = React.useState<string>(
    reactLocalStorage.get("odrawUserName", true)
  );
  const props = {
    name: "recordsExcel",
    action: "http://localhost:3344/uploadRecords",
    onChange(info: any) {
      console.log(info.file.response);
    },
    headers: {
      Authorization: JWTToken,
    },
  };
  const userProps = {
    name: "usersExcel",
    action: "http://localhost:3344/uploadUsers",
    onChange(info: any) {
      console.log(info.file.response);
    },
    headers: {
      Authorization: JWTToken,
    },
  };
  const sendPost = () => {
    axios({
      method: "post",
      url: "http://localhost:3344/drawRecordsByCate",
      data: Qs.stringify({
        type: "普通高校",
        name: "文化创意和区域合作",
      }),
      headers: {
        Authorization: JWTToken,
      },
    })
      .then((res) => {
        console.log(res.data.msg);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const loginPost = () => {
    axios
      .post(
        "http://localhost:3344/userLogin",
        Qs.stringify({
          username: "安徽新华学院",
          password: "666666",
        })
      )
      .then((res) => {
        reactLocalStorage.set("odrawUser", res.data.token);
        setJWTToken(reactLocalStorage.get("odrawUser", true));
        reactLocalStorage.set("odrawUserName", res.data.name);
        setUserName(reactLocalStorage.get("odrawUserName", true));
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const dataGet = () => {
    axios({
      method: "get",
      url:
        "http://localhost:3344/getRecordsBySchool?" +
        Qs.stringify({
          name: "安徽新华学院",
          type: "普通高校",
        }),
      headers: {
        Authorization: JWTToken,
      },
    })
      .then((res) => {
        console.log(res.data.records);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const modifyPost = () => {
    axios({
      method: "post",
      url: "http://localhost:3344/userModify",
      data: Qs.stringify({
        username: "安徽新华学院",
        password: "666666",
        newPassword: "666666",
      }),
      headers: {
        Authorization: JWTToken,
      },
    })
      .then((res) => {
        console.log(res.data.msg);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const logOut = () => {
    reactLocalStorage.remove("odrawUser");
    reactLocalStorage.remove("odrawUserName");
    setJWTToken(reactLocalStorage.get("odrawUser", true));
    setUserName(reactLocalStorage.get("odrawUserName", true));
  };
  return (
    <div>
      <Upload {...props}>
        <Button>
          <UploadOutlined /> Click to Upload Records
        </Button>
      </Upload>
      <br />
      <Upload {...userProps}>
        <Button>
          <UploadOutlined /> Click to Upload Users
        </Button>
      </Upload>
      <br />
      <Button
        onClick={() => {
          sendPost();
        }}
      >
        POST
      </Button>
      <br />
      <Button
        onClick={() => {
          loginPost();
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          logOut();
        }}
      >
        Log out
      </Button>
      <br />
      <p>Current JWT: {JWTToken}</p>
      <p>Current User: {UserName}</p>
      <br />
      <Button
        onClick={() => {
          dataGet();
        }}
      >
        Get Data
      </Button>
      <br />
      <Button
        onClick={() => {
          modifyPost();
        }}
      >
        Modify
      </Button>
    </div>
  );
};

export default Main;
