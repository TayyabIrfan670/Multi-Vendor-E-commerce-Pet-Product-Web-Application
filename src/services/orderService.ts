import { OrderData } from '../components/order/OrderForm';
import { CartItem } from '../context/CartContext';

export interface Order {
  _id: string;
  customerDetails: any;
  items: any[];
  totalAmount: number;
  sellerTotal?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for orders
const MOCK_ORDERS: Order[] = [
  {
    _id: 'ord-001',
    customerDetails: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+923001234567',
      address: '123 Main Street',
      addressLine1: '123 Main Street',
      city: 'Karachi',
      state: 'Sindh',
      postalCode: '75300',
      zipCode: '75300',
      country: 'Pakistan'
    },
    items: [
      {
        _id: 'prod-001',
        name: 'Premium Dog Food',
        price: 1500,
        quantity: 2,
        image: 'https://placehold.co/600x400?text=Dog+Food'
      },
      {
        _id: 'prod-002',
        name: 'Cat Collar',
        price: 500,
        quantity: 1,
        image: 'https://placehold.co/600x400?text=Cat+Collar'
      }
    ],
    totalAmount: 3500,
    sellerTotal: 3150,
    status: 'delivered',
    createdAt: '2023-04-01T10:30:00.000Z',
    updatedAt: '2023-04-03T16:45:00.000Z'
  },
  {
    _id: 'ord-002',
    customerDetails: {
      fullName: 'Sarah Khan',
      email: 'sarah@example.com',
      phone: '+923211234567',
      address: '456 Park Avenue',
      addressLine1: '456 Park Avenue',
      city: 'Lahore',
      state: 'Punjab',
      postalCode: '54000',
      zipCode: '54000',
      country: 'Pakistan'
    },
    items: [
      {
        _id: 'prod-003',
        name: 'Bird Cage',
        price: 2500,
        quantity: 1,
        image: 'https://placehold.co/600x400?text=Bird+Cage'
      }
    ],
    totalAmount: 2500,
    sellerTotal: 2250,
    status: 'processing',
    createdAt: '2023-04-05T09:15:00.000Z',
    updatedAt: '2023-04-05T14:20:00.000Z'
  },
  {
    _id: 'ord-003',
    customerDetails: {
      fullName: 'Ali Ahmed',
      email: 'ali@example.com',
      phone: '+923331234567',
      address: '789 Green Street',
      addressLine1: '789 Green Street',
      city: 'Islamabad',
      state: 'Federal',
      postalCode: '44000',
      zipCode: '44000',
      country: 'Pakistan'
    },
    items: [
      {
        _id: 'prod-004',
        name: 'Fish Tank',
        price: 5000,
        quantity: 1,
        image: 'https://placehold.co/600x400?text=Fish+Tank'
      },
      {
        _id: 'prod-005',
        name: 'Aquarium Plants',
        price: 800,
        quantity: 3,
        image: 'https://placehold.co/600x400?text=Aquarium+Plants'
      }
    ],
    totalAmount: 7400,
    sellerTotal: 6660,
    status: 'shipped',
    createdAt: '2023-04-10T11:45:00.000Z',
    updatedAt: '2023-04-12T08:30:00.000Z'
  }
];

export const orderService = {
  createOrder: async (orderData: OrderData, cartItems: CartItem[], totalAmount: number): Promise<Order> => {
    // Mock creating a new order
    const newOrder: Order = {
      _id: `ord-${Math.floor(Math.random() * 1000)}`,
      customerDetails: orderData,
      items: cartItems.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      sellerTotal: Math.round(totalAmount * 0.9), // 90% of total is seller's share
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newOrder;
  },
  
  getOrderById: async (orderId: string): Promise<Order> => {
    // Find order in mock data
    const order = MOCK_ORDERS.find(o => o._id === orderId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  },
  
  getOrders: async (): Promise<Order[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [...MOCK_ORDERS];
  },
  
  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    // Find and update order in mock data
    const orderIndex = MOCK_ORDERS.findIndex(o => o._id === orderId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const updatedOrder = {
      ...MOCK_ORDERS[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return updatedOrder;
  },
  
  getSellerOrders: async (sellerId: string): Promise<Order[]> => {
    // For demo, just return all orders
    // In a real app, we would filter by seller ID
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [...MOCK_ORDERS];
  }
}; 