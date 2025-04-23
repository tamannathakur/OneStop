
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, cartService } from '@/services/api';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  checkout: () => Promise<void>;
  buyProducts: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const cartItems = await cartService.getCart();
      setItems(cartItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cart';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.addToCart(productId, quantity);
      await refreshCart();
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product to cart';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.removeFromCart(productId);
      await refreshCart();
      toast({
        title: "Removed from Cart",
        description: "Product has been removed from your cart.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove product from cart';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartService.checkout();
      await refreshCart();
      toast({
        title: "Checkout Complete",
        description: "Your checkout was successful.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buyProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartService.buyProducts();
      await refreshCart();
      toast({
        title: "Purchase Complete",
        description: "Your purchase was successful.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      loading, 
      error, 
      addToCart, 
      removeFromCart, 
      checkout, 
      buyProducts, 
      refreshCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
