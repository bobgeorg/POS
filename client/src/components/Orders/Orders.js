import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './Orders.css';
import { FaReceipt, FaSearch, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BiRestaurant } from 'react-icons/bi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ordermanagement/order`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'preparing':
        return <BiRestaurant className="status-icon preparing" />;
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };

  const filteredOrders = orders.filter(order =>
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderClick = (order) => {
    setSelectedOrder(selectedOrder?._id === order._id ? null : order);
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">
          <BiRestaurant className="loading-icon" />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="orders-title">
          <FaReceipt className="title-icon" />
          <h2>My Orders</h2>
        </div>
        <div className="orders-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <BiRestaurant className="no-orders-icon" />
            <p>No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className={`order-card ${selectedOrder?._id === order._id ? 'expanded' : ''}`}
              onClick={() => handleOrderClick(order)}
            >
              <div className="order-card-header">
                <div className="order-info">
                  <h3>{order.userName}</h3>
                  <p className="order-id">Order #{order._id?.slice(-8)}</p>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.orderStatus)}
                  <span className={`status-text ${order.orderStatus}`}>
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>
              </div>

              <div className="order-summary">
                <div className="order-detail">
                  <span className="label">Method:</span>
                  <span className="value">{order.usingMethod}</span>
                </div>
                {order.usingMethod === 'Directly' && order.tableseat && (
                  <div className="order-detail">
                    <span className="label">Table:</span>
                    <span className="value">{order.tableseat}</span>
                  </div>
                )}
                {order.usingMethod === 'Online' && order.phone && (
                  <div className="order-detail">
                    <span className="label">Phone:</span>
                    <span className="value">{order.phone}</span>
                  </div>
                )}
                <div className="order-detail">
                  <span className="label">Total:</span>
                  <span className="value price">€{order.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="order-detail">
                  <span className="label">Payment:</span>
                  <span className={`value payment-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>

              {selectedOrder?._id === order._id && (
                <div className="order-items">
                  <h4>Order Items:</h4>
                  <div className="items-list">
                    {order.OrderItems?.map((item, index) => (
                      <div key={index} className="order-item">
                        {item.img && (
                          <img 
                            src={`${API_BASE_URL}${item.img}`} 
                            alt={item.name}
                            className="item-image"
                          />
                        )}
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          <p className="item-quantity">Qty: {item.quantity}</p>
                        </div>
                        <p className="item-price">€{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  {order.usingMethod === 'Online' && order.address && (
                    <div className="delivery-address">
                      <strong>Delivery Address:</strong>
                      <p>{order.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
