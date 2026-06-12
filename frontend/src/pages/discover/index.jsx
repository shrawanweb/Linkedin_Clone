import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Discoverpage() {

  const authState = useSelector((state) => state.auth)

  const dispatch = useDispatch();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [])

  useEffect(() => {
    console.log("ALL USERS:", authState.all_users);
  }, [authState.all_users]);

  return (
    <UserLayout>

        <DashboardLayout>
            <div>
                <h1>Discover</h1>
            </div>
        </DashboardLayout>

    </UserLayout>
  )
}
