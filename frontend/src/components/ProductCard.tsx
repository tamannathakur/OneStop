
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    try {
      setIsLoading(true);
      await addToCart(product.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link to={`/users/productview/${product.id}`}>
        <div className="h-48 overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{product.description}</p>
          <p className="font-bold text-lg mt-2">${product.price.toFixed(2)}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="w-1/2 mr-2"
          asChild
        >
          <Link to={`/users/productview/${product.id}`}>
            <Eye size={16} className="mr-1" />
            View
          </Link>
        </Button>
        <Button
          size="sm"
          className="w-1/2"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart size={16} className="mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
