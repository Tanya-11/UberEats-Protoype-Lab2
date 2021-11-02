import React, { useState, useEffect, Component } from 'react'
import './Orders.scss'
import { Col, Container, Row, Badge, Alert, Button } from 'react-bootstrap'
import * as moment from 'moment'
import ReceiptModal from './ReceiptModal'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'

const PastOrders = () => {
    const [orders, setOrders] = useState([])
    const [showHide, setShowHide] = useState(false)
    const [receipt, setReceipt] = useState([])
    const [total, setTotal] = useState(0)
    const [sucessMsg, setSuccessMsg] = useState('')
    const [show, setShow] = useState(false);
    const [pastOrders, setPastOrders] = useState([]);
    const customer = useSelector((state) => state.userLogin.user)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = (val = 1) => {
        console.log('bye' + val)
        Axios.post('http://localhost:3001/api/past-orders', {
            user: customer,
            page: val,
        })
            .then( (res) => {
                console.log(res.data)
                let active = []
                let past = []
                let cancel = []
                let response =  res.data
                setPastOrders(response)
                // setActiveOrders(active)
                // setCancelledOrders(cancel)
            })
            .catch((err) => {
              //  setErrorMsg('No Data')
            })
    }

    



    const viewReceipt = (val, receipt, total) => {
        console.log(val)
        setShowHide(val)
        setReceipt(receipt)
        setTotal(total)
        console.log(showHide)
    }

    // const loadOrders = (event) => {
    //     //  console.log(this.props);
    //     console.log('Hi' + parseInt(event.target.innerText))
    //     props.load(parseInt(event.target.innerText))
    // }

    // const cancelOrder = (item) => {
    //     console.log(item)
    //     Axios.post('http://localhost:3001/api/orders/update/status', {
    //         orderId: item._id,
    //         orderStatus: 'Cancelled',
    //         date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    //     })
    //         .then(
    //             (res) => {
    //                 console.log(res)
    //                 if(res.status=200){
    //                     setSuccessMsg('Cancelled Order')
    //                   setShow(true);
    //                   setTimeout(() => {
    //                     setShow(false);
    //                     window.location.reload();
    //                  }, 1000);
                
    //                 }
    //             },
    //             (err) => {
    //                 console.log(err)
    //             }
    //         )
    //         .catch((err) => {
    //             console.log(err)
    //         })
    // }
    //   render() {
    return (
        <div>
            <Container fluid>
                {pastOrders.length > 0 &&
                    pastOrders.map((el, index) => (
                        <div className="order-box" key={index}>
                            <Row>
                                <Col md={6}>
                                    <span><b>{el.restId}</b></span>
                                    <div>
                                    Ordered for ${el.price} on{' '}
                                        {moment(el.date).format('LLL')}
                                        <input
                                            type="submit"
                                            value="View Receipt"
                                            onClick={() => viewReceipt(true, el?.dishes, el.price)}
                                        />
                                    </div>
                                </Col>
                                <Col md={3} style={{    display: 'flex',alignSelf: 'center',
    justifyContent: 'end'}}>
                                    <Badge pill bg="info" text="dark">
                                        {el.orderStatus}
                                    </Badge>
                                </Col>
                            </Row>
                        </div>
                    ))}
                {showHide && (
                    <ReceiptModal
                        showHide={showHide}
                        modal={viewReceipt}
                        data={receipt}
                        total={total}
                    ></ReceiptModal>
                )}
            </Container>
        </div>
    )
    //   }
}

export default PastOrders
