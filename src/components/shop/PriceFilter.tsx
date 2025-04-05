import React from 'react';
import { Form } from 'react-bootstrap';

interface PriceFilterProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ priceRange, onPriceChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value) || 0;
    onPriceChange([min, priceRange[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value) || 0;
    onPriceChange([priceRange[0], max]);
  };

  return (
    <div className="price-filter">
      <h5>Price Range</h5>
      <div className="d-flex align-items-center gap-2">
        <Form.Control
          type="number"
          value={priceRange[0]}
          onChange={handleMinChange}
          placeholder="Min"
        />
        <span>to</span>
        <Form.Control
          type="number"
          value={priceRange[1]}
          onChange={handleMaxChange}
          placeholder="Max"
        />
      </div>
    </div>
  );
};

export default PriceFilter; 