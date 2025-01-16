import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios';

const Filters = ({ onApplyFilters }) => {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend (modify URL to match your API)
    axios
      .get('http://localhost:8080/categories')
      .then((response) => {
        setCategories(response.data); // Assuming the API returns an array of categories
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handlePriceChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleApplyFilters = () => {
    // Apply the filters when the user clicks on "Apply"
    onApplyFilters({
      category,
      minPrice,
      maxPrice,
    });
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h6">Filters</Typography>

      {/* Category Filter */}
      <FormControl fullWidth sx={{ marginBottom: '16px' }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          label="Category"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {categories.map((categoryItem) => (
            <MenuItem key={categoryItem.id} value={categoryItem.name}>
              {categoryItem.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range Filter */}
      <Typography variant="body2" sx={{ marginBottom: '8px' }}>
        Price Range: ₹{minPrice} - ₹{maxPrice}
      </Typography>
      <Slider
        value={[minPrice, maxPrice]}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `₹${value}`}
        min={0}
        max={10000}
        step={500}
      />

      {/* Apply Filters Button */}
      <Box sx={{ marginTop: '16px' }}>
        <button onClick={handleApplyFilters}>Apply Filters</button>
      </Box>
    </Box>
  );
};

export default Filters;
