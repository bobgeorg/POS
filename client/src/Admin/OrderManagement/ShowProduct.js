import React from "react";
import { Container, Row, Col } from 'react-grid-system';
import { FiTrash2 } from 'react-icons/fi';
import axios from "axios";

export default function ShowProduct(props) {
    // const [product, setproduct] = React.useState([]);
    
    // if (!product) return null;

    return (
            <div className="order-item-card">
                <Container fluid>
                    <Row>
                        <Col lg={3}>
                            <img className="imageOrder" src={props.order.img} alt="ProductImage"></img>
                        </Col>
                        <Col lg={8} className="contentOrder">
                            <div className="nameOrder">{props.order.name}</div>
                            <div className="quantity-control">
                                <label>Quantity:</label>
                                <div className="quantity-input-group">
                                    <button 
                                        className="qty-btn"
                                        onClick={() => props.onQuantityChange && props.onQuantityChange(props.indexx, props.order.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        className="quantity-input"
                                        value={props.order.quantity}
                                        onChange={(e) => props.onQuantityChange && props.onQuantityChange(props.indexx, e.target.value)}
                                        min="1"
                                    />
                                    <button 
                                        className="qty-btn"
                                        onClick={() => props.onQuantityChange && props.onQuantityChange(props.indexx, props.order.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            {props.order.comment && (
                                <div className="item-comment">
                                    <strong>Special Instructions:</strong> {props.order.comment}
                                </div>
                            )}
                            {props.order.price && <div className="textRight">Price: €{props.order.price.toLocaleString()}</div>}
                        </Col>
                        <Col lg={1} className="delete-col">
                            {props.onDelete && (
                                <button 
                                    className="delete-item-btn"
                                    onClick={() => props.onDelete(props.indexx)}
                                    title="Delete item"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
    )
}