import * as React from 'react';
import { Button,  Typography, useTheme, Select, FormControl, InputLabel, MenuItem, TextField, NativeSelect} from '@mui/material';
import { tokens } from "../../theme";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useEffect } from 'react';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {storage} from '../../firebase-storage-config';


export default function AddProduct() {
  const [open, setOpen] = React.useState(false);
  const [CategoryTable, setCategoryTable] = React.useState([])
  const categoryCollectionRef = collection(db, "Category")
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(categoryCollectionRef);
      setCategoryTable(data.docs.map(doc => ({ value: doc.category_name, label: doc.data().category_name })));
    };
  
    fetchData();
  }, []);

  const [categoryName, setCategoryName] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [image, setImage] = React.useState(null);

  // Get Category name from input using onChange()
  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };
  // Get image file from file input using onChange()
  const handleImageChange = event => {
    setImage(event.target.files[0]);
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `product_images/${image.name}`);
    await uploadBytes(storageRef, image)
    const imageUrl = await getDownloadURL(storageRef);

    // Add new document to Firestore
    const datas = collection(db, "Product");
    await addDoc(datas, {
      url: imageUrl,
      category_name: categoryName,
      product_name: productName,
      price:price
    }).then(()=>{
      alert("Category Added");
    }); ;
      setImage(null);
      handleClose();
      };


  


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button 
        sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              paddingRight: 1,
              paddingLeft: 1,
            }}
            onClick={handleClickOpen}
      >

        <AddIcon />
      </Button>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth="true"
      >
        <DialogTitle id="alert-dialog-title">
        <Typography
                  variant="h3"
                  fontWeight="600"
                  color={colors.grey[100]}
                  align="center"
                >
                  Add Product
          </Typography>
        </DialogTitle>
        <DialogContent >
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth='true'>
                <InputLabel  variant="standard" htmlFor="uncontrolled-native">
                    Category
                </InputLabel>
                <NativeSelect onChange={handleCategoryNameChange}>
                    {CategoryTable.map((option) => (
                      <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                    ))}
                </NativeSelect>
                <TextField onChange={handleProductNameChange} id="standard-basic" margin='dense' label="Product Name" variant="standard" size='normal'/>
                <TextField onChange={handlePriceChange} id="standard-basic" margin='dense' label="Price" variant="standard" size='normal'/>
                <TextField onChange={handleImageChange} id="standard-basic" margin='dense' type="file" label="Upload Image" variant="standard" InputLabelProps={{shrink: true,}} size='normal' />
            </FormControl>
            <DialogActions>
                  <Button onClick={handleClose}
                      sx={{
                        backgroundColor: colors.redAccent[600],
                        color: colors.grey[100],
                        
                      }}
                    >Cancel
                    </Button>
                    <Button onClick={handleSubmit}
                      sx={{
                        backgroundColor: colors.greenAccent[600],
                        color: colors.grey[100],
                        paddingRight: 1,
                        paddingLeft: 1,
                      }}
                    >
                      Add
                    </Button>
                </DialogActions>
            </form>
            
        </DialogContent>
        
      </Dialog>
    </div>
  );
}
