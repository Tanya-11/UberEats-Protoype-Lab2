import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import * as ACTIONS from '../../../redux/actions/actions'
import styles from './Modal.module.scss'
import Axios from 'axios';

const Modal = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const customer = useSelector((state) => state.userLogin)


    const logOut = () => {
        Axios.post('http://18.224.59.255:3001/api/logout',{
            user:customer.user_id
        })
        .then(res=>{
            console.log("333333333333333333334444444444444444");
            console.log(res.data);
           
            dispatch({ type: ACTIONS.USER_LOGOUT });
        })
        .catch(err=>console.log(err))
    }
    return (
        <div className={styles.Modal} data-testid="Modal">
            <ul>
                <li
                    onClick={() => {
                        history.push('/customer-profile')
                    }}
                >
                    Profile
                </li>
                <hr />
                <li
                    onClick={() => {
                        history.push('/dashboard/order-details/past-orders')
                    }}
                >
                    Orders
                </li>
                <hr />
                <li onClick={logOut}>
                    Log Out <LogoutIcon />
                </li>
            </ul>
        </div>
    )
}

export default Modal
