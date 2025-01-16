import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CategoriesList from './CategoriesList';
import { Card, CardContent, CardMedia, CircularProgress, Pagination } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '400px',
  },
  margin: '0 auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export default function Appbar() {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // For main menu
  const [userAnchorEl, setUserAnchorEl] = useState(null); // For user dropdown
  const [viewCategories, setViewCategories] = useState(false);
  const [user, setUser] = useState(null); // For dynamic user data
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [searchTerm, setSearchTerm] = useState(''); // Store search term
  const [products, setProducts] = useState([]); // Store product data
  const [viewAllProducts, setViewAllProducts] = useState(false); // For viewing all products
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data dynamically
    axios
      .get('http://localhost:8080/user-info', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load user data.');
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Search term cannot be empty.');
      return;
    }

    setLoading(true);
    setViewAllProducts(false); // Switch to search results
    axios
      .get(`http://localhost:8080/SEARCH?keyword=${encodeURIComponent(searchTerm)}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching products');
        setLoading(false);
      });
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleUserMenuClick = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const handleAddCategoryClick = () => {
    navigate('/add-category');
    handleMenuClose();
  };

  const handleViewCategoriesClick = () => {
    setViewCategories(true);
    handleMenuClose();
  };

  const handleViewProductsClick = () => {
    setLoading(true);
    setError(null);
    setViewAllProducts(true); // Switch to view all products
    axios
      .get('http://localhost:8080/getProducts', { withCredentials: true }) // Replace with the correct endpoint
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching all products.');
        setLoading(false);
      });
    handleMenuClose();
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    handleUserMenuClose();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Ecommerce
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Search>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {loading ? (
              <Typography variant="body2">Loading...</Typography>
            ) : error ? (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            ) : user ? (
              <>
                <IconButton onClick={handleUserMenuClick} size="small">
                  <Avatar alt={user.name} src={user.picture} />
                </IconButton>
                <Menu
                  anchorEl={userAnchorEl}
                  open={Boolean(userAnchorEl)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem>
                    <Typography variant="body1">
                      <strong>{user.name}</strong>
                    </Typography>
                  </MenuItem>
                  <MenuItem>{user.email}</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Typography variant="body2">No user info</Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleAddCategoryClick}>Add Category</MenuItem>
        <MenuItem onClick={handleViewCategoriesClick}>View Categories</MenuItem>
        <MenuItem onClick={handleViewProductsClick}>View Products</MenuItem>
      </Menu>
      {viewCategories && <CategoriesList />}
      <Box sx={{ padding: '16px' }}>
        {loading && <CircularProgress sx={{ margin: 'auto', display: 'block' }} />}
        {error && <Typography variant="body2" color="error">{error}</Typography>}
        {products.length > 0 ? (
          <>
            <Typography variant="h6">
              {viewAllProducts ? 'All Products:' : 'Search Results:'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              {products.map((product) => (
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
                      Units Available: {product.noOfunits}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Pagination
                count={Math.ceil(products.length / 5)} // Adjust items per page
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        ) : (
          <Typography>No products found</Typography>
        )}
      </Box>
    </Box>
  );
}
