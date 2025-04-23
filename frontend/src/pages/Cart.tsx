
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';

export default function Cart() {
  const { items, loading, error, removeFromCart, checkout, buyProducts, refreshCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      navigate('/checkout-success');
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  const handleBuyProducts = async () => {
    try {
      await buyProducts();
      navigate('/purchase-success');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <ShoppingCart className="mr-3" />
            Shopping Cart
          </h1>
          <Link to="/users/productview">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 border border-red-200 rounded bg-red-50 text-red-500">
            {error}
          </div>
        ) : items.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some products to your cart to get started.
              </p>
              <Button onClick={() => navigate('/users/productview')}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Cart Items ({totalItems})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-4">
                        {item.product.image ? (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <Link to={`/users/productview/${item.productId}`} className="font-medium hover:underline">
                          {item.product.name}
                        </Link>
                        <div className="flex justify-between mt-1">
                          <div className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </div>
                          <div className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between">
                <div className="mb-4 sm:mb-0">
                  <div className="text-lg font-medium">Total: ${totalPrice.toFixed(2)}</div>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={handleCheckout}>
                    <Check size={16} className="mr-2" />
                    Checkout
                  </Button>
                  <Button onClick={handleBuyProducts}>
                    <ArrowRight size={16} className="mr-2" />
                    Buy Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
