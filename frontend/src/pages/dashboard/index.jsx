import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

export default function Dashboard() {

    const router = useRouter();

    const [isTokenThere, setIsTokenThere] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            router.push("/login")
        }
        setIsTokenThere(true)
    }, [])

    useEffect(() => {
      if (isTokenThere) {
        
      }
    }, [isTokenThere])

  return (
    <div>
      Dashboard
    </div>
  )
}
