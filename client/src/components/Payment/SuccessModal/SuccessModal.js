import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { FaCheckCircle } from 'react-icons/fa';
import './SuccessModal.css';

const SuccessModal = ({ show, orderId, onClose }) => {
  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      className="success-modal"
      backdrop="static"
    >
      <Modal.Body className="success-modal-body">
        <div className="success-icon-container">
          <FaCheckCircle className="success-icon" />
        </div>
        <h2 className="success-title">Order Submitted!</h2>
        <p className="success-message">
          Your order has been successfully sent to the kitchen/bar.
        </p>
        <div className="success-order-info">
          <span className="success-order-label">Order ID:</span>
          <span className="success-order-id">{orderId}</span>
        </div>
        <div className="success-status-badge">
          <span className="status-dot"></span>
          <span className="status-text">Status: Pending</span>
        </div>
        <button className="success-button" onClick={onClose}>
          Back to Menu
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
