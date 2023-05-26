import React, { useState } from "react";
import { Box, Button,  Typography, useTheme, TextField } from '@mui/material';
import { tokens } from "../../theme";
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import AddCategory from "../../components/POS/AddCategory";
import AddProduct from "../../components/POS/AddProduct";
import Products from "../../components/POS/Products";
import Category from "../../components/POS/Category";
import Transactions from "../../components/POS/Tansactions";
import CategoryCard from "../../components/POS/CategoryCard"
import ProductCard from "../../components/POS/ProductCard"
import Invoice from "../../components/POS/Invoice";
import PropTypes from 'prop-types';
import CalculationHandler from "../../components/POS/CalculationHandler";

function POS(props){ 

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {isClicked, onClick } = props;
    const [selectedCategory, setSelectedCategory] = useState("");
    const calculationHandler = new CalculationHandler();
    const [products, setProducts] = useState([]);
    const totalPrice = calculationHandler.getTotalPrice();

  const addProduct = (product) => {
    // Check if the product already exists in the products array
    calculationHandler.addProduct(product, setProducts);
  };

  const removeProduct = (productId) => {
    calculationHandler.removeProduct(productId);
  };

  const updateProductQuantity = (productId, newQuantity) => {
    calculationHandler.updateProductQuantity(productId, newQuantity);
  };

  const updateProductPrice = (productId, newPrice) => {
    calculationHandler.updateProductPrice(productId, newPrice);
  };


    const handleCategoryClick = (category_name) => {
        setSelectedCategory(category_name);
      };
    

    return(
        <Box p="20px" >
            <Grid container rowSpacing={2}>
                <Grid item xs={2} backgroundColor={colors.primary[400]}> </Grid>
                <Grid item xs={2} backgroundColor={colors.primary[400]}> </Grid>
                <Grid item xs={2} backgroundColor={colors.primary[400]}> </Grid>

                <Grid item xs={2} backgroundColor={colors.primary[400]} paddingBottom={1.5}>
                    <ButtonGroup>
                        <Products />
                        <AddProduct/>
                    </ButtonGroup>
                    
                </Grid>

                <Grid item xs={2} backgroundColor={colors.primary[400]}>
                    <ButtonGroup aria-label="button group">
                        <Category/>
                        <AddCategory/>  
                    </ButtonGroup>
                </Grid>

                <Grid item xs={2} backgroundColor={colors.primary[400]}>
                    <Transactions/>
                </Grid>

                <Grid item xs={4} md={4}>
                    <Invoice products={products}
                    removeProduct={removeProduct}
                    updateProductQuantity={updateProductQuantity}
                    updateProductPrice={updateProductPrice}/>
                    
                </Grid>
                <Grid item xs={8} md={8}>
        
                    <Box>
                        <CategoryCard onCategoryClick={handleCategoryClick}/>
                    </Box>
                        <hr></hr>
                    <Box marginTop={3}>
                        {selectedCategory && <ProductCard selectedCategory={selectedCategory} onAddProduct={addProduct}/>}
                    </Box>

                </Grid>
                
            </Grid>
            
                  
          
        </Box>
        
    );
};

POS.propTypes = {
    selectedCategory: PropTypes.string.isRequired,
    isClicked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  };
  

export default POS;