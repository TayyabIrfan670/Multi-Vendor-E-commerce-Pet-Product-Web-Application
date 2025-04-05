import { Order } from './orderService';

export const paymentService = {
  /**
   * Processes a cash on delivery order
   */
  processCashOnDelivery: async (orderId: string): Promise<Order> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful processing
    return {
      _id: orderId,
      customerDetails: {
        fullName: 'Mock Customer',
        email: 'customer@example.com',
        phone: '+921234567890',
        address: '123 Mock Street',
        addressLine1: '123 Mock Street',
        city: 'Karachi',
        state: 'Sindh',
        postalCode: '75300',
        zipCode: '75300',
        country: 'Pakistan'
      },
      items: [
        {
          _id: 'mock-item-1',
          name: 'Mock Product',
          price: 1500,
          quantity: 2,
          image: 'https://placehold.co/600x400?text=Mock+Product'
        }
      ],
      totalAmount: 3000,
      sellerTotal: 2700,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}; 