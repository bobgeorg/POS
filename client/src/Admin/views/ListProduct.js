import ListProducts from "../ListProducts";
import ManageCategories from "./ManageCategories";
import React, { useState } from "react";

const ListProduct = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="product-management-container">
      <div className="product-management-tabs">
        <button
          className={`product-tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <i className="fas fa-box"></i>
          Products
        </button>
        <button
          className={`product-tab ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          <i className="fas fa-folder"></i>
          Categories
        </button>
      </div>

      <div className="product-management-content">
        {activeTab === "products" ? <ListProducts /> : <ManageCategories />}
      </div>
    </div>
  );
};

export default ListProduct;
