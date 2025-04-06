import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Export these interfaces for use in other components
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  category?: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  discountPrice?: number;
  countInStock: number;
  seller?: string;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  countInStock: number;
  brand?: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  checkout: () => Promise<{ success: boolean, message: string }>;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateQuantity: () => {},
  getCartTotal: () => 0,
  getItemCount: () => 0,
  checkout: async () => ({ success: false, message: '' }),
  isLoading: false
});

// Create a hook for easy context use
export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (product: Product, quantity: number = 1) => {
    // Check if the quantity being added exceeds available stock
    if (quantity > product.countInStock) {
      alert(`Sorry, only ${product.countInStock} items are available in stock.`);
      return;
    }
    
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item._id === product._id);
      
      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        // Validate against available stock
        if (newQuantity > product.countInStock) {
          alert(`Sorry, you can't add more than ${product.countInStock} of this item.`);
          return prevItems;
        }
        
        updatedItems[existingItemIndex].quantity = newQuantity;
        return updatedItems;
      } else {
        // If the item doesn't exist, add it to the cart
        return [...prevItems, {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          countInStock: product.countInStock,
          brand: product.brand
        }];
      }
    });
  };
  
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item._id === id) {
          // Validate against available stock
          if (quantity > item.countInStock) {
            alert(`Sorry, only ${item.countInStock} items are available in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  const checkout = async (): Promise<{ success: boolean, message: string }> => {
    try {
      setIsLoading(true);
      
      // Call the purchase endpoint to update stock quantities
      const response = await fetch('http://localhost:5001/api/products/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity
          }))
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to complete checkout'
        };
      }
      
      // Check if any items failed to be purchased
      if (data.results && data.results.some((result: any) => !result.success)) {
        // Get list of failed items
        const failedItems = data.results
          .filter((result: any) => !result.success)
          .map((result: any) => {
            const item = cartItems.find(item => item._id === result.productId);
            return {
              name: item?.name || 'Unknown product',
              message: result.message
            };
          });
        
        return {
          success: false,
          message: `Some items could not be purchased: ${failedItems.map((item: {name: string, message: string}) => `${item.name} (${item.message})`).join(', ')}`
        };
      }
      
      // Success - clear the cart
      clearCart();
      
      return {
        success: true,
        message: 'Purchase completed successfully'
      };
    } catch (error) {
      console.error('Checkout error:', error);
      return {
        success: false,
        message: 'An error occurred during checkout'
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getCartTotal,
        getItemCount,
        checkout,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 