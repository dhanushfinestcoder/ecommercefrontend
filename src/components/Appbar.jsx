import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress,
  Pagination,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/user-info', { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => setError('Failed to load user data.'));
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
    setError(null);
    setIsSearching(true);

    const splitSearch = searchTerm.split(' ');
    const searchKeyword = splitSearch.filter((item) => isNaN(item)).join(' ');
    let maxPriceValue = 0;

    splitSearch.forEach((item) => {
      if (!isNaN(item) && item.trim()) {
        maxPriceValue = Math.max(maxPriceValue, parseFloat(item));
      }
    });

    const apiUrl =
      maxPriceValue > 0
        ? `http://localhost:8080/search/price?keyword=${encodeURIComponent(searchKeyword)}&maxPrice=${maxPriceValue}`
        : `http://localhost:8080/SEARCH?keyword=${encodeURIComponent(searchKeyword)}`;

    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
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

  const handleLogout = () => {
    setUser(null);
    handleUserMenuClose();
  };

  const handleStopSearch = () => {
    setIsSearching(false);
    setSearchTerm('');
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
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate('/home')}>Home</MenuItem>
            <MenuItem onClick={() => navigate('/add-category')}>Add Category</MenuItem>
            <MenuItem onClick={() => navigate('/products')}>View Products</MenuItem>
          </Menu>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Search>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {user ? (
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

      <Box sx={{ padding: 2 }}>
        {isSearching ? (
          loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Search Results</Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer', color: 'blue' }}
                  onClick={handleStopSearch}
                >
                  Clear Search
                </Typography>
              </Box>
              {products.length > 0 ? (
                products.map((product) => (
                  <Card key={product.id} sx={{ marginBottom: '16px', display: 'flex' }}>
                    <CardMedia
                      component="img"
                      alt={product.productName}
                      height="140"
                      image={product.imageUrl || 'https://via.placeholder.com/150'}
                      sx={{ width: '150px' }}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.productName}</Typography>
                      <Typography variant="body1">₹{product.discountPrice}</Typography>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                        ₹{product.mrp}
                      </Typography>
                      <Typography variant="body2">Units Available: {product.noOfUnits}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No products found.</Typography>
              )}
              <Pagination
                count={Math.ceil(products.length / 10)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ marginTop: 2 }}
              />
            </>
          )
        ) : null}
      </Box>
    </Box>
  );
}
