import * as React from 'react';
import { Button,  Typography, useTheme, TextField, FormControl } from '@mui/material';
import { tokens } from "../../theme";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useState } from 'react';
import {storage} from '../../firebase-storage-config';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import "firebase/storage";
import "firebase/firestore";


export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [categoryName, setCategoryName] = useState('');
  const [image, setImage] = useState(null);

  // Get Category name from input using onChange()
  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };
  // Get image file from file input using onChange()
  const handleImageChange = event => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `category_images/${image.name}`);
    await uploadBytes(storageRef, image)
    const imageUrl = await getDownloadURL(storageRef);

    // Add new document to Firestore
    const datas = collection(db, "Category");
    await addDoc(datas, {
      url: imageUrl,
      category_name: categoryName
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
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
                  variant="h3"
                  fontWeight="600"
                  color={colors.grey[100]}
                  align="center"
                >
                  Add Category
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            paddingBottom:0,
          }}
        >
          <form onSubmit={handleSubmit}>
          <FormControl fullWidth='true'>
              <TextField onChange={handleCategoryNameChange} value={categoryName}  id="standard-basic" margin='dense' label="Category Name" variant="standard" size='normal'/>
              <TextField onChange={handleImageChange} id="standard-basic" margin='dense' type="file" label="Upload Image" variant="standard" InputLabelProps={{shrink: true,}} size='normal' />
              
            </FormControl>
            <DialogActions>
        <Button onClick={handleSubmit}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              paddingRight: 1,
              paddingLeft: 1,
              marginTop: 2,
            }}

            type="submit"
          >
            Add
          </Button>
          <Button onClick={handleClose}
            sx={{
              backgroundColor: colors.redAccent[600],
              color: colors.grey[100],
              marginTop: 2,
            }}
          >Cancel
          </Button>
          
        </DialogActions>
            
          </form>
        </DialogContent>
        
      </Dialog>
    </div>
  );
}
