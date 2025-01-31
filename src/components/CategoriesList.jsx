import React, { useState, useEffect } from 'react';
import { ListItem, ListItemText, CircularProgress, Typography, Box, Button, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Appbar from './Appbar';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect triggered'); // Check if useEffect is triggered

    const fetchCategories = async () => {
      try {
        console.log('Making API request...');
        const response = await axios.get('http://localhost:8080/getCategories', {
          withCredentials: true,
        });

        // Log the API response for debugging
        console.log('API Response:', response.data);

        // Ensure response.data is an array, else set empty array
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        // Log error to debug response structure
        console.log('Error caught in catch block:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  if (loadingCategories) {
    return (
      <>
        <Appbar />
        <CircularProgress sx={{ margin: 'auto', display: 'block', marginTop: '20px' }} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Appbar />
        <Typography color="error" sx={{ textAlign: 'center', marginTop: '20px' }}>
          Error: {error}
        </Typography>
      </>
    );
  }

  return (
    <>
      <Appbar />
      <Box sx={{ padding: '20px' }}>
        {/* Back to AppBar Button */}
        <Button
          variant="contained"
          onClick={() => navigate("/home")} // Navigate to the home page or AppBar page
          sx={{
            marginBottom: '30px',
            backgroundColor: '#3f51b5',
            '&:hover': { backgroundColor: '#283593' },
          }}
        >
          Go Back to Main Menu
        </Button>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', marginBottom: '30px' }}>
          Categories
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map((category) => (
            <Card
              key={category.categoryId || category.name} // Use a fallback for categoryId if it's missing
              sx={{
                borderRadius: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                },
                backgroundColor: '#ffffff',
                padding: '16px',
              }}
            >
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.categoryName || 'Category'}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '10px 10px 0 0',
                    marginBottom: '16px',
                  }}
                />
              )}

              <ListItem button onClick={() => navigate(`/products/${category.categoryId}`)}>
                <ListItemText
                  primary={category.categoryName || 'Unnamed Category'}
                  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#3f51b5',
                    fontSize: '18px',
                  }}
                />
              </ListItem>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default CategoriesList;
