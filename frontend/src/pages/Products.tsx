import { useState, useEffect } from 'react';
import { Product, productService } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Layout } from '@/components/Layout';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const data = await productService.getAllProducts();
        console.log(data);  
        const mappedProducts = data.map((item: any) => ({
          id: item.Product_ID,          // Map the backend Product_ID to 'id'
          name: item.product_name,      // Map the backend product_name to 'name'
          description: '',              // You may want to add a description field or leave it empty
          price: item.price,            // Map the price as is
          image: item.image,            // Map the image as is
        }));

        setProducts(mappedProducts);  // Set the mapped products in state
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(errorMessage);
        console.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 border border-red-200 rounded bg-red-50 text-red-500">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-8 border border-gray-200 rounded bg-gray-50">
            No products available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
