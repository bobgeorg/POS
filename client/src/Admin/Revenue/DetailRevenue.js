import React, { useState } from "react";
import { Container, Row, Col } from 'react-grid-system';
import Popup from "reactjs-popup";
import { FiXCircle } from 'react-icons/fi';
import { FcOk } from "react-icons/fc";
import { AiOutlineCloseCircle } from "react-icons/ai";
import DetailOrder from './DetailOrder';

import axios from "axios";

const contentStyle = {
    height: "80%",
    width: "85%",
  };
export default function DetailRevenue(props) {
    const [pendingStatus, setPendingStatus] = useState(props.order.orderStatus || 'pending');
    const [isOpen, setIsOpen] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [pendingPaymentStatus, setPendingPaymentStatus] = useState(props.order.isPaid);

    // Calculate total price based on current order items
    const calculateTotalPrice = () => {
        return orderItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    const calculateUnpaidValue = () => {
        const currentTotal = calculateTotalPrice();
        const paidValue = props.order.paidValue || 0;
        const unpaid = currentTotal - paidValue;
        return unpaid > 0 ? unpaid : 0;
    };

    // Fetch available products when modal opens
    React.useEffect(() => {
        if (isOpen) {
            axios.get("http://localhost:5000/revenue/food").then((response) => {
                setAvailableProducts(response.data);
            });
        }
    }, [isOpen]);

    const ConfirmOrder = (order => {   
        const getData = async (order) => {  
            console.log(order._id)
            await axios.post("http://localhost:5000/revenue/confirm", {idd: order._id}).then((response) => {
                // setproduct(response.data)
                console.log(response.data);
            });
        }  
        getData(order);
    })

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
                status: newStatus
            });
            console.log(`Order status updated to: ${newStatus}`);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    }

    const handleStatusChange = (newStatus) => {
        setPendingStatus(newStatus);
    }

    const handleDeleteItem = (index) => {
        const updatedItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedItems);
        // Reset status to pending and payment to unpaid when items change
        setPendingStatus('pending');
        setPendingPaymentStatus(false);
    }

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = orderItems.map((item, i) => 
            i === index ? { ...item, quantity: parseInt(newQuantity) } : { ...item }
        );
        setOrderItems(updatedItems);
        // Reset status to pending and payment to unpaid when items change
        setPendingStatus('pending');
        setPendingPaymentStatus(false);
    }

    const handleAddItem = () => {
        if (!selectedProduct) {
            alert('Please select a product to add');
            return;
        }
        
        const product = availableProducts.find(p => p._id === selectedProduct);
        if (!product) {
            alert('Product not found');
            return;
        }

        // Check if item already exists in order
        const existingItemIndex = orderItems.findIndex(item => item.name === product.name);
        
        if (existingItemIndex !== -1) {
            // If item exists, increment quantity
            const updatedItems = orderItems.map((item, i) => 
                i === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : { ...item }
            );
            setOrderItems(updatedItems);
        } else {
            // Add new item to order
            const newItem = {
                name: product.name,
                quantity: 1,
                price: product.price,
                img: product.img
            };
            setOrderItems([...orderItems, newItem]);
        }
        
        // Reset status to pending and payment to unpaid when items change
        setPendingStatus('pending');
        setPendingPaymentStatus(false);
        
        // Reset selection
        setSelectedProduct('');
    }

    const handleOk = async (close) => {
        try {
            console.log('Starting save process...');
            console.log('Original order items:', props.order.OrderItems);
            console.log('Updated order items:', orderItems);
            
            // Prepare update payload
            const hasItemChanges = JSON.stringify(orderItems) !== JSON.stringify(props.order.OrderItems);
            const hasStatusChange = pendingStatus !== props.order.orderStatus;
            const hasPaymentChange = pendingPaymentStatus !== props.order.isPaid;
            
            // Update order status if changed
            if (hasStatusChange) {
                console.log('Updating status from', props.order.orderStatus, 'to', pendingStatus);
                await updateOrderStatus(props.order._id, pendingStatus);
            }
            
            // Update order items and/or payment status in a single request
            if (hasItemChanges || hasPaymentChange) {
                const updatePayload = {};
                
                if (hasItemChanges) {
                    console.log('Including order items in update');
                    updatePayload.OrderItems = orderItems;
                }
                
                if (hasPaymentChange) {
                    console.log('Including payment status in update:', pendingPaymentStatus);
                    updatePayload.isPaid = pendingPaymentStatus;
                    updatePayload.paidAt = pendingPaymentStatus ? new Date() : null;
                }
                
                console.log('Updating order with payload:', updatePayload);
                const response = await axios.put(`http://localhost:5000/api/orders/${props.order._id}`, updatePayload);
                console.log('Order update response:', response.data);
            }
            
            // Close modal and refresh
            setIsOpen(false);
            close();
            
            // Small delay to ensure modal closes smoothly before reload
            console.log('Reloading page...');
            setTimeout(() => {
                window.location.reload(false);
            }, 100);
        } catch (error) {
            console.error('Error updating order:', error);
            console.error('Error details:', error.response?.data);
            alert('Failed to update order: ' + (error.response?.data?.message || error.message));
        }
    }

    const handleCancel = (close) => {
        setPendingStatus(props.order.orderStatus || 'pending');
        setPendingPaymentStatus(props.order.isPaid);
        setOrderItems(props.order.OrderItems.map(item => ({ ...item })));
        setIsOpen(false);
        close();
    }

    const handleOpen = () => {
        setPendingStatus(props.order.orderStatus || 'pending');
        setPendingPaymentStatus(props.order.isPaid);
        setOrderItems(props.order.OrderItems.map(item => ({ ...item })));
        setIsOpen(true);
    }

    const cycleStatus = async (e, newStatus) => {
        e.stopPropagation();
        if (!newStatus) {
            const statuses = ['pending', 'preparing', 'ready', 'delivered'];
            const currentIndex = statuses.indexOf(props.order.orderStatus || 'pending');
            newStatus = statuses[(currentIndex + 1) % statuses.length];
        }
        await updateOrderStatus(props.order._id, newStatus);
        window.location.reload(false);
    }
    
    return (

            <Popup
                trigger={
                    <Container fluid>
                    <Row className="elementlist">
                        <Col sm={1.5}> <h2 className="element">{props.order.userName}</h2></Col>
                        <Col sm={2}> <h2 className="element">
                            <select 
                                className={`order-status-dropdown status-${props.order.orderStatus}`}
                                value={props.order.orderStatus || 'pending'}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    cycleStatus(e, e.target.value);
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="pending">Pending</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </h2></Col>
                        <Col sm={1.8}> <h2 className="element">
                            {props.order.isPaid ? <FcOk  className="iconRevenue" size={20} color="green"/> : <AiOutlineCloseCircle size={20} color="red"/>}</h2>
                        </Col>
                        <Col sm={3.2}> <h2 className="element">{props.order.usingMethod}</h2></Col>
                        <Col sm={1.3}> <h2 className="element price-paid">€{(props.order.paidValue || 0).toLocaleString()}</h2></Col>
                        <Col sm={1.3}> <h2 className="element price-unpaid">€{(props.order.unpaidValue || 0).toLocaleString()}</h2></Col>
                        <Col sm={1.3}> <h2 className="oderprice">€{props.order.totalPrice.toLocaleString()}</h2></Col>
                    </Row>
                    </Container>
                }
                modal
                contentStyle = {contentStyle}
                open={isOpen}
                onOpen={handleOpen}
                onClose={() => setIsOpen(false)}
                >
                {close => (
                    <div className="modal">
                        <div className="header">
                            <h2>Order Details - {props.order.userName}</h2>
                        </div>
                        <a className="close" onClick={() => handleCancel(close)} href><FiXCircle size={20}/></a>
                        <div className="content">
                            <div className="OrderPopUp">
                                <div className="order-info-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Customer Name</label>
                                            <input type="text" value={props.order.userName} disabled className="form-input-disabled" />
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Method</label>
                                            <input type="text" value={props.order.usingMethod} disabled className="form-input-disabled" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Order Status</label>
                                            <select 
                                                className="form-select"
                                                value={pendingStatus}
                                                onChange={(e) => handleStatusChange(e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="ready">Ready</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Status</label>
                                            <select 
                                                className="form-select"
                                                value={pendingPaymentStatus ? 'paid' : 'unpaid'}
                                                onChange={(e) => {
                                                    setPendingPaymentStatus(e.target.value === 'paid');
                                                }}
                                            >
                                                <option value="unpaid">Unpaid</option>
                                                <option value="paid">Paid</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Paid Amount</label>
                                            <div className="value-display paid-display">€{(props.order.paidValue || 0).toLocaleString()}</div>
                                        </div>
                                        <div className="form-group">
                                            <label>Unpaid Amount</label>
                                            <div className="value-display unpaid-display">€{calculateUnpaidValue().toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group full-width">
                                            <label>Total Price</label>
                                            <div className="price-display">€{calculateTotalPrice().toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-items-section">
                                    <h3 className="section-title">Order Items</h3>
                                    <div className="add-item-section">
                                        <div className="add-item-form">
                                            <select 
                                                className="form-select product-select"
                                                value={selectedProduct}
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                            >
                                                <option value="">Select product to add...</option>
                                                {availableProducts.map(product => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.name} - €{product.price.toLocaleString()}
                                                    </option>
                                                ))}
                                            </select>
                                            <button 
                                                className="add-item-btn"
                                                onClick={handleAddItem}
                                            >
                                                Add Item
                                            </button>
                                        </div>
                                    </div>
                                    <DetailOrder 
                                        order={{...props.order, OrderItems: orderItems}} 
                                        onDeleteItem={handleDeleteItem}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="buttonOk" 
                                onClick={() => handleOk(close)}
                            >
                                Save
                            </button>
                            <button 
                                className="buttonCancel" 
                                onClick={() => handleCancel(close)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Popup> 
    )
}


