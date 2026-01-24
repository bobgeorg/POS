import React, { useState } from "react";
import AdminProvider, { adminContext } from "./AdminContext";
import ListProduct from "./views/ListProduct";
import OrderManagement from "./OrderManagement/OrderManagement";
import "./AdminTabs.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <AdminProvider>
      <div className="admin-container">
        <div className="admin-tabs-header">
          <button
            className={`admin-tab-button ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <i className="fas fa-box"></i>
            Products Management
          </button>
          <button
            className={`admin-tab-button ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="fas fa-receipt"></i>
            Order Management
          </button>
        </div>
        <div className="admin-tab-content">
          {activeTab === "products" && <ListProduct />}
          {activeTab === "orders" && <OrderManagement />}
        </div>
      </div>
    </AdminProvider>
  );
};

export default Admin;
