import React, { useState } from "react";
import { Container, Row, Col } from 'react-grid-system';
import Popup from "reactjs-popup";
import { FiXCircle, FiTrash2, FiEdit, FiMessageSquare, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { FcOk } from "react-icons/fc";
import { AiOutlineCloseCircle } from "react-icons/ai";
import DetailOrder from './DetailOrder';
import axios from "axios";
import API_BASE_URL from "../../config/api";

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
    const [isExpanded, setIsExpanded] = useState(false);

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
            axios.get(`${API_BASE_URL}/ordermanagement/food`).then((response) => {
                setAvailableProducts(response.data);
            });
        }
    }, [isOpen]);

    const ConfirmOrder = (order => {   
        const getData = async (order) => {  
            console.log(order._id)
            await axios.post(`${API_BASE_URL}/ordermanagement/confirm`, {idd: order._id}).then((response) => {
                // setproduct(response.data)
                console.log(response.data);
            });
        }  
        getData(order);
    })

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
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
        // Reset status to pending when items change
        setPendingStatus('pending');
    }

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = orderItems.map((item, i) => 
            i === index ? { ...item, quantity: parseInt(newQuantity) } : { ...item }
        );
        setOrderItems(updatedItems);
        // Reset status to pending when items change
        setPendingStatus('pending');
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
        
        // Reset status to pending when items change
        setPendingStatus('pending');
        
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
            
            // Update order status if changed
            if (hasStatusChange) {
                console.log('Updating status from', props.order.orderStatus, 'to', pendingStatus);
                await updateOrderStatus(props.order._id, pendingStatus);
            }
            
            // Update order items if changed
            if (hasItemChanges) {
                const updatePayload = {
                    OrderItems: orderItems
                };
                
                console.log('Updating order with payload:', updatePayload);
                const response = await axios.put(`${API_BASE_URL}/api/orders/${props.order._id}`, updatePayload);
                console.log('Order update response:', response.data);
            }
            
            // Close modal and refresh
            setIsOpen(false);
            close();
            
            // Refresh orders without page reload
            if (props.onOrderUpdate) {
                props.onOrderUpdate();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            console.error('Error details:', error.response?.data);
            alert('Failed to update order: ' + (error.response?.data?.message || error.message));
        }
    }

    const handleCancel = (close) => {
        setPendingStatus(props.order.orderStatus || 'pending');
        setOrderItems(props.order.OrderItems.map(item => ({ ...item })));
        setIsOpen(false);
        close();
    }

    const handleOpen = () => {
        setPendingStatus(props.order.orderStatus || 'pending');
        setOrderItems(props.order.OrderItems.map(item => ({ ...item })));
        setIsOpen(true);
    }

    const cycleStatus = async (e, newStatus) => {
        e.stopPropagation();
        if (!newStatus) {
            const statuses = ['pending', 'ready', 'paid', 'completed', 'cancelled'];
            const currentIndex = statuses.indexOf(props.order.orderStatus || 'pending');
            newStatus = statuses[(currentIndex + 1) % statuses.length];
        }
        try {
            await updateOrderStatus(props.order._id, newStatus);
            // Refresh orders without page reload
            if (props.onOrderUpdate) {
                props.onOrderUpdate();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
    
    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`);
            // Refresh orders without page reload
            if (props.onOrderUpdate) {
                props.onOrderUpdate();
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order: ' + (error.response?.data?.message || error.message));
        }
    }
    
    return (
        <>
            <Container fluid>
            <Row className="elementlist">
                <Col sm={0.5}>
                    <button 
                        className="expand-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        title={isExpanded ? "Collapse items" : "Expand items"}
                    >
                        {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    </button>
                </Col>
                <Col sm={1.7}> 
                    <div className="element customer-info">
                        <span className="customer-name">{props.order.userName}</span>
                        {props.order.OrderItems?.some(item => item.comment) && (
                            <FiMessageSquare 
                                size={14} 
                                style={{ marginLeft: '6px', color: '#007bff', verticalAlign: 'middle' }} 
                                title="Order has special instructions"
                            />
                        )}
                    </div>
                </Col>
                <Col sm={1.3}> <h2 className="element order-time">
                            {new Date(props.order.createdAt).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                            })}
                        </h2></Col>
                        <Col sm={2.3}> <h2 className="element">
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
                                <option value="ready">Ready</option>
                                <option value="paid">Paid</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </h2></Col>
                        <Col sm={1.7}> <h2 className="element price-paid">€{(props.order.paidValue || 0).toLocaleString()}</h2></Col>
                        <Col sm={1.7}> <h2 className="element price-unpaid">€{(props.order.unpaidValue || 0).toLocaleString()}</h2></Col>
                        <Col sm={1.7}> <h2 className="element price-total">€{props.order.totalPrice.toLocaleString()}</h2></Col>
                        <Col sm={1.1}> 
                            <div className="action-buttons">
                                <button 
                                    className="admin-edit-order-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpen();
                                    }}
                                    title="Edit order"
                                >
                                    <FiEdit size={18} />
                                </button>
                                <button 
                                    className="admin-delete-order-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Are you sure you want to delete this order?')) {
                                            handleDeleteOrder(props.order._id);
                                        }
                                    }}
                                    title="Delete order"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </Col>
                    </Row>
                    {isExpanded && (
                        <Row className="expanded-items-grid">
                            <Col sm={12}>
                                <div className="items-detail-table">
                                    <table className="items-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Item Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {props.order.OrderItems && props.order.OrderItems.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <img 
                                                            src={item.img} 
                                                            alt={item.name} 
                                                            className="item-thumbnail"
                                                        />
                                                    </td>
                                                    <td className="item-name">{item.name}</td>
                                                    <td className="item-quantity">x{item.quantity}</td>
                                                    <td className="item-price">€{(item.price * item.quantity).toLocaleString()}</td>
                                                    <td className="item-comment">{item.comment || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                    )}
                    </Container>
            
            <Popup
                trigger={<div style={{display: 'none'}}></div>}
                modal
                contentStyle = {contentStyle}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                {close => (
                    <div className="modal modern-modal">
                        <div className="modal-header-modern">
                            <h2>Order Details - {props.order.userName}</h2>
                            <button className="close-button-modern" onClick={() => handleCancel(close)}>
                                <FiXCircle size={24}/>
                            </button>
                        </div>
                        <div className="content">
                            <div className="OrderPopUp">
                                <div className="order-info-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Customer Name</label>
                                            <input type="text" value={props.order.userName} disabled className="form-input-disabled" />
                                        </div>
                                        <div className="form-group">
                                            <label>Order Status</label>
                                            <select 
                                                className="form-select"
                                                value={pendingStatus}
                                                onChange={(e) => handleStatusChange(e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="ready">Ready</option>
                                                <option value="paid">Paid</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row payment-summary">
                                        <div className="form-group-compact">
                                            <label>Paid</label>
                                            <div className="value-compact paid">€{(props.order.paidValue || 0).toLocaleString()}</div>
                                        </div>
                                        <div className="form-group-compact">
                                            <label>Unpaid</label>
                                            <div className="value-compact unpaid">€{calculateUnpaidValue().toLocaleString()}</div>
                                        </div>
                                        <div className="form-group-compact">
                                            <label>Total</label>
                                            <div className="value-compact total">€{calculateTotalPrice().toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-items-section">
                                    <div className="section-header">
                                        <h3 className="section-title">Order Items</h3>
                                        <div className="add-item-compact">
                                            <select 
                                                className="select-compact"
                                                value={selectedProduct}
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                            >
                                                <option value="">+ Add item...</option>
                                                {availableProducts.map(product => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.name} - €{product.price.toLocaleString()}
                                                    </option>
                                                ))}
                                            </select>
                                            <button 
                                                className="btn-add-compact"
                                                onClick={handleAddItem}
                                            >
                                                +
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
                        <div className="modal-footer-modern">
                            <button 
                                className="button-save-modern" 
                                onClick={() => handleOk(close)}
                            >
                                💾 Save Changes
                            </button>
                            <button 
                                className="button-cancel-modern" 
                                onClick={() => handleCancel(close)}
                            >
                                ✕ Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Popup>
        </>
    )
}


