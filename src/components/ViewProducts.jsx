import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Card, CardContent, CardMedia, Typography, Pagination, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ViewProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get current page from URL query parameters
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    setCurrentPage(page);

    // Fetch all products
    setLoading(true);
    axios
      .get('http://localhost:8080/getProducts', { withCredentials: true })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching products.');
        setLoading(false);
      });
  }, [location.search]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);

    // Update URL with the new page number
    navigate(`?page=${value}`);
  };

  const handleBackButton = () => {
    // Go to the previous page in browser history
    navigate(-1);
  };

  // Calculate products to display on current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Box sx={{ padding: '16px', position: 'relative' }}>
      {/* Back Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleBackButton}
        sx={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1 }}
      >
        Back
      </Button>

      {loading ? (
        <CircularProgress sx={{ margin: 'auto', display: 'block' }} />
      ) : error ? (
        <Typography variant="body2" color="error">{error}</Typography>
      ) : (
        <>
          <Typography variant="h6" sx={{ marginTop: '60px' }}>All Products:</Typography> {/* Added marginTop */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {currentProducts.map((product) => (
              <Card key={product.productId} sx={{ width: '300px', padding: '16px' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://via.placeholder.com/300x200" // Replace with actual image URL
                  alt={product.productName}
                />
                <CardContent>
                  <Typography variant="h6">{product.productName}</Typography>
                  <Typography variant="body1">₹{product.discountPrice}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    MRP: ₹{product.mrp}
                  </Typography>
                  <Typography variant="body2">
                    Units Available: {product.noOfUnits}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
              count={Math.ceil(products.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
