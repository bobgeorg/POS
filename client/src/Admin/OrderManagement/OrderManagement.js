import React, { useState } from 'react';
import './index.css';
import { Container, Row, Col } from 'react-grid-system';
// import Popup from "reactjs-popup";

import DetailRevenue from "./DetailRevenue";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { FaSearch } from "react-icons/fa";
import { BiRestaurant } from "react-icons/bi";
import useMountTransition from "./useMountTransition";

export default function OrderManagement() {
    // const [Staffs, setStaff] = React.useState(null);
    const renderSwitch = (search, current) => {
        switch(search) {
            case 2:
                return result.filter(data => data.usingMethod.includes(current)).map(order => (
                    <DetailRevenue key={order._id} order={order} onOrderUpdate={fetchOrders}/>
                ))
            case 3:
                return result.filter(data => data.totalPrice > (current)).map(order => (
                    <DetailRevenue key={order._id} order={order} onOrderUpdate={fetchOrders}/>
                ))
            default:
                return result.filter(data => data.userName.includes(current)).map(order => (
                    <DetailRevenue key={order._id} order={order} onOrderUpdate={fetchOrders}/>
                ))
          }
    }
    const choices = [
        {
            id: 1,
            name: "Customer Name"
        },
        {
            id: 2,
            name: "Payment Method"
        },
        {
            id: 3,
            name: "Price"
        }
    ]

    const [Orders, setOrder] = React.useState([]);
    const [selectedDate, setSelectedDate] = React.useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const [show, setshow] = useState(false);
    const [current, setCurrent] = React.useState("");
    const [checked, setChecked] = React.useState(-1);
    const hasTransitionedIn = useMountTransition(show, 1000);
    
    const fetchOrders = async (date) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/ordermanagement/order`, {
                params: { date }
            });
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    React.useEffect(() => {
        fetchOrders(selectedDate);
    }, [selectedDate]);
    
    if (!Orders) return null;
    let result = [...Orders];
    // if(result[1]) console.log("arayy",result[1].id);
    return (
        <>
        <div className="panel-content">
            <Container className="grid" fluid>
              <Row>
                <Col lg={6}>
                  {" "}
                  <h2><BiRestaurant className="iconManager"/>   Order Management </h2>
                </Col>
                <Col lg={3}>
                  <div className="date-filter">
                    <label htmlFor="order-date">Date:</label>
                    <input 
                      type="date" 
                      id="order-date"
                      className="date-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg={3}>
                  {" "}
                  {/* <SearchAccount /> */}
                </Col>
              </Row>
            </Container>
          </div>

        {(hasTransitionedIn || show) && <div className="tableChoice">
            {choices.map(choice => (
                <i className={`choice ${hasTransitionedIn && "in"} ${
                    show && "visible"}`} key={choice.id}>
                    <input 
                        type="radio" 
                        onChange={() => setChecked(choice.id)}
                        checked={choice.id === checked}
                    />
                    {choice.name}                        
                </i>
            ))}
        </div>}
        <form className="searchAccount" action="/" method="get">
            {(hasTransitionedIn || show) && <input
                className={`formSearch ${hasTransitionedIn && "in"} ${show && "visible"}`}
                value={current}
                type="text"
                id="header-search"
                onChange={e => setCurrent(e.target.value)}
                name="seachAccount" 
                />}
            {<div className="searchButton" onClick={() => setshow(!show)}><FaSearch size={25} className="searchIcon" /></div>}
            {/* {show && <button className="searchButton" onClick={() => setshow(true)}><FaSearch size={25} className="searchIcon" /></button>} */}
        </form>
        <div className="tabaccount">
                <div>
                    <Container className="showlist" fluid>
                        <Row>
                            <Col sm={1.8}> <h2 className="columlist">Customer</h2></Col>
                            <Col sm={1.3}> <h2 className="columlist">Time</h2></Col>
                            <Col sm={2.3}> <h2 className="columlist">Order Status</h2></Col>
                            <Col sm={1.7}> <h2 className="columlist">Paid</h2></Col>
                            <Col sm={1.7}> <h2 className="columlist">Unpaid</h2></Col>
                            <Col sm={1.7}> <h2 className="columlist">Total</h2></Col>
                            <Col sm={1.1}> <h2 className="columlist">Actions</h2></Col>
                        </Row>
                    </Container>
                    <div className="contentlist_Revenue">
                        {renderSwitch(checked, current)}
                    </div>
                    <div className="Total">Total Revenue: €{
                        Orders.reduce((sum, i) => (
                            sum += (i.orderStatus === 'paid' || i.orderStatus === 'completed') ? i.totalPrice : 0
                        ), 0).toLocaleString()
                    }</div> 
                </div>
        </div>
        </>
    )
}