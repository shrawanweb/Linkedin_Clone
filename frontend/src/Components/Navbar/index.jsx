import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router';

export default function NavBarComponent() {

    const router = useRouter();


  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>

        <h1 style={{cursor: "pointer"}} onClick={() => {
            router.push("/")
        }}>Pro Connect</h1>

        <div className={styles.navBarOptionContainer}>

            <div onClick={() => {
                router.push("/login")
            }}  className={styles.buttonJoin}>
                <p>Be a Part</p>
            </div>

        </div>

      </nav>
    </div>
  )
}
