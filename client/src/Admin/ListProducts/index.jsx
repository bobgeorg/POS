import React, { useContext, useEffect, useState } from "react";
import { adminContext } from "../AdminContext";
import Filter from "../Header/Filter";
import swal from "sweetalert";

import "../index-hoangkui.css";
import AddModal from "./AddModal";
import AddType from "./AddType";
import SingleProduct from "./SingleProduct";

// import { useHistory } from "react-router-dom";
const ListProducts = () => {
  const {
    products,
    getProducts,
    removeProduct,
    getTypeProducts,
    isLoading,
    typeProducts,
    removeTypeProduct,
  } = useContext(adminContext);
  useEffect(() => {
    getProducts();
    getTypeProducts();
  }, []);
  const [selectFilter, setSelectFilter] = useState(-1);
  // if (!isLoading) filter = <Filter />;
  const handleRemoveType = async () => {
    swal({
      title: "Are you sure?",
      text: "This will permanently delete all products under this category?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        // Delete the category
        const result = await removeTypeProduct(typeProducts[selectFilter]._id);
        
        // Only show success if the operation succeeded
        if (result && result.success) {
          setSelectFilter(-1);
          swal("Deleted Successfully", {
            icon: "success",
          });
        }
        // Error message is already shown by AdminContext
      }
    });
  };
  console.log("??????", typeProducts, isLoading, products);
  return (
    <>
      {/* {filter} */}
      <div className="listProducts-heading">
        {/* <h3 className="listProducts-heading-title">Danh sách sản phẩm</h3> */}

        {false || (
          <div className="">
            <button
              onClick={() => setSelectFilter(-1)}
              className="button-filter-food"
              style={
                selectFilter === -1
                  ? { backgroundColor: "red", color: "#333" }
                  : {}
              }
            >
              All
            </button>
            {typeProducts.map((typeProduct, index) => {
              if (index !== 0)
                return (
                  <button
                    key={index}
                    onClick={() => setSelectFilter(index)}
                    style={
                      selectFilter === index
                        ? { backgroundColor: "red", color: "#333" }
                        : {}
                    }
                    className="button-filter-food"
                  >
                    {typeProduct.name}
                  </button>
                );
            })}
          </div>
        )}
        {/* <button
          onClick={openModalAdd}
          className="listProducts-heading-add-product"
        >
          <i className="fas fa-plus"></i>
          Thêm sản phẩm
        </button> */}
        <AddType />
        {selectFilter > -1 && (
          <button
            onClick={handleRemoveType}
            className="listProducts-heading-add-product"
          >
            Delete Category
          </button>
        )}
        <AddModal />
      </div>
      <div className="listProducts-content">
        <table className="listProducts-content-table">
          <tbody className="tbody-nth">
            <tr className="listProducts-content-row-heading-table">
              <th className="listProducts-content-row-heading">SKU</th>
              <th className="listProducts-content-row-heading">Product Name</th>
              <th className="listProducts-content-row-heading">
                Category
              </th>
              <th className="listProducts-content-row-heading">Stock</th>
              <th className="listProducts-content-row-heading">Description</th>
              <th className="listProducts-content-row-heading">Price (€)</th>
              <th className="listProducts-content-row-heading"></th>
              <th className="listProducts-content-row-heading">
                <button className="listProducts-content-row-remove">
                  <i className="fas fa-trash"></i>
                </button>
              </th>
            </tr>

            {products.map((product, index) => {
              if (selectFilter === -1) {
                return <SingleProduct product={product} index={index} />;
              } else if (product.catelory === typeProducts[selectFilter]._id)
                return <SingleProduct product={product} index={index} />;
            })}
          </tbody>
        </table>
      </div>

      <div className="modal-hoangkui-add modal-hoangkui">
        {/* <AddModal /> */}
      </div>
    </>
  );
};

export default ListProducts;
