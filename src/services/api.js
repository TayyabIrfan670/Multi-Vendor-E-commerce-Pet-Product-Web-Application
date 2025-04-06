// Mock data for products
const MOCK_PRODUCTS = [
  {
    _id: 'prod-001',
    name: 'Premium Dog Food',
    description: 'High quality dog food for all breeds. Rich in protein and essential nutrients.',
    price: 1500,
    category: 'Dog Food',
    image: 'https://placehold.co/600x400?text=Dog+Food',
    stock: 50,
    countInStock: 50,
    brand: 'PetDelight',
    sellerId: 'seller-001',
    sellerName: 'Pet Supplies Co.',
    reviews: [
      {
        _id: 'rev-001',
        userId: 'user-001',
        userName: 'John Doe',
        rating: 5,
        comment: 'My dog loves this food! Great quality.',
        createdAt: '2023-03-15T10:30:00.000Z'
      },
      {
        _id: 'rev-002',
        userId: 'user-002',
        userName: 'Sarah Smith',
        rating: 4,
        comment: 'Good quality but a bit pricey.',
        createdAt: '2023-03-20T14:15:00.000Z'
      }
    ],
    averageRating: 4.5,
    createdAt: '2023-02-01T09:00:00.000Z',
    updatedAt: '2023-03-20T14:15:00.000Z'
  },
  {
    _id: 'prod-002',
    name: 'Cat Collar with Bell',
    description: 'Comfortable and adjustable cat collar with safety bell.',
    price: 500,
    category: 'Cat Accessories',
    image: 'https://placehold.co/600x400?text=Cat+Collar',
    stock: 100,
    countInStock: 100,
    brand: 'CatCare',
    sellerId: 'seller-001',
    sellerName: 'Pet Supplies Co.',
    reviews: [
      {
        _id: 'rev-003',
        userId: 'user-003',
        userName: 'Ali Khan',
        rating: 5,
        comment: 'Perfect fit for my cat and the bell is not too loud.',
        createdAt: '2023-03-10T11:20:00.000Z'
      }
    ],
    averageRating: 5,
    createdAt: '2023-02-10T10:30:00.000Z',
    updatedAt: '2023-03-10T11:20:00.000Z'
  },
  {
    _id: 'prod-003',
    name: 'Bird Cage - Medium Size',
    description: 'Spacious cage for small to medium sized birds with perches and feeders.',
    price: 2500,
    category: 'Bird Supplies',
    image: 'https://placehold.co/600x400?text=Bird+Cage',
    stock: 30,
    countInStock: 30,
    brand: 'BirdLife',
    sellerId: 'seller-002',
    sellerName: 'Avian World',
    reviews: [],
    averageRating: 0,
    createdAt: '2023-02-15T14:45:00.000Z',
    updatedAt: '2023-02-15T14:45:00.000Z'
  },
  {
    _id: 'prod-004',
    name: 'Fish Tank - 20 Gallon',
    description: 'Complete fish tank set with filter, light, and decorations.',
    price: 5000,
    category: 'Fish Supplies',
    image: 'https://placehold.co/600x400?text=Fish+Tank',
    stock: 15,
    countInStock: 15,
    brand: 'AquaLife',
    sellerId: 'seller-003',
    sellerName: 'Aquatic Pets',
    reviews: [
      {
        _id: 'rev-004',
        userId: 'user-004',
        userName: 'Fatima Ahmed',
        rating: 4,
        comment: 'Good quality tank but arrived with a small scratch.',
        createdAt: '2023-03-05T16:30:00.000Z'
      }
    ],
    averageRating: 4,
    createdAt: '2023-02-20T09:15:00.000Z',
    updatedAt: '2023-03-05T16:30:00.000Z'
  },
  {
    _id: 'prod-005',
    name: 'Aquarium Plants - Pack of 5',
    description: 'Artificial plants for aquarium decoration. Safe for all fish.',
    price: 800,
    category: 'Fish Supplies',
    image: 'https://placehold.co/600x400?text=Aquarium+Plants',
    stock: 45,
    countInStock: 45,
    brand: 'AquaLife',
    sellerId: 'seller-003',
    sellerName: 'Aquatic Pets',
    reviews: [],
    averageRating: 0,
    createdAt: '2023-02-22T10:45:00.000Z',
    updatedAt: '2023-02-22T10:45:00.000Z'
  }
];

export const fetchProducts = async (params = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter products based on params
  let filteredProducts = [...MOCK_PRODUCTS];
  
  // Handle search
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Handle category filter
  if (params.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === params.category
    );
  }
  
  // Handle sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Default sorting (featured)
        break;
    }
  }
  
  // Handle limit
  if (params.limit && !isNaN(Number(params.limit))) {
    filteredProducts = filteredProducts.slice(0, Number(params.limit));
  }
  
  return filteredProducts;
};

export const fetchProductById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = MOCK_PRODUCTS.find(p => p._id === id);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
};

export const searchProducts = async (query) => {
  return fetchProducts({ search: query });
};

export const filterProducts = async (filters) => {
  return fetchProducts(filters);
};

// Add a review to a product
export const addProductReview = async (productId, reviewData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const productIndex = MOCK_PRODUCTS.findIndex(p => p._id === productId);
  
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  // Create new review
  const newReview = {
    _id: `rev-${Math.floor(Math.random() * 1000)}`,
    userId: 'user-mock',
    userName: reviewData.name || 'Anonymous',
    rating: reviewData.rating,
    comment: reviewData.comment,
    createdAt: new Date().toISOString()
  };
  
  // Clone the product and add review
  const updatedProduct = {
    ...MOCK_PRODUCTS[productIndex],
    reviews: [...MOCK_PRODUCTS[productIndex].reviews, newReview]
  };
  
  // Recalculate average rating
  const totalRating = updatedProduct.reviews.reduce((sum, review) => sum + review.rating, 0);
  updatedProduct.averageRating = totalRating / updatedProduct.reviews.length;
  
  return updatedProduct;
}; 