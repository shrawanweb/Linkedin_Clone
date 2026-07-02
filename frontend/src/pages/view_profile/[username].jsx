import React, { useEffect } from 'react';
import { clientServer } from '@/config';
import UserLayout from '@/layout/UserLayout';
import Dashboard from '../dashboard';
import styles from './index.module.css'
import { useSearchParams } from 'next/navigation';

export default function ViewProfilePage({userProfile}) {


    const searchParams = useSearchParams();

    useEffect(() => {
      console.log("From View: View Profile")
    }, []);

  return (
    <UserLayout>
      <Dashboard>
        <div className={styles.container}>
      
    </div>
      </Dashboard>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {

  console.log("From View")
  console.log(context.query.username)

  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: {
      username: context.query.username
    }
  })

  const response = await request.data;
  console.log(response)
  return { props: {userProfile: request.data.userProfile} }
}