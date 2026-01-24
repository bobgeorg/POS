import { createContext, useReducer } from "react";
import reducer from "./reducer";
import axios from "axios";
import API_BASE_URL from "../config/api";
import swal from "sweetalert";
import {
  PRODUCT_LOAD_SUCCESS,
  SET_TYPE_PRODUCT,
  UPDATE_PRODUCT,
  GET_TYPE_PRODUCT,
  ADD_PRODUCT,
  LOADED,
} from "./constant";
export const adminContext = createContext();

const AdminProvider = ({ children }) => {
  const [stateAdmin, dispatch] = useReducer(reducer, {
    products: [],
    typeProducts: [],
    isLoading: true,
  });
  const { products, typeProducts, isLoading } = stateAdmin;
  
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/product`);

      if (response.data.success) {
        const products = response.data.products;
        dispatch({
          type: PRODUCT_LOAD_SUCCESS,
          payload: products,
        });
        products.map((product) => {
          getTypeProduct(product);
        });
      }
      getTypeProducts();
    } catch (error) {
      console.log(error);
    }
  };
  
  const addProduct = async (newProduct) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/product`,
        newProduct
      );
      if (res.data.success) {
        dispatch({
          type: ADD_PRODUCT,
          payload: res.data.product,
        });
        getTypeProduct(res.data.product);
        return { success: true };
      } else {
        swal("Error", res.data.message || "Failed to add product", "error");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Failed to add product. Please try again.";
      swal("Error", errorMsg, "error");
      return { success: false, message: errorMsg };
    }
  };
  
  const getTypeProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/typeproduct`);
      console.log(res.data);
      if (res.data.success) {
        dispatch({
          type: GET_TYPE_PRODUCT,
          payload: res.data.typeProducts,
        });
        dispatch({
          type: LOADED,
          payload: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getTypeProduct = async (product) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/typeproduct/${product.catelory}`
      );
      console.log(res.data);
      if (res.data.success) {
        dispatch({
          type: SET_TYPE_PRODUCT,
          payload: {
            product,
            data: res.data.typeProduct.name,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const removeProduct = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/product/${id}`);
      if (res.data.success) {
        console.log(res.data.product);
        getProducts();
        return { success: true };
      } else {
        swal("Error", res.data.message || "Failed to delete product", "error");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Failed to delete product. Please try again.";
      swal("Error", errorMsg, "error");
      return { success: false, message: errorMsg };
    }
  };
  
  const removeTypeProduct = async (id) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/typeproduct/${id}`
      );
      if (res.data.success) {
        console.log(res.data.product);
        getTypeProducts();
        return { success: true };
      } else {
        swal("Error", res.data.message || "Failed to delete category", "error");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Failed to delete category. Please try again.";
      swal("Error", errorMsg, "error");
      return { success: false, message: errorMsg };
    }
  };
  
  const getProductForIndex = (index) => {
    return products[index];
  };
  
  const getTypeProductForIndex = (index) => {
    return typeProducts[index];
  };
  
  const updateProduct = async (id, dataForm) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/product/${id}`,
        dataForm
      );
      if (res.data.success) {
        dispatch({
          type: UPDATE_PRODUCT,
          payload: {
            id,
            product: res.data.product,
          },
        });
        getTypeProduct(res.data.product);
        return { success: true };
      } else {
        swal("Error", res.data.message || "Failed to update product", "error");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Failed to update product. Please try again.";
      swal("Error", errorMsg, "error");
      return { success: false, message: errorMsg };
    }
  };
  
  const addTypeProduct = async (dataForm) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/typeproduct`,
        dataForm
      );
      if (res.data.success) {
        getTypeProducts();
        return { success: true };
      } else {
        swal("Error", res.data.message || "Failed to add category", "error");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Failed to add category. Please try again.";
      swal("Error", errorMsg, "error");
      return { success: false, message: errorMsg };
    }
  };
  
  const updateTypeProduct = async (id, dataForm) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/typeproduct/${id}`,
        dataForm
      );
      if (res.data.success) {
        getTypeProducts();
        return { success: true };
      } else {
        swal("Error", res.data.message || "Failed to update category", "error");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Failed to update category. Please try again.";
      swal("Error", errorMsg, "error");
      return { success: false, message: errorMsg };
    }
  };
  
  const adminValue = {
    isLoading,
    products,
    typeProducts,
    getProducts,
    getTypeProduct,
    getTypeProducts,
    addProduct,
    removeProduct,
    getProductForIndex,
    getTypeProductForIndex,
    updateProduct,
    removeTypeProduct,
    addTypeProduct,
    updateTypeProduct,
  };
  
  return (
    <adminContext.Provider value={adminValue}>{children}</adminContext.Provider>
  );
};

export default AdminProvider;
