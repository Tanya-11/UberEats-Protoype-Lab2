import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './Orders.scss'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Orders from './CancelledOrders'
import { Nav } from 'react-bootstrap'

import Pagination from '@mui/material/Pagination'

const OrderDetails = () => {
    const customer = useSelector((state) => state.userLogin.user)
    const [orders, setOrders] = useState([])
    const [pastOrders, setPastOrders] = useState([])
    const [activeOrders, setActiveOrders] = useState([])
    const [cancelledOrders, setCancelledOrders] = useState([])
    const [errorMsg, setErrorMsg] = useState('')
    Axios.defaults.withCredentials = true
    const [index, setIndex] = useState(0)
    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = (val = 1) => {
        console.log('bye' + val)
        Axios.post('http://localhost:3001/api/cancelled-orders', {
            user: customer,
            page: val,
        })
            .then((res) => {
                console.log(res.data)
                let active = []
                let past = []
                let cancel = []
                let response = res.data
                setPastOrders(response)
                // setActiveOrders(active)
                // setCancelledOrders(cancel)
            })
            .catch((err) => {
                setErrorMsg('No Data')
            })
    }
    return (
        <div>
            <Nav defaultActiveKey="/dashboard/order-details/past-orders" className="flex-column">
                <Nav.Link href="/dashboard/order-details/past-orders">Past Orders</Nav.Link>
                <Nav.Link href="/dashboard/order-details/cancelled-orders">
                    Cancelled Orders
                </Nav.Link>
                <Nav.Link href="/dashboard/order-details/active-orders">Active Orders</Nav.Link>
            </Nav>
        </div>
    )
}

export default OrderDetails
