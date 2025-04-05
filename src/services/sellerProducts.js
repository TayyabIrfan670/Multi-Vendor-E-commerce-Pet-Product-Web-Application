// Services for seller product management
// Mock data for seller products
const MOCK_SELLER_PRODUCTS = [
  {
    _id: 'prod-001',
    name: 'Premium Dog Food',
    description: 'High quality dog food for all breeds. Rich in protein and essential nutrients.',
    price: 1500,
    category: 'Dog Food',
    image: 'https://placehold.co/600x400?text=Dog+Food',
    stock: 50,
    sellerId: 'seller-001',
    sellerName: 'Pet Supplies Co.',
    reviews: [
      {
        _id: 'rev-001',
        userId: 'user-001',
        userName: 'John Doe',
        rating: 5,
        comment: 'My dog loves this food! Great quality.',
        createdAt: '2023-03-15T10:30:00.000Z',
        sellerResponse: 'Thank you for your feedback!',
        sellerResponseDate: '2023-03-16T08:45:00.000Z'
      },
      {
        _id: 'rev-002',
        userId: 'user-002',
        userName: 'Sarah Smith',
        rating: 4,
        comment: 'Good quality but a bit pricey.',
        createdAt: '2023-03-20T14:15:00.000Z',
        sellerResponse: null,
        sellerResponseDate: null
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
    sellerId: 'seller-001',
    sellerName: 'Pet Supplies Co.',
    reviews: [
      {
        _id: 'rev-003',
        userId: 'user-003',
        userName: 'Ali Khan',
        rating: 5,
        comment: 'Perfect fit for my cat and the bell is not too loud.',
        createdAt: '2023-03-10T11:20:00.000Z',
        sellerResponse: 'We are glad you like it!',
        sellerResponseDate: '2023-03-11T09:30:00.000Z'
      }
    ],
    averageRating: 5,
    createdAt: '2023-02-10T10:30:00.000Z',
    updatedAt: '2023-03-10T11:20:00.000Z'
  }
];

// Deep clone function to avoid reference issues
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Get all products for a specific seller
export const getSellerProducts = async () => {
  const token = localStorage.getItem('sellerToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return deepClone(MOCK_SELLER_PRODUCTS);
};

// Add a new product
export const addProduct = async (productData) => {
  const token = localStorage.getItem('sellerToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create new product with mock data
  const newProduct = {
    _id: `prod-${Math.floor(Math.random() * 1000)}`,
    name: productData.name,
    description: productData.description,
    price: parseFloat(productData.price),
    category: productData.category,
    image: productData.image instanceof File ? 
      'https://placehold.co/600x400?text=' + encodeURIComponent(productData.name) : 
      productData.image || 'https://placehold.co/600x400?text=Product',
    stock: parseInt(productData.stock, 10),
    sellerId: 'seller-001',
    sellerName: 'Pet Supplies Co.',
    reviews: [],
    averageRating: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to mock data - in a real app this would add to a database
  MOCK_SELLER_PRODUCTS.push(newProduct);
  
  return newProduct;
};

// Update a product
export const updateProduct = async (productId, productData) => {
  const token = localStorage.getItem('sellerToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find product index
  const productIndex = MOCK_SELLER_PRODUCTS.findIndex(p => p._id === productId);
  
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  // Update product with new data
  const updatedProduct = {
    ...MOCK_SELLER_PRODUCTS[productIndex],
    name: productData.name,
    description: productData.description,
    price: parseFloat(productData.price),
    category: productData.category,
    stock: parseInt(productData.stock, 10),
    updatedAt: new Date().toISOString()
  };
  
  // Handle image
  if (productData.image instanceof File) {
    updatedProduct.image = 'https://placehold.co/600x400?text=' + encodeURIComponent(productData.name);
  } else if (productData.image && typeof productData.image === 'string') {
    updatedProduct.image = productData.image;
  }
  
  // Update in mock data
  MOCK_SELLER_PRODUCTS[productIndex] = updatedProduct;
  
  return updatedProduct;
};

// Delete a product
export const deleteProduct = async (productId) => {
  const token = localStorage.getItem('sellerToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find product index
  const productIndex = MOCK_SELLER_PRODUCTS.findIndex(p => p._id === productId);
  
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  // Remove from mock data
  const deletedProduct = MOCK_SELLER_PRODUCTS.splice(productIndex, 1)[0];
  
  return { success: true, message: 'Product deleted successfully', product: deletedProduct };
};

// Get all reviews for seller's products
export const getSellerReviews = async () => {
  const token = localStorage.getItem('sellerToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Collect all reviews from seller products
  const reviews = MOCK_SELLER_PRODUCTS.flatMap(product => 
    product.reviews.map(review => ({
      ...review,
      productId: product._id,
      productName: product.name,
      productImage: product.image
    }))
  );
  
  return reviews;
};

// Respond to a review
export const respondToReview = async (productId, reviewId, responseText) => {
  const token = localStorage.getItem('sellerToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find product
  const productIndex = MOCK_SELLER_PRODUCTS.findIndex(p => p._id === productId);
  
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  // Find review
  const reviewIndex = MOCK_SELLER_PRODUCTS[productIndex].reviews.findIndex(r => r._id === reviewId);
  
  if (reviewIndex === -1) {
    throw new Error('Review not found');
  }
  
  // Update review with response
  const updatedReview = {
    ...MOCK_SELLER_PRODUCTS[productIndex].reviews[reviewIndex],
    sellerResponse: responseText,
    sellerResponseDate: new Date().toISOString()
  };
  
  // Update in mock data
  MOCK_SELLER_PRODUCTS[productIndex].reviews[reviewIndex] = updatedReview;
  
  return {
    success: true,
    review: updatedReview
  };
}; 