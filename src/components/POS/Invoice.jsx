import React from "react";
import { useState, useEffect } from "react";
import { Box, Grid, Typography, TextField, IconButton, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import { useTheme } from "@mui/material";
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

const Invoice = ({
    products,
    removeProduct,
    updateProductPrice,
  }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const [gridKey, setGridKey] = useState(0);

  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [products]);

  useEffect(() => {
    // Force re-rendering of the DataGrid when products change
    setGridKey((prevKey) => prevKey + 1);
  }, [products]);


  const saveInvoiceToFirestore = async (invoiceData) => {
    try {
      // Add the invoice data to the "invoices" collection in Firestore
      const docRef = await addDoc(collection(db, "invoices"), invoiceData);
      console.log("Invoice saved with ID:", docRef.id);
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const handlePay = () => {
    // Generate invoice data
    const invoiceData = {
      products: products,
      totalItems: totalItems,
      total: total,
      // Include any other relevant invoice data
    };
  
    // Save the invoice to Firestore
    saveInvoiceToFirestore(invoiceData);
  
    // Print the invoice to a text file
    printInvoiceToFile(invoiceData);
  };

  const printInvoiceToFile = (invoiceData) => {
    const invoiceText = generateInvoiceText(invoiceData);
    const fileName = "invoice.txt";
  
    // Create a new Blob with the invoice text content
    const blob = new Blob([invoiceText], { type: "text/plain" });
  
    // Create a temporary anchor element to download the file
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
  
    // Trigger a click event on the anchor element to start the download
    downloadLink.click();
  
    // Clean up the temporary anchor element
    URL.revokeObjectURL(downloadLink.href);
    downloadLink.remove();
  };

  const generateInvoiceText = (invoiceData) => {
    // Create a string representation of the invoice data
    let invoiceText = `Invoice\n\n`;
    invoiceText += `Products:\n`;
    invoiceData.products.forEach((product, index) => {
      invoiceText += `${index + 1}. ${product.product_name} - Quantity: ${product.quantity}, Price: ${product.price}, Total: ${product.total}\n`;
    });
    invoiceText += `\nTotal Items: ${invoiceData.totalItems}\n`;
    invoiceText += `Total: ${invoiceData.total}\n`;
  
    return invoiceText;
  };

  const calculateProductTotal = (product) => {
    const quantity = product.quantity || 0;
    const price = product.price || 0;
    return quantity * price;
  };

  const updateProductQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId);
      if (product) {
        product.quantity = newQuantity;
        console.log(product)
        calculateTotal();
      }
      else{console.log(productId, this.products)}
  };

  const calculateTotal = () => {
    let calculatedTotal = 0;
    let totalItems = 0;
    products.forEach((product) => {
      const quantity = product.quantity || 0;
      const price = product.price || 0;
      const productTotal = quantity * price;
      calculatedTotal += productTotal;
      totalItems += product.quantity;
      product.total = productTotal;
    });
    setTotal(calculatedTotal);
    setTotalItems(totalItems);
  };

  const columns = [
    { field: "id", headerName: "#", flex: 1 },
    {
      field: "product_name",
      headerName: "Name",
      cellClassName: "name-column--cell",
    },
    { field: "quantity", headerName: "QTY", flex: 1,},
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
        field: "total",
        headerName: "Total",
        type: "number",
        headerAlign: "left",
        flex: 1,
        align: "left",
        valueGetter: (params) => calculateProductTotal(params.row),
      },
      {
        field: "cellFunctions",
        headerName: "",
        renderCell: (params) => {
          const handleDecrease = () => {
            if (params.row.quantity > 0) {
              const newQuantity = params.row.quantity - 1;
              const updatedRow = { ...params.row, quantity: newQuantity };
              params.api.updateRows([{ id: params.id, ...updatedRow }]);
              updateProductQuantity(params.id, newQuantity);
            }
          };
      
          const handleIncrease = () => {
            const newQuantity = params.row.quantity + 1;
            const updatedRow = { ...params.row, quantity: newQuantity };
            params.api.updateRows([{ id: params.id, ...updatedRow }]);
            updateProductQuantity(params.id, newQuantity);
          };
          return (
            <Box>
              <IconButton width={10} variant="contain" onClick={handleDecrease}>
              <RemoveIcon />
            </IconButton>
            
            <IconButton variant="contain" onClick={handleIncrease}>
              <AddIcon />
            </IconButton>
            </Box>
          );
        },
      },
    
  ];

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId);
    const price = product.price || 0;
    const newTotal = newQuantity * price;
    product.total = newTotal;
    calculateTotal();
  };

  const handlePriceChange = (productId, newPrice) => {
    updateProductPrice(productId, newPrice);
  };

  const handleRemoveProduct = (productId) => {
    removeProduct(productId);
  };

  return (
    <Box>
      
      <Box
        height="50vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
            hideFooter
            rows={products}
            columns={columns}
            onCellValueChange={(params) => {
              const { id, field, value } = params;
              if (field === 'quantity') {
                handleQuantityChange(id, value);
              }
            }}
            sx={{
                boxShadow: 2,
                border: 2,
                borderColor: 'primary.light',
                
              }}
        />
      </Box>
      <Box>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={6} backgroundColor={colors.primary[400]} paddingBottom={1.5}>
                                <Typography variant="h5" sx={{marginTop: 2}}>
                                    Total Item(s): {totalItems}
                                </Typography>
                                <Typography variant="h5" sx={{marginTop: 2}}>
                                    Discount: <TextField id="standard-basic" size="small" variant="standard" sx={{width: 125, marginLeft: 1}}/>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} backgroundColor={colors.primary[400]} paddingBottom={1.5}>
                                <Typography variant="h1">
                                    Total: {total}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} backgroundColor={colors.primary[400]} paddingBottom={1.5}>
                                <Grid container rowSpacing={2}>
                                    <Grid item xs={4} paddingBottom={1.5}>
                                        <Button variant="contained" color="error" startIcon={<DoNotDisturbAltOutlinedIcon />}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item xs={4} paddingBottom={1.5}>
                                        <Button variant="contained" color="warning" startIcon={<PanToolOutlinedIcon />}>
                                            Hold
                                        </Button>
                                    </Grid>
                                    <Grid item xs={4} paddingBottom={1.5}>
                                        <Button variant="contained" color="success" startIcon={<PaymentsOutlinedIcon />} onClick={handlePay}>
                                            Pay
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
    </Box>
  );
};

Invoice.propTypes = {
    products: PropTypes.array.isRequired,
    removeProduct: PropTypes.func.isRequired,
    updateProductQuantity: PropTypes.func.isRequired,
    updateProductPrice: PropTypes.func.isRequired,
};

export default Invoice;
