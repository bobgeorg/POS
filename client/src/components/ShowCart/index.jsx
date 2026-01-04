import React, { useContext, useEffect, useRef } from "react";
import "./index.css";
import ProductInCart from "../ProductInCart";
import ShopContext from "../ShopContext";
import {Link} from 'react-router-dom';

const ShowCart = () => {
    const cartRef = useRef(null);

    const handleClickCart=()=>{
        document.querySelector(".cart").classList.add("display");
    }
    const handleClickClose=()=>{
        document.querySelector(".cart").classList.remove("display");
        
    }
    
    // Handle click outside to close cart
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                const cartIcon = document.querySelector(".nav-cart-button");
                if (cartIcon && !cartIcon.contains(event.target)) {
                    handleClickClose();
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    // ** ---------------Log-------Add ----------------------------------**
    const context = useContext(ShopContext);
    useEffect(() => {
      console.log(context);
    }, []);
    
    const isCartEmpty = !context.cart || context.cart.length === 0;
    const totalItems = context.cart.reduce((count, curItem) => count + curItem.quantity, 0);
    const totalPrice = context.cart.reduce((total, curr) => total + (curr.quantity * curr.price), 0).toFixed(2);
    
    return (
    <>
      <div className="cart-icon"
        onClick={handleClickCart}
      >
    
        <i className="fas fa-shopping-cart"></i>
        <div className="INCART">
          {totalItems}
        </div>
      </div>
      <div className="cart" ref={cartRef}>
          <div className="cart-close"
          onClick={handleClickClose}
          >

          <i className="fas fa-times-circle"></i>
          </div>
        <div className="cart-header">
          <p className="cart-header-title">
            <i className="fas fa-shopping-cart"></i>
            Cart ({totalItems})
          </p>
        </div>
        {isCartEmpty ? (
          <div className="cart-empty">
            <i className="fas fa-shopping-basket cart-empty-icon"></i>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {context.cart.map((cartItem, index)=> 
                <ProductInCart 
                  item={cartItem}
                  context={context}
                  index={index}
                  key={index}
                />  
              )}
            </ul>
            <div className="cart-payment">
              <div className="cart-payment-total">
                <p className="cart-payment-total-text">Total</p>
                <p className="cart-payment-total-origin">€{totalPrice}</p>
              </div>
              <Link to={{ pathname: "/payment" , state: {cartcontext :context.cart }}}>
                <button 
                  className="cart-payment-button" 
                  disabled={isCartEmpty}
                  onClick={handleClickClose}
                >
                  PLACE ORDER
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShowCart;
