import axios from "axios";
import useSWR, { mutate } from "swr";
import Qs from "qs";
import React from "react";
import currentUserContext from "../utils/currentUserNameContext";
import currentUserJWTContext from "../utils/currentUserJWTContext";
import Router from "next/router";
import { Skeleton, Result, Button, Modal, Input, notification } from "antd";
import Admin from "../components/admin";

const openNotificationWithIcon = (type: string, des: string) => {
  notification[type]({
    message: "提示",
    description: des,
  });
};

const Index = () => {
  // 读取 Context
  const currentUserName = React.useContext(currentUserContext);
  const JWTToken = React.useContext(currentUserJWTContext);
  if (currentUserName && JWTToken && currentUserName !== "odrawAdmin") {
    // 栏目 State
    const [menuItem, setMenuItem] = React.useState<number>(1);
    // 抽签 Modal State
    const [drawModalStatus, setDrawModalStatus] = React.useState<boolean>(
      false
    );
    const [drawLoading, setDrawLoading] = React.useState<boolean>(false);
    // 抽签项目数据
    const [drawViewProject, setDrawViewProject] = React.useState<string>("");
    const [drawViewCate, setDrawViewCate] = React.useState<string>("");
    const [drawViewType, setDrawViewType] = React.useState<string>("");
    const [drawViewSchool, setDrawViewSchool] = React.useState<string>("");
    // 抽签数据
    const [nowDrawNumber, setNowDrawNumber] = React.useState<string>("");
    // 密码数据
    const [oldPwd, setOldPwd] = React.useState<string>("");
    const [newPwd, setNewPwd] = React.useState<string>("");
    // 加载 state
    const [loadingStatus, setLoadingStatus] = React.useState<boolean>(true);

    // 获取数据
    const { data, error } = useSWR(
      "https://node.ouorz.com/getRecordsBySchool?" +
        Qs.stringify({
          name: currentUserName,
        }),
      (url) =>
        axios({
          method: "get",
          url: url,
          headers: {
            Authorization: JWTToken,
          },
        }).then((res) => {
          // 初始化未抽签数量
          let unViewCount = 0;
          // 遍历全部项目
          res.data.records.map((item) => {
            if (!item.drawViewStatus) {
              unViewCount += 1;
            }
          });
          // 返回 0 位为未抽签数量其余为数据的数组
          return [{ unViewCount: unViewCount }, ...res.data.records];
        })
    );
    // 开启抽签 modal
    const startViewingDraw = (cate, type, school, project) => {
      // 确保上一个窗口已关闭
      cancelDrawModal();
      setDrawViewCate(cate);
      setDrawViewProject(project);
      setDrawViewSchool(school);
      setDrawViewType(type);
      setDrawModalStatus(true);
    };

    // 提交抽签查看请求
    const postViewDraw = () => {
      setDrawLoading(true);
      axios({
        method: "post",
        url: "https://node.ouorz.com/viewProjectDraw",
        data: Qs.stringify({
          cate: drawViewCate,
          type: drawViewType,
          project: drawViewProject,
          school: drawViewSchool,
        }),
        headers: {
          Authorization: JWTToken,
        },
      })
        .then((res) => {
          if (res.data.code === 104) {
            setTimeout(() => {
              setDrawLoading(false);
              setNowDrawNumber(res.data.draw);
              mutate(
                "https://node.ouorz.com/getRecordsBySchool?" +
                  Qs.stringify({
                    name: currentUserName,
                  })
              );
            }, 3000);
          }
        })
        .catch((err) => {
          openNotificationWithIcon("error", "提交失败");
        });
    };

    // 关闭抽签 modal
    const cancelDrawModal = () => {
      setDrawModalStatus(false);
      setDrawViewCate("");
      setDrawViewSchool("");
      setDrawViewType("");
      setDrawViewProject("");
      setNowDrawNumber("");
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
            setNewPwd("");
            setOldPwd("");
            openNotificationWithIcon("success", "密码修改完成");
          } else {
            openNotificationWithIcon("error", "旧密码错误");
          }
        })
        .catch((err) => {
          openNotificationWithIcon("error", "旧密码错误");
        });
    };

    setTimeout(() => {
      setLoadingStatus(false);
    }, 1000);

    return (
      <div className="odraw-container">
        {error ? (
          <Result status="500" title="500" subTitle="数据请求错误" />
        ) : !data || loadingStatus ? (
          <div>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : data.length > 1 ? (
          <div>
            <div className="odraw-container-top">
              <div className="odraw-container-top-div">
                <div className="odraw-container-top-info">
                  <h1>{currentUserName}</h1>
                  <p>{data[1].schoolType}组</p>
                </div>
                <div className="odraw-container-top-card">
                  <div className="left-div">
                    <p>{data.length - 1} 项</p>
                    <p>入围决赛</p>
                  </div>
                  <div className="right-div">
                    <p>{data[0].unViewCount} 项</p>
                    <p>暂未抽签</p>
                  </div>
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
                  <a>项目列表</a>
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
              </div>
            </div>
            <Modal
              title="抽签窗口"
              visible={drawModalStatus}
              onCancel={() => {
                cancelDrawModal();
              }}
              footer={null}
            >
              {!nowDrawNumber ? (
                <div className="odraw-draw-div">
                  <h2>项目抽签</h2>
                  <p>是否确认进行以下项目的抽签</p>
                  <div className="odraw-draw-table-div">
                    <table>
                      <tr>
                        <td>项目名称</td>
                        <td>{drawViewProject}</td>
                      </tr>
                      <tr>
                        <td>项目分类</td>
                        <td>{drawViewCate}</td>
                      </tr>
                      <tr>
                        <td>所属学校</td>
                        <td>{drawViewSchool}</td>
                      </tr>
                      <tr>
                        <td>学校类型</td>
                        <td>{drawViewType}</td>
                      </tr>
                    </table>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => {
                      postViewDraw();
                    }}
                    size="large"
                    loading={drawLoading}
                  >
                    开始抽签
                  </Button>
                </div>
              ) : (
                <div className="odraw-draw-div">
                  <h2>抽签完成</h2>
                  <h1>{nowDrawNumber}</h1>
                  <p>
                    项目&nbsp;<b>{drawViewProject}</b>&nbsp;获得以上抽签号码
                  </p>
                </div>
              )}
            </Modal>
            <div className="odraw-container-main">
              {menuItem === 1 ? (
                <div>
                  {data.slice(1, data.length).map((item) => {
                    return (
                      <div
                        className="odraw-container-item"
                        key={item.projectName}
                      >
                        <div>
                          <h3>{item.projectName}</h3>
                          <p>
                            <em>{item.projectCate}</em>
                            <em>{item.schoolName}</em>
                          </p>
                        </div>
                        <div className="odraw-admin-key-btn">
                          {item.drawViewStatus ? (
                            <Button>
                              抽签编号&nbsp;|&nbsp;<b>{item.drawNumber}</b>
                            </Button>
                          ) : item.drawNumber ? (
                            <Button
                              type="primary"
                              onClick={() => {
                                startViewingDraw(
                                  item.projectCate,
                                  item.schoolType,
                                  item.schoolName,
                                  item.projectName
                                );
                              }}
                            >
                              开始抽签
                            </Button>
                          ) : (
                            <Button type="primary" danger>
                              暂停抽签
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : menuItem === 2 ? (
                <div>
                  <div className="odraw-container-pwd-input">
                    <Input
                      placeholder="旧密码"
                      value={oldPwd}
                      onChange={(e) => {
                        setOldPwd(e.target.value);
                      }}
                    />
                    <Input
                      placeholder="新密码"
                      value={newPwd}
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
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <Result title="暂无数据" />
        )}
      </div>
    );
  } else {
    if (currentUserName === "odrawAdmin") {
      return <Admin />;
    } else {
      React.useEffect(() => {
        Router.push({
          pathname: "/login",
        });
      });
      return <div></div>;
    }
  }
};

export default Index;
