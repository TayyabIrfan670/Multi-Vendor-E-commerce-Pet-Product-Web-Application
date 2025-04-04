// Mock seller data
const MOCK_SELLER = {
  _id: 'seller-001',
  name: 'Pet Supplies Co.',
  email: 'seller@example.com',
  phone: '+923001234567',
  address: '123 Business Street, Karachi',
  businessType: 'Pet Store',
  logo: 'https://placehold.co/300x300?text=Pet+Supplies',
  registrationNumber: 'REG-001-2023',
  joinedDate: '2023-01-15T00:00:00.000Z'
};

// Register a new seller
export const registerSeller = async (sellerData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulated validation
  if (!sellerData.email || !sellerData.password || !sellerData.name) {
    throw new Error('Please provide all required seller information');
  }
  
  // Simulate successful registration
  const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
  const newSeller = {
    ...MOCK_SELLER,
    name: sellerData.name,
    email: sellerData.email,
    phone: sellerData.phone || MOCK_SELLER.phone,
    address: sellerData.address || MOCK_SELLER.address,
    businessType: sellerData.businessType || MOCK_SELLER.businessType,
    joinedDate: new Date().toISOString()
  };
  
  // Store token in localStorage
  localStorage.setItem('sellerToken', mockToken);
  localStorage.setItem('sellerInfo', JSON.stringify(newSeller));
  
  return { 
    token: mockToken, 
    seller: newSeller 
  };
};

// Login a seller
export const loginSeller = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock validation
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }
  
  // For demo, any email/password combination works
  // but in a real app, this would validate against stored credentials
  const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
  
  // Store token in localStorage
  localStorage.setItem('sellerToken', mockToken);
  localStorage.setItem('sellerInfo', JSON.stringify(MOCK_SELLER));

  return {
    token: mockToken,
    seller: MOCK_SELLER
  };
};

// Get seller profile
export const getSellerProfile = async () => {
  const token = localStorage.getItem('sellerToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return MOCK_SELLER;
};

// Logout seller
export const logoutSeller = () => {
  localStorage.removeItem('sellerToken');
  localStorage.removeItem('sellerInfo');
};

// Check if seller is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('sellerToken');
};

// Get seller info from localStorage
export const getSellerInfo = () => {
  const sellerInfoString = localStorage.getItem('sellerInfo');
  console.log('Raw seller info string from localStorage:', sellerInfoString);
  
  if (!sellerInfoString) {
    console.log('No seller info found in localStorage');
    return null;
  }
  
  try {
    const sellerInfo = JSON.parse(sellerInfoString);
    console.log('Parsed seller info:', sellerInfo);
    
    if (!sellerInfo._id) {
      console.log('Warning: Seller info does not contain an _id field:', sellerInfo);
    }
    
    return sellerInfo;
  } catch (error) {
    console.error('Error parsing seller info:', error);
    return null;
  }
}; 