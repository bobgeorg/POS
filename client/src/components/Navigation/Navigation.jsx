import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import { AiOutlineSetting } from 'react-icons/ai';
import { BiRestaurant } from 'react-icons/bi';
import { FaShoppingCart } from 'react-icons/fa';
import logo from '../../assets/water-tank.png';
import ShopContext from '../ShopContext';

const Navigation = () => {
    const location = useLocation();
    const context = useContext(ShopContext);
    
    const handleClickCart = () => {
        const cart = document.querySelector(".cart");
        if (cart) {
            cart.classList.toggle("display");
        }
    };

    return (
        <nav className="main-navigation">
            <div className="nav-container">
                <Link to="/" className="nav-brand">
                    <img src={logo} alt="Sourmena Logo" className="nav-logo" />
                    <h2>Sourmena POS</h2>
                </Link>
                <div className="nav-links">
                    <Link 
                        to="/admin" 
                        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                        <AiOutlineSetting className="nav-icon" />
                        <span>Admin</span>
                    </Link>
                    <Link 
                        to="/ordermanagement" 
                        className={`nav-link ${location.pathname === '/ordermanagement' ? 'active' : ''}`}
                    >
                        <BiRestaurant className="nav-icon" />
                        <span>Orders</span>
                    </Link>
                    {location.pathname === '/' && context && (
                        <div className="nav-cart-button" onClick={handleClickCart}>
                            <FaShoppingCart className="nav-icon" />
                            {context.cart && context.cart.length > 0 && (
                                <span className="nav-cart-badge">
                                    {context.cart.reduce((count, curItem) => count + curItem.quantity, 0)}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
