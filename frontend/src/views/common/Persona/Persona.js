import React from 'react'
import { useHistory } from 'react-router-dom'
import './Persona.css'

const Persona = () => {
    const history = useHistory()
    return (
        <div class="Persona">
            <h1>UberEats</h1>
            <div class="PersonaWrapper">
                <div
                    class="restaurant"
                    onClick={() => {
                        history.push('/restaurant-login')
                    }}
                >
                    <div class="restaurantImg"></div>
                    <h2>Restaurant owner</h2>
                </div>
                <div
                    class="customer"
                    onClick={() => {
                        history.push('/user-login')
                    }}
                >
                    <div class="customerImg"></div>
                    <h2>User</h2>
                </div>
            </div>
        </div>
    )
}

export default Persona
