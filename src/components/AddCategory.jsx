import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Button, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AddCategory() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: "20px auto" };
  const [categoryName, setCategoryName] = useState('');
  const [categoryAddedDate, setCategoryAddedDate] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleClick = async (e) => {
    e.preventDefault();
    
    // Ensure that the date is in a valid format
    const formattedDate = new Date(categoryAddedDate).toISOString(); // Convert to ISO string

    const category = { categoryName, categoryAddedDate: formattedDate };
    console.log(categoryName);
    console.log(categoryAddedDate);

    if (!categoryName || !categoryAddedDate) {
      console.error("Category Name and Date are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/addCat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
        credentials: "include",
      });

      if (response.ok) {
        console.log("New Category Added Successfully");
        setCategoryName('');
        setCategoryAddedDate('');
      } else {
        console.error("Failed to add category. Response status:", response.status);
      }
    } catch (error) {
      console.error("Error while adding category:", error);
    }
  };

  const handleBack = () => {
    navigate(-1); 
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
            Add Category
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Form Content */}
      <Container>
        <Paper elevation={3} style={paperStyle}>
          <h2 style={{ color: "black" }}>Add Category</h2>
          
          {/* Category Name TextField */}
          <TextField
            id="outlined-basic"
            label="Category Name"
            variant="outlined"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ marginBottom: '20px' }} // Add margin bottom to create space between fields
          />
          
          {/* Category Date TextField */}
          <TextField
            id="filled-basic"
            label="Category Date"
            variant="filled"
            fullWidth
            type="date" // Use the correct input type for date
            value={categoryAddedDate}
            onChange={(e) => setCategoryAddedDate(e.target.value)}
            sx={{ marginBottom: '20px' }} // Add margin bottom to create space between fields
          />
          
          {/* Add Category Button */}
          <Button
            variant="contained"
            color="success"
            onClick={handleClick}
            style={{
              padding: "10px 20px",
              margin: "20px 0",  // Add margin to space out from fields
              fontSize: "16px",
              borderRadius: "8px",
            }}
          >
            Add New Category
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
