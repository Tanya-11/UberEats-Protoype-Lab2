import React from 'react'
import { useHistory } from 'react-router-dom'
import styles from './Persona.module.scss'

const Persona = () => {
    const history = useHistory()
    return (
        <div className={styles.Persona} data-testid="Persona">
            <h1>UberEats</h1>
            <div className={styles.PersonaWrapper}>
                <div
                    className={styles.restaurant}
                    onClick={() => {
                        history.push('/restaurant-login')
                    }}
                >
                    <div className={styles.restaurantImg}></div>
                    <h2>Restaurant owner</h2>
                </div>
                <div
                    className={styles.customer}
                    onClick={() => {
                        history.push('/user-login')
                    }}
                >
                    <div className={styles.customerImg}></div>
                    <h2>User</h2>
                </div>
            </div>
        </div>
    )
}

export default Persona
