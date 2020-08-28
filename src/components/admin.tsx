import axios from "axios";
import useSWR, { mutate } from "swr";
import Qs from "qs";
import React from "react";
import currentUserContext from "../utils/currentUserNameContext";
import currentUserJWTContext from "../utils/currentUserJWTContext";
import Router from "next/router";
import { Skeleton, Result, Modal, Button, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const Admin = () => {
  // 读取 Context
  const currentUserName = React.useContext(currentUserContext);
  const JWTToken = React.useContext(currentUserJWTContext);
  if (currentUserName && JWTToken) {
    // 栏目 State
    const [menuItem, setMenuItem] = React.useState<number>(1);
    // 对话框 State
    const [modalStatus, setModalStatus] = React.useState<boolean>(false);
    const [drawModalStatus, setDrawModalStatus] = React.useState<boolean>(
      false
    );
    // 分裂 Key State
    const [nowCate, setNowCate] = React.useState<string>("");
    const [nowType, setNowType] = React.useState<string>("");
    const [nowKey, setNowKey] = React.useState<string>("");
    // 密码数据
    const [oldPwd, setOldPwd] = React.useState<string>("");
    const [newPwd, setNewPwd] = React.useState<string>("");
    // 加载 state
    const [loadingStatus, setLoadingStatus] = React.useState<boolean>(true);

    // 获取数据
    const { data, error } = useSWR("https://node.ouorz.com/getAllCates", (url) =>
      axios({
        method: "get",
        url: url,
        headers: {
          Authorization: JWTToken,
        },
      }).then((res) => {
        return res.data.cates;
      })
    );

    // 提交 Key 设置
    const setKey = () => {
      if (nowKey) {
        axios({
          method: "post",
          url: "https://node.ouorz.com/setCateKey",
          data: Qs.stringify({
            name: nowCate,
            type: nowType,
            key: nowKey,
          }),
          headers: {
            Authorization: JWTToken,
          },
        })
          .then((res) => {
            if (res.data.code === 104) {
              mutate("https://node.ouorz.com/getAllCates");
              setModalStatus(false);
            }
          })
          .catch((err) => {
            alert("提交失败\n" + err);
          });
      } else {
        alert("标签不能为空");
      }
    };

    // 提交抽签请求
    const startDrawing = (cate, type, key) => {
      if (key) {
        setDrawModalStatus(true);
        axios({
          method: "post",
          url: "https://node.ouorz.com/drawRecordsByCate",
          data: Qs.stringify({
            name: cate,
            type: type,
          }),
          headers: {
            Authorization: JWTToken,
          },
        })
          .then((res) => {
            if (res.data.code === 104) {
              mutate("https://node.ouorz.com/getAllCates");
              setDrawModalStatus(false);
            }
          })
          .catch((err) => {
            alert("提交失败\n" + err);
          });
      } else {
        alert("该分类还未设置标签");
      }
    };

    // 开启 Key 设置
    const openKeySetting = (name, type, key) => {
      setNowCate(name);
      setNowType(type);
      setNowKey(key ? key : "");
      setModalStatus(true);
    };

    // 提交密码修改请求
    const postChangePwd = () => {
      axios({
        method: "post",
        url: "https://node.ouorz.com/userModify",
        data: Qs.stringify({
          username: currentUserName,
          password: oldPwd,
          newPassword: newPwd,
        }),
        headers: {
          Authorization: JWTToken,
        },
      })
        .then((res) => {
          if (res.data.code === 104) {
            alert("密码修改完成");
          } else {
            alert("旧密码错误");
          }
        })
        .catch((err) => {
          alert("旧密码错误");
        });
    };

    const startExporting = (name, type, status) => {
      if (status) {
        axios({
          method: "post",
          url: "https://node.ouorz.com/exportExcel",
          data: Qs.stringify({
            name: name,
            type: type,
          }),
          headers: {
            Authorization: JWTToken,
          },
        })
          .then((res) => {
            if (res.data.code === 104) {
              // 新窗口下载文件
              if (typeof document !== "undefined") {
                const url =
                  "https://node.ouorz.com/files/download/" +
                  res.data.file +
                  ".xlsx";
                let a = document.createElement("a");
                a.setAttribute("href", url);
                a.setAttribute("target", "_blank");
                document.body.appendChild(a);
                a.click();
              }
            } else {
              alert("导出错误");
            }
          })
          .catch((err) => {
            alert("导出服务错误");
          });
      } else {
        alert("抽签还未完成");
      }
    };

    // 上传配置
    const recordsProps = {
      accept: ".xlsx",
      name: "recordsExcel",
      action: "https://node.ouorz.com/uploadRecords",
      headers: {
        Authorization: JWTToken,
      },
    };
    const usersProps = {
      accept: ".xlsx",
      name: "usersExcel",
      action: "https://node.ouorz.com/uploadUsers",
      headers: {
        Authorization: JWTToken,
      },
    };

    setTimeout(() => {
      setLoadingStatus(false);
    }, 1000);

    return (
      <div className="odraw-container">
        {error ? (
          <Result status="500" title="500" subTitle="数据请求错误" />
        ) : !data || loadingStatus ? (
          <Skeleton active />
        ) : data.length > 1 ? (
          <div>
            <div className="odraw-container-top">
              <div className="odraw-container-top-div">
                <div className="odraw-container-top-info">
                  <h1>管理员面板</h1>
                  <p>抽奖平台管理员面板</p>
                </div>
              </div>
              <div className="odraw-container-top-menu">
                <div
                  className={
                    menuItem === 1 ? "odraw-container-top-menu-current" : ""
                  }
                  onClick={() => {
                    setMenuItem(1);
                  }}
                >
                  <a>分类列表</a>
                </div>
                <div
                  className={
                    menuItem === 2 ? "odraw-container-top-menu-current" : ""
                  }
                  onClick={() => {
                    setMenuItem(2);
                  }}
                >
                  <a>密码设置</a>
                </div>
                <div
                  className={
                    menuItem === 3 ? "odraw-container-top-menu-current" : ""
                  }
                  onClick={() => {
                    setMenuItem(3);
                  }}
                >
                  <a>数据导入</a>
                </div>
                <div
                  className={
                    menuItem === 4 ? "odraw-container-top-menu-current" : ""
                  }
                  onClick={() => {
                    setMenuItem(4);
                  }}
                >
                  <a>使用须知</a>
                </div>
              </div>
            </div>
            <Modal
              title="设置分类标签"
              visible={modalStatus}
              onCancel={() => {
                setModalStatus(false);
              }}
              footer={null}
            >
              <div className="odraw-admin-key-div">
                <h2>分类信息</h2>
                <p>名称：{nowCate}</p>
                <p>类型：{nowType}</p>
              </div>
              <Input
                addonBefore="分类标签"
                value={nowKey}
                placeholder={nowKey ? nowKey : "未设置"}
                onChange={(e) => {
                  setNowKey(e.target.value);
                }}
                className="odraw-admin-key-input"
              />
              <Button
                type="primary"
                className="odraw-admin-btn"
                onClick={() => {
                  setKey();
                }}
              >
                提交保存
              </Button>
            </Modal>
            <Modal
              title="抽签进行中"
              visible={drawModalStatus}
              onCancel={() => {
                setDrawModalStatus(false);
              }}
              footer={null}
            >
              <div className="odraw-admin-key-div">
                <h2>抽签已开始</h2>
                <p>请稍等，完成后将自动关闭弹窗</p>
              </div>
            </Modal>
            <div className="odraw-container-main">
              {menuItem === 1 ? (
                <div>
                  {data.map((item, index) => {
                    return (
                      <div
                        className={
                          "odraw-container-item " +
                          (index !== 0 &&
                          data[index]["cateType"] !==
                            data[index - 1]["cateType"]
                            ? "odraw-container-item-divide"
                            : "")
                        }
                        key={item.cateName + item.cateType}
                      >
                        <div>
                          <h3>{item.cateName}</h3>
                          <p>
                            <em>{item.cateType}</em>
                            <em>{item.cateKey ? item.cateKey : "NaN"}</em>
                          </p>
                        </div>
                        <div className="odraw-admin-key-btn">
                          <Button type="dashed">
                            标签&nbsp;|&nbsp;
                            <b>{item.cateKey ? item.cateKey : "未设置"}</b>
                          </Button>
                          <Button
                            type="default"
                            onClick={() => {
                              openKeySetting(
                                item.cateName,
                                item.cateType,
                                item.cateKey ? item.cateKey : ""
                              );
                            }}
                          >
                            设置标签
                          </Button>
                          <Button
                            type="default"
                            onClick={() => {
                              startExporting(
                                item.cateName,
                                item.cateType,
                                item.drawStatus
                              );
                            }}
                          >
                            数据导出
                          </Button>
                          {item.drawStatus ? (
                            <Button
                              type="default"
                              onClick={() => {
                                startDrawing(
                                  item.cateName,
                                  item.cateType,
                                  item.cateKey
                                );
                              }}
                            >
                              重新抽签
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              onClick={() => {
                                startDrawing(
                                  item.cateName,
                                  item.cateType,
                                  item.cateKey
                                );
                              }}
                            >
                              开始抽签
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : menuItem === 2 ? (
                <div>
                  <p className="odraw-container-pwd-notice">
                    管理员账户初始密码为 666666，请<b>务必</b>及时修改
                  </p>
                  <div className="odraw-container-pwd-input">
                    <Input
                      placeholder="旧密码"
                      onChange={(e) => {
                        setOldPwd(e.target.value);
                      }}
                    />
                    <Input
                      placeholder="新密码"
                      onChange={(e) => {
                        setNewPwd(e.target.value);
                      }}
                    />
                    <Button
                      type="primary"
                      onClick={() => {
                        postChangePwd();
                      }}
                    >
                      提交修改
                    </Button>
                  </div>
                </div>
              ) : menuItem === 3 ? (
                <div>
                  <div>
                    <Upload {...recordsProps}>
                      <Button>
                        <UploadOutlined /> 选择项目数据表格
                      </Button>
                    </Upload>
                    <br />
                    <Upload {...usersProps}>
                      <Button>
                        <UploadOutlined /> 选择用户数据表格
                      </Button>
                    </Upload>
                  </div>
                  <div className="odraw-admin-upload-notice">
                    <h3>注意事项</h3>
                    <p>完成上传后即为导入成功</p>
                    <br />
                    <h3>文件要求</h3>
                    <p>
                      只可上传 .xlsx
                      文件，该文件必须有且仅有一个名为「data」的工作表
                    </p>
                    <br />
                    <h3>项目数据表格格式要求</h3>
                    <ul>
                      <li>共 5 列</li>
                      <li>首行为标题，横向合并 5 个单元格</li>
                      <li>
                        第二行为表头，分别为序号、学校类型、学习名称、项目名称、项目分组
                      </li>
                      <li>剩余为数据</li>
                    </ul>
                    <br />
                    <h3>用户数据表格格式要求</h3>
                    <ul>
                      <li>共 2 列</li>
                      <li>不包含表头和标题</li>
                      <li>第一列为用户名</li>
                      <li>第二列为密码</li>
                    </ul>
                  </div>
                </div>
              ) : menuItem === 4 ? (
                <div>Item4</div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div>
            <div>
              <Upload {...recordsProps}>
                <Button>
                  <UploadOutlined /> 选择项目数据表格
                </Button>
              </Upload>
              <br />
              <Upload {...usersProps}>
                <Button>
                  <UploadOutlined /> 选择用户数据表格
                </Button>
              </Upload>
            </div>
            <div className="odraw-admin-upload-notice">
              <h3>注意事项</h3>
              <p>完成上传后即为导入成功</p>
              <br />
              <h3>文件要求</h3>
              <p>
                只可上传 .xlsx 文件，该文件必须有且仅有一个名为「data」的工作表
              </p>
              <br />
              <h3>项目数据表格格式要求</h3>
              <ul>
                <li>共 5 列</li>
                <li>首行为标题，横向合并 5 个单元格</li>
                <li>
                  第二行为表头，分别为序号、学校类型、学习名称、项目名称、项目分组
                </li>
                <li>剩余为数据</li>
              </ul>
              <br />
              <h3>用户数据表格格式要求</h3>
              <ul>
                <li>共 2 列</li>
                <li>不包含表头和标题</li>
                <li>第一列为用户名</li>
                <li>第二列为密码</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    React.useEffect(() => {
      Router.push({
        pathname: "/login",
      });
    });
    return <div></div>;
  }
};

export default Admin;
