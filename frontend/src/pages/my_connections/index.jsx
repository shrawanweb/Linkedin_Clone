import {
  AcceptConnection,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (authState.connectionRequests.length != 0) {
      console.log(authState.connectionRequests);
    }
  }, [authState.connectionRequests]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <h4>My Connections</h4>

          {authState.connectionRequests.length === 0 && (
            <h1>No connection requests to display</h1>
          )}

          {authState.connectionRequests.map((user) => {
            return (
              <div
                onClick={() => {
                  router.push(`/view_profile/${user.userId?.username}`);
                }}
                className={styles.userCard}
                key={user._id}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user.userId?.profilePicture}`} />
                    </div>

                    <div className={styles.userInfo}>
                      <h3>{user.userId?.name}</h3>
                      <p>@{user.userId?.username}</p>
                    </div>
                  </div>

                  {user.status_accepted === null ? (
                    <button
                      onClick={async () => {
                        await dispatch(
                          AcceptConnection({
                            token: localStorage.getItem("token"),
                            connectionId: user._id,
                            action: "accept",
                          }),
                        );

                        dispatch(
                          getMyConnectionRequests({
                            token: localStorage.getItem("token"),
                          }),
                        );
                      }}
                    >
                      Accept
                    </button>
                  ) : (
                    <button
                      style={{
                        backgroundColor: "lightgray",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        color: "black",
                      }}
                      disabled
                    >
                      Connected
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <h4>My Network</h4>
          {authState.connectionRequests
            .filter((connection) => connection.status_accepted !== null)
            .map((user, index) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.userId?.username}`);
                  }}
                  className={styles.userCard}
                  key={index}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.userId?.profilePicture}`}
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user.userId?.name}</h3>
                        <p>@{user.userId?.username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
