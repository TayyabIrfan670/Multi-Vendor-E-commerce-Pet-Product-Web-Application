import React, { useState, useEffect } from 'react';
import ProductCard from '../components/shop/ProductCard';
import PriceFilter from '../components/shop/PriceFilter';
import { fetchProducts } from '../services/api';
import '../assets/styles/ShopPage.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          page: currentPage,
          limit: 12
        };
        
        // Add search query if present
        if (searchQuery.trim()) {
          filters.search = searchQuery.trim();
        }
        
        console.log('Applying filters:', filters);
        
        const response = await fetchProducts(filters);
        console.log('API Response:', response);
        setProducts(response.products || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, selectedSubcategory, priceRange, currentPage, searchQuery]);

  // Main categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Dogs', name: 'Dogs' },
    { id: 'Cats', name: 'Cats' },
    { id: 'Birds', name: 'Birds' },
    { id: 'Fish', name: 'Fish' },
    { id: 'Small Pets', name: 'Small Pets' },
    { id: 'Reptiles', name: 'Reptiles' }
  ];

  // Subcategories based on main category
  const getSubcategories = () => {
    if (selectedCategory === 'all') {
      return [
        { id: 'all', name: 'All Types' },
        { id: 'Food', name: 'Food' },
        { id: 'Toys', name: 'Toys' },
        { id: 'Pet Care', name: 'Pet Care' },
        { id: 'Grooming', name: 'Grooming' },
        { id: 'Accessories', name: 'Accessories' },
        { id: 'Health', name: 'Health & Wellness' }
      ];
    }
    
    // Return subcategories specific to the selected main category
    const subcategoriesMap = {
      'Dogs': [
        { id: 'all', name: 'All Dog Products' },
        { id: 'Food', name: 'Dog Food' },
        { id: 'Toys', name: 'Dog Toys' },
        { id: 'Pet Care', name: 'Dog Care' },
        { id: 'Grooming', name: 'Dog Grooming' },
        { id: 'Accessories', name: 'Dog Accessories' },
        { id: 'Health', name: 'Dog Health' }
      ],
      'Cats': [
        { id: 'all', name: 'All Cat Products' },
        { id: 'Food', name: 'Cat Food' },
        { id: 'Toys', name: 'Cat Toys' },
        { id: 'Pet Care', name: 'Cat Care' },
        { id: 'Grooming', name: 'Cat Grooming' },
        { id: 'Accessories', name: 'Cat Accessories' },
        { id: 'Health', name: 'Cat Health' }
      ],
      'Birds': [
        { id: 'all', name: 'All Bird Products' },
        { id: 'Food', name: 'Bird Food' },
        { id: 'Toys', name: 'Bird Toys' },
        { id: 'Pet Care', name: 'Bird Care' },
        { id: 'Accessories', name: 'Bird Accessories' },
        { id: 'Health', name: 'Bird Health' }
      ],
      'Fish': [
        { id: 'all', name: 'All Fish Products' },
        { id: 'Food', name: 'Fish Food' },
        { id: 'Accessories', name: 'Aquarium Supplies' },
        { id: 'Tanks', name: 'Tanks & Bowls' }
      ],
      'Small Pets': [
        { id: 'all', name: 'All Small Pet Products' },
        { id: 'Food', name: 'Small Pet Food' },
        { id: 'Toys', name: 'Small Pet Toys' },
        { id: 'Pet Care', name: 'Small Pet Care' },
        { id: 'Accessories', name: 'Small Pet Accessories' }
      ],
      'Reptiles': [
        { id: 'all', name: 'All Reptile Products' },
        { id: 'Food', name: 'Reptile Food' },
        { id: 'Habitats', name: 'Terrariums & Habitats' },
        { id: 'Accessories', name: 'Reptile Accessories' },
        { id: 'Health', name: 'Reptile Health' }
      ]
    };
    
    return subcategoriesMap[selectedCategory] || [{ id: 'all', name: 'All Types' }];
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all'); // Reset subcategory when main category changes
    setCurrentPage(1); // Reset to first page
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1); // Reset to first page
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="shop-page">
      <aside className="shop-sidebar">
        {/* Search within sidebar */}
        <div className="sidebar-search">
          <h3>Search Products</h3>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>

        <div className="category-filter">
          <h3>Pet Categories</h3>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="subcategory-filter">
          <h3>Product Types</h3>
          <div className="category-buttons">
            {getSubcategories().map(subcategory => (
              <button
                key={subcategory.id}
                className={`category-btn ${selectedSubcategory === subcategory.id ? 'active' : ''}`}
                onClick={() => handleSubcategoryChange(subcategory.id)}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>

        <PriceFilter
          priceRange={priceRange}
          onPriceChange={(newRange) => {
            setPriceRange(newRange);
            setCurrentPage(1);
          }}
        />
      </aside>
      <main className="shop-main">
        <div className="shop-header">
          <h2>
            {selectedCategory !== 'all' 
              ? `${selectedCategory} Products${selectedSubcategory !== 'all' ? ` - ${selectedSubcategory}` : ''}` 
              : `All Products${selectedSubcategory !== 'all' ? ` - ${selectedSubcategory}` : ''}`}
          </h2>
          <p>{products.length} products found</p>
        </div>

        <div className="products-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopPage; 