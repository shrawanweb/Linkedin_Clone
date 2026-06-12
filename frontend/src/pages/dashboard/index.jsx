import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import { BASE_URL } from '@/config';


export default function Dashboard() {

    const router = useRouter();

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)

    useEffect(() => {
  if (authState.isTokenThere) {

    console.log("LOCAL TOKEN:", localStorage.getItem("token"));

    dispatch(getAllPosts());

    dispatch(
      getAboutUser({
        token: localStorage.getItem("token"),
      })
    );
     if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }
}, [authState.isTokenThere]);

    useEffect(() => {
        console.log("AUTH STATE:", authState);
        console.log("USER:", authState.user);
    }, [authState.user]);

    useEffect(() => {
      console.log(
        "PROFILE PICTURE:",
        authState.user?.userId?.profilePicture
      );
    }, [authState.user]);

  return (
    <UserLayout>

      <DashboardLayout>
        <div className="scrollComponent">

          <div className={styles.createPostContainer}>
            <img src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`} alt="profile" />
          </div>

        </div>
      </DashboardLayout>
      
    </UserLayout>
  )
}
