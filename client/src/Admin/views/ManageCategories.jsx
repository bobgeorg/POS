import React, { useContext, useState } from "react";
import { adminContext } from "../AdminContext";
import AddType from "../ListProducts/AddType";
import swal from "sweetalert";
import "../index-hoangkui.css";

const ManageCategories = () => {
  const { typeProducts, removeTypeProduct, products, removeProduct } =
    useContext(adminContext);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleDeleteCategory = async (category, index) => {
    // Check if any products use this category
    const productsInCategory = products.filter(
      (product) => product.catelory === category._id
    );

    const warningText =
      productsInCategory.length > 0
        ? `This category has ${productsInCategory.length} product(s). Deleting it will also delete all products under this category.`
        : "Are you sure you want to delete this category?";

    swal({
      title: "Delete Category?",
      text: warningText,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        // Delete all products in this category first
        for (const product of productsInCategory) {
          await removeProduct(product._id);
        }
        
        // Delete the category
        const result = await removeTypeProduct(category._id);
        
        // Only show success if the operation succeeded
        if (result && result.success) {
          swal("Deleted!", "Category has been deleted successfully.", "success");
        }
        // Error message is already shown by AdminContext
      }
    });
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  return (
    <div className="manage-categories-container">
      <div className="manage-categories-header">
        <h2 className="manage-categories-title">Manage Categories</h2>
        <AddType
          editMode={editingCategory !== null}
          categoryData={editingCategory}
          onEditComplete={() => setEditingCategory(null)}
        />
      </div>

      <div className="categories-grid">
        {typeProducts.length === 0 ? (
          <div className="no-categories">
            <i className="fas fa-folder-open"></i>
            <p>No categories yet. Click "Add Category" to create one.</p>
          </div>
        ) : (
          typeProducts.map((category, index) => (
            <div key={category._id || index} className="category-card">
              <div className="category-card-image-wrapper">
                <img
                  src={category.img}
                  alt={category.name}
                  className="category-card-image"
                />
              </div>
              <div className="category-card-content">
                <h3 className="category-card-name">{category.name}</h3>
                <div className="category-card-stats">
                  <span className="category-product-count">
                    <i className="fas fa-box"></i>
                    {
                      products.filter(
                        (product) => product.catelory === category._id
                      ).length
                    }{" "}
                    products
                  </span>
                </div>
              </div>
              <div className="category-card-actions">
                <button
                  className="category-action-btn edit-btn"
                  onClick={() => handleEditCategory(category)}
                  title="Edit category"
                >
                  <i className="fas fa-edit"></i>
                  <span>Edit</span>
                </button>
                <button
                  className="category-action-btn delete-btn"
                  onClick={() => handleDeleteCategory(category, index)}
                  title="Delete category"
                >
                  <i className="fas fa-trash"></i>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
