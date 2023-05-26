import React, { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ProductList = ({ selectedCategory, onAddProduct }) => {
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      const fetchProducts = async () => {
        const productCollection = collection(db, "Product");
        const productQuery = query(productCollection, where("category_name", "==", selectedCategory));
        const productSnapshot = await getDocs(productQuery);
        const productsData = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      };
      fetchProducts();
    }, [selectedCategory]);

    const handlePlus = (productId, productName, price) => {
      const product = { id: productId, product_name: productName, price: price, quantity: 1}; // Replace with actual product data
     onAddProduct(product);
    };
  
    const handleMinus = (productId) => {
    
    };

  return (
    <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "left",
       }}>
      {products.map((product) => (
        <Box
          key={product.id}
          sx={{
            width: 180,
            height: 100,
            position: "relative",
            marginBottom: 2,
            marginLeft:3,
            cursor: "pointer"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0, 
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          ></div>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              position: "absolute",
              marginLeft: 3,
              marginTop: 1,
              zIndex: 1,
              fontWeight: "bold",
            }}
          >
            {product.product_name}
          </Typography>
          <Typography
            variant="p"
            sx={{
              color: "white",
              position: "absolute",
              marginLeft: 8,
              marginTop: 5,
              zIndex: 1,
              fontWeight: "bold",
            }}
          >
            {product.price} php
          </Typography>
          <img
            src={product.url}
            alt={product.product_name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              left: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginLeft: "auto",
              marginRight: "auto",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <Button variant="contain" onClick={() => handleMinus(product.id)}>
              <RemoveIcon />
            </Button>
            
            <Button variant="contain" onClick={() => handlePlus(product.id, product.product_name, product.price)}>
              <AddIcon />
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

ProductList.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
};

export default ProductList;
