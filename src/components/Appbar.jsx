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
import { CircularProgress, Pagination, Card, CardContent, CardMedia } from '@mui/material';

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
  const [user, setUser] = useState(null); // For dynamic user data
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [searchTerm, setSearchTerm] = useState(''); // Store search term
  const [products, setProducts] = useState([]); // Store product data
  const [viewAllProducts, setViewAllProducts] = useState(false); // For viewing all products
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [maxPrice, setMaxPrice] = useState(0); // Set a default maxPrice
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

    let splitSearch = searchTerm.split(' '); // Split the search term by spaces
    let searchKeyword = splitSearch.filter(item => isNaN(item)).join(' '); // Remove numbers for the keyword
    let maxPriceValue = 0;

    // Check if any part of the splitSearch array is a valid number and set it as maxPrice
    splitSearch.forEach(item => {
      if (!isNaN(item) && item.trim()) {
        maxPriceValue = Math.max(maxPriceValue, parseFloat(item)); // Keep the largest number as maxPrice
      }
    });

    setMaxPrice(maxPriceValue); // Set the maxPrice state

    // Log the result to verify the split
    console.log('Search Keyword:', searchKeyword);
    console.log('Max Price:', maxPriceValue);

    // Make the request with the correct keyword and maxPrice
    axios
      .get(`http://localhost:8080/search/price?keyword=${encodeURIComponent(searchKeyword)}&maxPrice=${maxPriceValue}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
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

  const handleViewCategoriesClick = () => {
    navigate('/categories'); // Navigate to the Categories page
    handleMenuClose();
  };

  const handleAddCategoryClick = () => {
    navigate('/add-category'); // Navigate to the Add Category page
    handleMenuClose();
  };

  const handleViewProductsClick = () => {
    navigate('/products'); // Navigate to the View Products page
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
        <MenuItem onClick={handleViewCategoriesClick}>View Categories</MenuItem>
        <MenuItem onClick={handleAddCategoryClick}>Add Category</MenuItem>
        <MenuItem onClick={handleViewProductsClick}>View Products</MenuItem>
      </Menu>
    </Box>
  );
}
