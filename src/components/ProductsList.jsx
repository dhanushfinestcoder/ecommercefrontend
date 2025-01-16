import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Box, Button, Card, CardContent, CardMedia, Pagination } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductsList = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 5; // Number of products to show per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getProductsByCategory/${categoryId}`, {
          withCredentials: true
        });
        setProducts(response.data); 
        setTotalPages(Math.ceil(response.data.length / productsPerPage)); // Calculate total pages
      } catch (error) {
        setError(error.message);  
      } finally {
        setLoadingProducts(false);  
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  // Calculate the products to display on the current page
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loadingProducts) {
    return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center' }}>Error: {error}</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Button
        variant="contained"
        onClick={() => navigate('/Categories')}
        sx={{ marginBottom: '20px', backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#283593' }}}
      >
        Back to Categories
      </Button>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, marginBottom: '20px' }}>
        Products in Category {categoryId}
      </Typography>

      {currentProducts.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          {currentProducts.map((obj) => (
            <Card
              key={obj.productId}
              sx={{
                width: '300px',
                borderRadius: '8px',
                padding:'30px',
                boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                alt={obj.productName}
                sx={{ objectFit: 'contain' }}
              />
              <CardContent sx={{ padding: '16px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {obj.productName}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ marginBottom: '8px' }}>
                  ₹{obj.discountPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', marginBottom: '8px' }}>
                  MRP: ₹{obj.mrp}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Units Available: {obj.noOfUnits}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography>No products found for this category.</Typography>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ProductsList;
