
import Card from "react-bootstrap/Card";
import React from "react";
import { Container, Row, Col } from 'react-grid-system';
import { BsCart2 } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineMinus } from 'react-icons/ai';
import Popup from "reactjs-popup";
import { useState, useEffect } from 'react';

function ButtonIncrement(props) {
  return (
    <button 
      className="quantity-btn quantity-btn-plus"
      onClick={props.onClickFunc}
      aria-label="Increase quantity"
    >
      <AiOutlinePlus />
    </button>
  )
}

function ButtonDecrement(props) {
  return (
    <button 
      className="quantity-btn quantity-btn-minus"
      onClick={props.onClickFunc}
      aria-label="Decrease quantity"
    >
      <AiOutlineMinus />
    </button>
  )
}

function Display(props) {
  return (
    <span className="quantity-display">{props.message}</span>
  )
}

const contentStyle = {
  maxHeight: "90vh",
  width: "90%",
  maxWidth: "600px",
  borderRadius: "12px",
  padding: "0",
  overflow: "auto",
};

export default function ShowCard(props) {
  const [counter, setCounter] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const incrementCounter = () => setCounter(counter + 1);
  let decrementCounter = () => setCounter(counter - 1);
  if (counter <= 1) {
    decrementCounter = () => setCounter(1);
  }

  const resetCounter = () => {
    setCounter(1);
    setComment('');
  };

  return (
    <Popup
      trigger={
        <div className="cardfood">
          <Card style={{ width: "13rem" }}>
            <Card.Body>
              <Card.Img className="imagefood" variant="bottom" src={props.image} />
              <Card.Title> {props.name} </Card.Title>
              <Card.Text className="price"> €{props.price.toFixed(2)} </Card.Text>
              <Card.Link href="">
                <BsCart2 className="iconcart" />
              </Card.Link>
            </Card.Body>
          </Card>
        </div>
      }
      modal
      contentStyle={contentStyle}
      onClose={resetCounter}
      closeOnDocumentClick
    >
      {close => (

        <div className="modal">
          <div className="header">
            <span>ADD TO CART</span>
            <a className="close" onClick={close} aria-label="Close">&times;</a>
          </div>
          <div className="content">
            <Container>
              <Row>
                <Col xs={12} lg={4}>
                  <div className="modal-image-container">
                    <img 
                      className="image_Pop" 
                      src={props.image} 
                      alt={props.name}
                    />
                  </div>
                </Col>
                <Col xs={12} lg={8}>
                  <div className="contentPopup">
                    <div className="modal-product-info">
                      <h3 className="modal-product-name">{props.name}</h3>
                      <div className="modal-product-price">
                        <span className="modal-price-label">Price:</span>
                        <span className="modal-price-value">€{props.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="modal-quantity-section">
                      <span className="modal-quantity-label">Quantity:</span>
                      <div className="modal-quantity-controls">
                        <ButtonDecrement onClickFunc={decrementCounter} />
                        <Display message={counter} />
                        <ButtonIncrement onClickFunc={incrementCounter} />
                      </div>
                    </div>

                    <div className="modal-comment-section">
                      <label className="modal-comment-label">Special Instructions (Optional):</label>
                      <textarea
                        className="modal-comment-input"
                        placeholder="Any special requests? e.g., no onions, extra sauce, cook well done, allergies, etc."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                      />
                    </div>

                    <div onClick={close}>
                      <button
                        className="totalPrice modal-add-to-cart-btn"
                        onClick={props.context.addProductToCart.bind(this, { ...props.food, want: counter, comment: comment })}
                      >
                        <BsCart2 className="iconTotalPrice" />
                        <span>Add to Cart - €{(counter * props.price).toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      )}
    </Popup>
  );
}