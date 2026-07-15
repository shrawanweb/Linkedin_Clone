import React, { useEffect, useState } from "react";
import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());

    await dispatch(
      getConnectionsRequest({
        token: localStorage.getItem("token"),
      }),
    );

    await dispatch(
      getMyConnectionRequests({
        token: localStorage.getItem("token"),
      }),
    );
  };

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId?.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    const sentRequest = authState.connections.find(
      (item) => item.connectionId._id === userProfile.userId?._id,
    );

    const receivedRequest = authState.connectionRequests.find(
      (item) => item.userId._id === userProfile.userId?._id,
    );

    const connection = sentRequest || receivedRequest;

    if (connection) {
      setIsCurrentUserInConnection(true);

      if (connection.status_accepted === true) {
        setIsConnectionNull(false);
      } else {
        setIsConnectionNull(true);
      }
    } else {
      setIsCurrentUserInConnection(false);
      setIsConnectionNull(true);
    }
  }, [
    authState.connections,
    authState.connectionRequests,
    userProfile.userId?._id,
  ]);

  useEffect(() => {
    getUsersPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId?.profilePicture}`}
              alt="backdrop"
            />
          </div>
          <div className={styles.profileContainers__details}>
            <div className={styles.profileContainers__flex}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                  }}
                >
                  <h2>{userProfile.userId?.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{userProfile.userId?.username}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            connectionId: userProfile.userId?._id,
                          }),
                        );
                      }}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}
                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId?._id}`,
                      );
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank",
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      style={{ width: "1.3em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>
              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card__profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`} alt="post" />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="workHistory">
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("From View");
  console.log(context.query.username);

  const { data } = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    },
  );

  return {
    props: {
      userProfile: data.userProfile,
    },
  };
}
