import React, { useState, useEffect, Component } from 'react'
import './Orders.css'
import { Col, Container, Row, Badge, Alert, Button } from 'react-bootstrap'
import * as moment from 'moment'
import ReceiptModal from './ReceiptModal'
import { useSelector } from 'react-redux'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Axios from 'axios'

const PastOrders = () => {
    const [orders, setOrders] = useState([])
    const [showHide, setShowHide] = useState(false)
    const [receipt, setReceipt] = useState([])
    const [total, setTotal] = useState(0)
    const [instructions, setInstructions] = useState('')
    const [show, setShow] = useState(false)
    const [pastOrders, setPastOrders] = useState([])
    const customer = useSelector((state) => state.userLogin.user)
    const [pageSize, setPageSize] = React.useState(5)
    const [pageNo, setPageNo] = React.useState(1)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        loadOrders(pageSize, pageNo)
    }, [pageSize, pageNo])

    const loadOrders = async (pageSize, pageNo) => {
        const response = await Axios.post('http://3.129.16.0:3001/api/past-orders', {
            user: customer,
            size: pageSize,
            pageNo: pageNo,
        })
        console.log(response)
        if (response.status == 200 && response?.data?.length > 0) setPastOrders(response.data)
        else{
            setErrorMsg('No past orders')
            setPastOrders([])
        } 
    }

    const viewReceipt = (val, receipt, total, instructions = '') => {
        console.log(val)
        setShowHide(val)
        setReceipt(receipt)
        setTotal(total)
        setInstructions(instructions)
        console.log(showHide)
    }
    const handleChangeForSize = (event) => {
        setPageSize(event.target.value);
      };
      const handleChangeForPageNo = (event, value)=> {
        setPageNo(value);
      };

    return (
        <div class="wrapper">
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={pageSize}
                label="Page"
                onChange={handleChangeForSize}
            >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
            </Select>
            <Container fluid>
                {errorMsg && (
                     <Alert  variant="secondary">
                     <Alert.Heading>No Data on this page</Alert.Heading>
                 </Alert>
                )}
                {pastOrders.map((el, index) => (
                    <div class="order-box" key={index}>
                        <Row>
                            <Col md={6}>
                                <span>
                                    <b>{el.restId}</b>
                                </span>
                                <div>
                                    Ordered for ${el.price} on {moment(el.date).format('LLL')}
                                    <input
                                        type="submit"
                                        value="View Receipt"
                                        onClick={() =>
                                            viewReceipt(
                                                true,
                                                el?.dishes,
                                                el.price,
                                                el?.instructions
                                            )
                                        }
                                    />
                                </div>
                            </Col>
                            <Col
                                md={3}
                                style={{
                                    display: 'flex',
                                    alignSelf: 'center',
                                    justifyContent: 'end',
                                }}
                            >
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
                <Pagination count={5} shape="rounded" onChange={handleChangeForPageNo} />
            </Container>
        </div>
    )
}

export default PastOrders
