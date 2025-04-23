
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, productService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await productService.getProduct(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
        setError(errorMessage);
        console.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !user) {
      if (!user) navigate('/login');
      return;
    }
    
    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
    } finally {
      setAddingToCart(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="text-center p-8 border border-red-200 rounded bg-red-50 text-red-500">
          {error || 'Product not found'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/users/productview')} 
          className="mb-6 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover max-h-[500px]" 
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                No image available
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-bold mb-4 text-primary">${product.price.toFixed(2)}</p>
            
            <div className="border-t border-b py-4 mb-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Quantity:</label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-4 font-medium">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseQuantity}
                >
                  +
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full flex items-center justify-center"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              <ShoppingCart className="mr-2" size={20} />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
