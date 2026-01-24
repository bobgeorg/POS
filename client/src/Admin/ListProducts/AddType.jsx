import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { adminContext } from "../AdminContext";
import swal from "sweetalert";
import Modal from "react-modal";
import ButtonUpload from "../ButtonUpload";

const modernModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "420px",
    maxHeight: "90vh",
    borderRadius: "12px",
    padding: "0",
    border: "none",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    overflow: "auto",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

const AddType = ({ editMode = false, categoryData = null, onEditComplete = null }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({ name: false, img: false });

  // Open modal automatically if in edit mode
  React.useEffect(() => {
    if (editMode && categoryData) {
      setNewProduct({
        name: categoryData.name,
        img: categoryData.img,
      });
      setIsOpen(true);
    }
  }, [editMode, categoryData]);

  function openModal() {
    setIsOpen(true);
    setErrors({ name: false, img: false });
  }

  function closeModal() {
    setIsOpen(false);
    setNewProduct({ name: "", img: "" });
    setErrors({ name: false, img: false });
    if (onEditComplete) onEditComplete();
  }

  const { typeProducts, addProduct, addTypeProduct, updateTypeProduct } = useContext(adminContext);
  const [newProduct, setNewProduct] = useState({
    name: "",
    img: "",
  });
  const { name, img } = newProduct;
  
  const onChangeInputProduct = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "name" && e.target.value) {
      setErrors({ ...errors, name: false });
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {
      name: !newProduct.name,
      img: !newProduct.img,
    };
    setErrors(newErrors);
    
    if (newErrors.name || newErrors.img) {
      swal("Validation Error", "Please fill in all required fields", "warning");
      return;
    }

    if (editMode && categoryData) {
      // Update existing category
      const data = new FormData();
      data.append("name", newProduct.name);
      
      // Check if image is a File object (new upload) or string (existing URL)
      if (typeof newProduct.img === 'object' && newProduct.img instanceof File) {
        // New image uploaded
        data.append("img", newProduct.img);
      } else {
        // Keep existing image URL
        data.append("img", newProduct.img);
      }
      
      const result = await updateTypeProduct(categoryData._id, data);
      
      if (result && result.success) {
        closeModal();
        swal(
          "Success",
          `Category "${newProduct.name}" has been updated successfully`,
          "success"
        );
      }
      // Error message is already shown by AdminContext
    } else {
      // Add new category
      const data = new FormData();
      data.append("img", newProduct.img);
      data.append("name", newProduct.name);

      const result = await addTypeProduct(data);
      
      if (result && result.success) {
        closeModal();
        swal(
          "Success",
          `Category "${newProduct.name}" has been added successfully`,
          "success"
        );
      }
      // Error message is already shown by AdminContext
    }
  };
  return (
    <>
      {!editMode && (
        <button onClick={openModal} className="listProducts-heading-add-product">
          <i className="fas fa-plus"></i>
          Add Category
        </button>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modernModalStyles}
        contentLabel={editMode ? "Edit Category Modal" : "Add Category Modal"}
        ariaHideApp={false}
      >
        <div className="modern-modal-header">
          <h2 className="modern-modal-title">
            {editMode ? "Edit Category" : "Add New Category"}
          </h2>
          <button className="modern-modal-close" onClick={closeModal} aria-label="Close">
            ×
          </button>
        </div>
        <form className="modern-modal-content" onSubmit={handleSubmitForm}>
          <div className="modern-form-group">
            <label className="modern-form-label">
              Category Name <span className="required">*</span>
            </label>
            <input
              className={`modern-form-input ${errors.name ? 'error' : ''}`}
              onChange={onChangeInputProduct}
              type="text"
              name="name"
              value={name}
              placeholder="Enter category name (e.g., Beverages, Main Courses)"
              required
            />
            {errors.name && <span className="error-message">Category name is required</span>}
          </div>

          <div className="modern-form-group">
            <label className="modern-form-label">
              Category Image <span className="required">*</span>
            </label>
            <div className="modern-image-upload">
              <ButtonUpload
                text="Choose Image"
                src={img}
                setProductUpdate={setNewProduct}
                productUpdate={newProduct}
              />
              {!img && <p className="image-upload-hint">Upload an image to represent this category</p>}
              {errors.img && <span className="error-message">Category image is required</span>}
            </div>
          </div>

          <div className="modern-modal-actions">
            <button
              type="button"
              className="modern-btn modern-btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modern-btn modern-btn-primary"
            >
              <i className={editMode ? "fas fa-save" : "fas fa-plus"}></i>
              {editMode ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddType;
