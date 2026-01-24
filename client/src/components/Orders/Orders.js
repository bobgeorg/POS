import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './Orders.css';
import { FaReceipt, FaSearch, FaClock, FaCheckCircle, FaTimesCircle, FaEdit, FaTimes, FaSave, FaTrash, FaUndo, FaMoneyBillWave, FaPlus, FaMinus } from 'react-icons/fa';
import { BiRestaurant } from 'react-icons/bi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    userName: '',
    phone: '',
    address: '',
    table: '',
    OrderItems: []
  });
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });
  const [products, setProducts] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    fetchOrders(selectedDate);
    fetchProducts();
    const interval = setInterval(() => fetchOrders(selectedDate), 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const fetchOrders = async (date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ordermanagement/order`, {
        params: { date }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/product/`);
      setProducts(response.data.products || []);
      console.log('Products loaded:', response.data.products?.length || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'ready':
        return <BiRestaurant className="status-icon ready" />;
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

  const handleEditClick = (e, order) => {
    e.stopPropagation();
    setEditingOrder(order._id);
    setEditForm({
      userName: order.userName || '',
      phone: order.phone || '',
      address: order.address || '',
      table: order.table || '',
      OrderItems: order.OrderItems.map(item => ({ ...item }))
    });
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingOrder(null);
    setShowAddItem(false);
    setEditForm({
      userName: '',
      phone: '',
      address: '',
      table: '',
      OrderItems: []
    });
  };

  const showNotification = (title, message, type = 'info') => {
    setModalConfig({ title, message, type, onConfirm: null });
    setShowModal(true);
  };

  const showConfirmation = (title, message, onConfirm) => {
    setModalConfig({ title, message, type: 'confirm', onConfirm });
    setShowModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.stopPropagation();
    try {
      const order = orders.find(o => o._id === editingOrder);
      const updateData = {
        userName: editForm.userName,
        OrderItems: editForm.OrderItems
      };

      if (order.usingMethod === 'Online') {
        updateData.phone = editForm.phone;
        updateData.address = editForm.address;
      } else {
        updateData.table = editForm.table;
      }

      await axios.put(`${API_BASE_URL}/api/orders/${editingOrder}`, updateData);
      
      if (order.orderStatus === 'completed') {
        await axios.put(`${API_BASE_URL}/api/orders/${editingOrder}/status`, {
          status: 'pending'
        });
      }
      
      setEditingOrder(null);
      fetchOrders();
      
      const statusMessage = order.orderStatus === 'completed' ? ' Order status changed to pending.' : '';
      showNotification('Success!', `Your order has been updated successfully!${statusMessage}`, 'success');
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('Error', 'Failed to update order. Please try again.', 'error');
    }
  };

  const handleRemoveItem = (index) => {
    if (editForm.OrderItems.length === 1) {
      showNotification('Cannot Remove', 'Order must have at least one item.', 'warning');
      return;
    }
    const updatedItems = editForm.OrderItems.filter((_, i) => i !== index);
    setEditForm({ ...editForm, OrderItems: updatedItems });
  };

  const handleItemQuantityChange = (index, value) => {
    const quantity = parseInt(value) || 1;
    const updatedItems = [...editForm.OrderItems];
    updatedItems[index] = { ...updatedItems[index], quantity: Math.max(1, quantity) };
    setEditForm({ ...editForm, OrderItems: updatedItems });
  };

  const handleItemCommentChange = (index, comment) => {
    const updatedItems = [...editForm.OrderItems];
    updatedItems[index] = { ...updatedItems[index], comment };
    setEditForm({ ...editForm, OrderItems: updatedItems });
  };

  const handleAddNewItem = (product) => {
    const newItem = {
      name: product.name,
      price: product.price,
      quantity: 1,
      img: product.img,
      comment: ''
    };
    setEditForm({ ...editForm, OrderItems: [...editForm.OrderItems, newItem] });
    setShowAddItem(false);
  };

  const handleCancelOrder = async (e, orderId) => {
    e.stopPropagation();
    
    showConfirmation(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      async () => {
        try {
          await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
            status: 'cancelled'
          });
          fetchOrders();
          showNotification('Order Cancelled', 'Your order has been cancelled successfully.', 'success');
        } catch (error) {
          console.error('Error cancelling order:', error);
          showNotification('Error', 'Failed to cancel order. Please try again.', 'error');
        }
      }
    );
  };

  const handleDeleteOrder = async (e, orderId) => {
    e.stopPropagation();
    
    showConfirmation(
      'Delete Order',
      'Are you sure you want to permanently delete this order? This action cannot be undone.',
      async () => {
        try {
          await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`);
          fetchOrders();
          showNotification('Order Deleted', 'The order has been permanently deleted.', 'success');
        } catch (error) {
          console.error('Error deleting order:', error);
          showNotification('Error', 'Failed to delete order. Please try again.', 'error');
        }
      }
    );
  };

  const handleRestoreOrder = async (e, orderId) => {
    e.stopPropagation();
    
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        status: 'pending'
      });
      fetchOrders();
      showNotification('Order Restored', 'The order has been restored to pending status.', 'success');
    } catch (error) {
      console.error('Error restoring order:', error);
      showNotification('Error', 'Failed to restore order. Please try again.', 'error');
    }
  };

  const handleMarkAsPaid = async (e, orderId) => {
    e.stopPropagation();
    
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        status: 'paid'
      });
      fetchOrders();
      showNotification('Order Paid', 'The order has been marked as paid.', 'success');
    } catch (error) {
      console.error('Error marking order as paid:', error);
      showNotification('Error', 'Failed to mark order as paid. Please try again.', 'error');
    }
  };

  const handleMarkAsCompleted = async (e, orderId) => {
    e.stopPropagation();
    
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        status: 'completed'
      });
      fetchOrders();
      showNotification('Order Completed', 'The order has been marked as completed.', 'success');
    } catch (error) {
      console.error('Error marking order as completed:', error);
      showNotification('Error', 'Failed to mark order as completed. Please try again.', 'error');
    }
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
    <>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-header ${modalConfig.type}`}>
              <h3>{modalConfig.title}</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>{modalConfig.message}</p>
            </div>
            <div className="modal-footer">
              {modalConfig.type === 'confirm' ? (
                <>
                  <button 
                    className="modal-btn cancel" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="modal-btn confirm" 
                    onClick={() => {
                      setShowModal(false);
                      if (modalConfig.onConfirm) modalConfig.onConfirm();
                    }}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button 
                  className="modal-btn ok" 
                  onClick={() => setShowModal(false)}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="orders-container">
        <div className="orders-header">
        <div className="orders-title">
          <FaReceipt className="title-icon" />
          <h2>My Orders</h2>
        </div>
        <div className="date-filter">
          <label htmlFor="order-date-waiter">Date:</label>
          <input 
            type="date" 
            id="order-date-waiter"
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
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
                  <p className="order-time">
                    {new Date(order.createdAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </p>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.orderStatus)}
                  <span className={`status-text ${order.orderStatus}`}>
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>
                <button 
                  className="delete-order-btn"
                  onClick={(e) => handleDeleteOrder(e, order._id)}
                  title="Delete order"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="order-summary">
                <div className="order-detail">
                  <span className="label">Method:</span>
                  <span className="value">{order.usingMethod}</span>
                </div>
                {order.usingMethod === 'Directly' && order.table && (
                  <div className="order-detail">
                    <span className="label">Table:</span>
                    <span className="value">Table {order.table}</span>
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
                {order.paidValue > 0 && order.unpaidValue > 0 && (
                  <>
                    <div className="order-detail">
                      <span className="label">Paid:</span>
                      <span className="value price-paid">€{order.paidValue?.toLocaleString()}</span>
                    </div>
                    <div className="order-detail">
                      <span className="label">Unpaid:</span>
                      <span className="value price-unpaid">€{order.unpaidValue?.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              {selectedOrder?._id === order._id && (
                <div className="order-items">
                  {editingOrder === order._id ? (
                    <div className="order-edit-form" onClick={(e) => e.stopPropagation()}>
                      <h4>Edit Order {order.orderStatus === 'completed' && <span className="edit-note">(will change status to pending)</span>}</h4>
                      
                      <div className="edit-form-group">
                        <label>Customer Name:</label>
                        <input
                          type="text"
                          value={editForm.userName}
                          onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                          className="edit-input"
                        />
                      </div>

                      {order.usingMethod === 'Online' ? (
                        <>
                          <div className="edit-form-group">
                            <label>Phone:</label>
                            <input
                              type="text"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className="edit-input"
                            />
                          </div>
                          <div className="edit-form-group">
                            <label>Delivery Address:</label>
                            <textarea
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              className="edit-input"
                              rows="2"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="edit-form-group">
                          <label>Table Number:</label>
                          <select
                            value={editForm.table}
                            onChange={(e) => setEditForm({ ...editForm, table: e.target.value })}
                            className="edit-input"
                          >
                            <option value="">Select table</option>
                            <option value="1">01</option>
                            <option value="2">02</option>
                            <option value="3">03</option>
                            <option value="4">04</option>
                            <option value="5">05</option>
                            <option value="6">06</option>
                            <option value="7">07</option>
                            <option value="8">08</option>
                            <option value="9">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                          </select>
                        </div>
                      )}

                      <div className="edit-form-group">
                        <label>Order Items:</label>
                        <div className="edit-items-list">
                          {editForm.OrderItems.map((item, index) => (
                            <div key={index} className="edit-order-item">
                              {item.img && (
                                <img 
                                  src={`${API_BASE_URL}${item.img}`} 
                                  alt={item.name}
                                  className="item-image"
                                />
                              )}
                              <div className="item-details">
                                <p className="item-name">{item.name}</p>
                                <div className="quantity-control">
                                  <button 
                                    className="qty-btn"
                                    onClick={() => handleItemQuantityChange(index, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <FaMinus />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                                    className="quantity-input"
                                  />
                                  <button 
                                    className="qty-btn"
                                    onClick={() => handleItemQuantityChange(index, item.quantity + 1)}
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Add comment (e.g., no onions)"
                                  value={item.comment || ''}
                                  onChange={(e) => handleItemCommentChange(index, e.target.value)}
                                  className="comment-input"
                                />
                              </div>
                              <div className="item-actions">
                                <p className="item-price">€{(item.price * item.quantity).toLocaleString()}</p>
                                <button
                                  className="remove-item-btn"
                                  onClick={() => handleRemoveItem(index)}
                                  disabled={editForm.OrderItems.length === 1}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {!showAddItem ? (
                          <button className="add-item-btn" onClick={() => setShowAddItem(true)}>
                            <FaPlus /> Add New Item
                          </button>
                        ) : (
                          <div className="add-item-section">
                            <div className="add-item-header">
                              <h5>Select Product to Add:</h5>
                              <button className="close-add-btn" onClick={() => setShowAddItem(false)}>
                                <FaTimes />
                              </button>
                            </div>
                            <div className="products-grid">
                              {products.length === 0 ? (
                                <p className="no-products-message">Loading products...</p>
                              ) : (
                                products.map((product) => (
                                  <div key={product._id} className="product-card" onClick={() => handleAddNewItem(product)}>
                                    {product.img && (
                                      <img 
                                        src={`${API_BASE_URL}${product.img}`} 
                                        alt={product.name}
                                        className="product-image"
                                      />
                                    )}
                                    <div className="product-info">
                                      <p className="product-name">{product.name}</p>
                                      <p className="product-price">€{product.price}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="edit-total">
                          <strong>New Total: €{editForm.OrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="edit-actions">
                        <button className="save-btn" onClick={handleSaveEdit}>
                          <FaSave /> Save Changes
                        </button>
                        <button className="cancel-btn" onClick={handleCancelEdit}>
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="order-items-header">
                        <h4>Order Items:</h4>
                        <div className="order-action-buttons">
                          {order.orderStatus === 'cancelled' ? (
                            <button 
                              className="restore-order-btn"
                              onClick={(e) => handleRestoreOrder(e, order._id)}
                            >
                              <FaUndo /> Restore to Pending
                            </button>
                          ) : (
                            <>
                              <button 
                                className="edit-order-btn"
                                onClick={(e) => handleEditClick(e, order)}
                              >
                                <FaEdit /> Edit Order
                              </button>
                              {order.orderStatus === 'pending' && (
                                <button 
                                  className="cancel-order-btn"
                                  onClick={(e) => handleCancelOrder(e, order._id)}
                                >
                                  <FaTimes /> Cancel Order
                                </button>
                              )}
                              {(order.orderStatus === 'ready' || order.orderStatus === 'pending') && (
                                <button 
                                  className="paid-order-btn"
                                  onClick={(e) => handleMarkAsPaid(e, order._id)}
                                >
                                  <FaMoneyBillWave /> Mark as Paid
                                </button>
                              )}
                              {(order.orderStatus === 'paid' || order.orderStatus === 'ready') && (
                                <button 
                                  className="completed-order-btn"
                                  onClick={(e) => handleMarkAsCompleted(e, order._id)}
                                >
                                  <FaCheckCircle /> Mark as Completed
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
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
                              {item.comment && (
                                <p className="item-comment">Note: {item.comment}</p>
                              )}
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
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default Orders;
