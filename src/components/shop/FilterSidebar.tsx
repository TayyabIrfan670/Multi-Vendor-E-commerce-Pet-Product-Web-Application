import React, { useState } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import '../../assets/styles/filter-sidebar.css';

// Sample data for categories and brands
const categories = [
  { id: 1, name: 'Dog Food' },
  { id: 2, name: 'Cat Food' },
  { id: 3, name: 'Dog Toys' },
  { id: 4, name: 'Cat Toys' },
  { id: 5, name: 'Dog Accessories' },
  { id: 6, name: 'Cat Accessories' },
  { id: 7, name: 'Health & Wellness' },
  { id: 8, name: 'Grooming' }
];

const brands = [
  { id: 1, name: 'Royal Canin' },
  { id: 2, name: 'Pedigree' },
  { id: 3, name: 'Whiskas' },
  { id: 4, name: 'Purina' },
  { id: 5, name: 'Hill\'s Science Diet' },
  { id: 6, name: 'Kong' },
  { id: 7, name: 'Friskies' },
  { id: 8, name: 'Blue Buffalo' }
];

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  categories: number[];
  priceRange: {
    min: number;
    max: number;
  };
  brands: number[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: {
      min: 0,
      max: 1000
    },
    brands: []
  });

  const handleCategoryChange = (categoryId: number) => {
    const updatedCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    const updatedFilters = {
      ...filters,
      categories: updatedCategories
    };
    
    setFilters(updatedFilters);
    if (onFilterChange) onFilterChange(updatedFilters);
  };

  const handleBrandChange = (brandId: number) => {
    const updatedBrands = filters.brands.includes(brandId)
      ? filters.brands.filter(id => id !== brandId)
      : [...filters.brands, brandId];
    
    const updatedFilters = {
      ...filters,
      brands: updatedBrands
    };
    
    setFilters(updatedFilters);
    if (onFilterChange) onFilterChange(updatedFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const updatedFilters = {
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: numValue
      }
    };
    
    setFilters(updatedFilters);
    if (onFilterChange) onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const resetFilters = {
      categories: [],
      priceRange: {
        min: 0,
        max: 1000
      },
      brands: []
    };
    
    setFilters(resetFilters);
    if (onFilterChange) onFilterChange(resetFilters);
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h4>Filters</h4>
        <Button 
          variant="link" 
          className="clear-filters" 
          onClick={handleClearFilters}
        >
          Clear All
        </Button>
      </div>

      <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Shop by Categories</Accordion.Header>
          <Accordion.Body>
            <Form>
              {categories.map(category => (
                <Form.Check 
                  key={category.id}
                  type="checkbox"
                  id={`category-${category.id}`}
                  label={category.name}
                  checked={filters.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="mb-2"
                />
              ))}
            </Form>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Filter by Price</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Min Price ($)</Form.Label>
                <Form.Control 
                  type="number" 
                  min="0" 
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Max Price ($)</Form.Label>
                <Form.Control 
                  type="number" 
                  min="0" 
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                />
              </Form.Group>
              <div className="price-range-display">
                Price Range: ${filters.priceRange.min} - ${filters.priceRange.max}
              </div>
            </Form>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Filter by Brand</Accordion.Header>
          <Accordion.Body>
            <Form>
              {brands.map(brand => (
                <Form.Check 
                  key={brand.id}
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  label={brand.name}
                  checked={filters.brands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                  className="mb-2"
                />
              ))}
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Button 
        variant="primary" 
        className="apply-filters-btn mt-3"
        onClick={() => onFilterChange && onFilterChange(filters)}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar; 