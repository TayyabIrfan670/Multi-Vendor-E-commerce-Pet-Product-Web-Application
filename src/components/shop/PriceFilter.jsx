import React, { useState, useEffect, useCallback } from 'react';
import '../../assets/styles/PriceFilter.css';

const PriceFilter = ({ priceRange, onPriceChange }) => {
  // Local state to track input values before sending to parent
  const [localMin, setLocalMin] = useState(priceRange.min);
  const [localMax, setLocalMax] = useState(priceRange.max);
  const [debouncedMin, setDebouncedMin] = useState(priceRange.min);
  const [debouncedMax, setDebouncedMax] = useState(priceRange.max);

  // Update local state when props change (e.g., when filters are reset)
  useEffect(() => {
    setLocalMin(priceRange.min);
    setLocalMax(priceRange.max);
    setDebouncedMin(priceRange.min);
    setDebouncedMax(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  // Debounce the min price changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedMin !== localMin) {
        setDebouncedMin(localMin);
        if (localMin >= 0 && localMin <= localMax) {
          onPriceChange({ ...priceRange, min: localMin });
        }
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [localMin, localMax, debouncedMin, priceRange, onPriceChange]);

  // Debounce the max price changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedMax !== localMax) {
        setDebouncedMax(localMax);
        if (localMax >= localMin) {
          onPriceChange({ ...priceRange, max: localMax });
        }
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [localMax, localMin, debouncedMax, priceRange, onPriceChange]);

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLocalMin(value);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLocalMax(value);
    }
  };

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setLocalMax(value);
    setDebouncedMax(value);
    onPriceChange({ ...priceRange, max: value });
  };

  return (
    <div className="price-filter">
      <h3>Price Range (PKR)</h3>
      <div className="price-inputs">
        <div className="price-input-group">
          <label>Min Price</label>
          <input
            type="number"
            value={localMin}
            onChange={handleMinChange}
            min="0"
            placeholder="Min"
          />
        </div>
        <div className="price-input-group">
          <label>Max Price</label>
          <input
            type="number"
            value={localMax}
            onChange={handleMaxChange}
            min={localMin}
            placeholder="Max"
          />
        </div>
      </div>
      <div className="price-slider">
        <input
          type="range"
          min="0"
          max="50000"
          value={localMax}
          onChange={handleSliderChange}
        />
        <div className="price-labels">
          <span>PKR 0</span>
          <span>PKR {localMax.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter; 