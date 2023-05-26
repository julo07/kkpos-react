import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';

const CategoryList = ({onCategoryClick}) => {
  const [categories, setCategories] = useState([]);

  

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryCollection = collection(db, "Category");
      const categorySnapshot = await getDocs(categoryCollection);
      const categoriesData = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  const handleClick = (category_name) => {
    onCategoryClick(category_name);
  };  

  return (

    
    <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "left",
       }}>
      {categories.map((category) => (
        <Box
        onClick={() => handleClick(category.category_name)}
        key={category.id}
        sx={{
          width: 180,
          height: 130,
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        ></div>
        <img
          
          src={category.url}
          alt={category.category_name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            color: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 1,
            fontWeight: "bold",
          }}
        >
          {category.category_name}
        </Typography>
      </Box>
      ))}
    </Box>
  );
};

CategoryList.propTypes = {
  onCategoryClick: PropTypes.func.isRequired,
};

export default CategoryList;
