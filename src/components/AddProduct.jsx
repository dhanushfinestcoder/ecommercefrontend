import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Button, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AddProduct() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: "20px auto" };
  const [productName, setProductName] = useState('');
  const [noOfUnits, setNoOfUnits] = useState('');
  const [mrp, setMrp] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Input validation to ensure proper numbers
    if (!productName || !noOfUnits || !mrp || !discountPrice || !categoryId) {
      console.error("All fields are required!");
      return;
    }

    if (isNaN(noOfUnits) || isNaN(mrp) || isNaN(discountPrice) || isNaN(categoryId)) {
      console.error("Please enter valid numbers for No of Units, MRP, Discount Price, and Category ID!");
      return;
    }

    const product = {
      productName,
      noOfUnits: parseInt(noOfUnits),
      mrp: parseFloat(mrp),
      discountPrice: parseFloat(discountPrice),
      category: { categoryId: parseInt(categoryId) }, // Assuming `categoryId` maps to an existing category
    };

    try {
      const response = await fetch("http://localhost:8080/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        console.log("Product added successfully");
        setProductName('');
        setNoOfUnits('');
        setMrp('');
        setDiscountPrice('');
        setCategoryId('');
      } else {
        console.error("Failed to add product. Status:", response.status);
      }
    } catch (error) {
      console.error("Error while adding product:", error);
    }
  };

  return (
    <Box>
      {/* AppBar with Back Button */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Add Product
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Form Content */}
      <Container>
        <Paper elevation={3} style={paperStyle}>
          <h2 style={{ color: "black" }}>Add Product</h2>

          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          
          <TextField
            label="Number of Units"
            variant="outlined"
            fullWidth
            value={noOfUnits}
            onChange={(e) => setNoOfUnits(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          
          <TextField
            label="MRP"
            variant="outlined"
            fullWidth
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          
          <TextField
            label="Discount Price"
            variant="outlined"
            fullWidth
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          
          <TextField
            label="Category ID"
            variant="outlined"
            fullWidth
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              margin: "20px 0",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          >
            Add New Product
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
