import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product, productService } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { Layout } from '@/components/Layout';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    
    const fetchResults = async () => {
      try {
        setLoading(true);
        const results = await productService.searchProducts(query);
        setProducts(results);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        console.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Products</h1>
        
        <form onSubmit={handleSearch} className="flex mb-8">
          <Input
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2"
          />
          <Button type="submit">
            <SearchIcon size={18} className="mr-2" />
            Search
          </Button>
        </form>
        
        {query && (
          <h2 className="text-xl font-medium mb-6">
            Search results for: <span className="font-bold">"{query}"</span>
          </h2>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 border border-red-200 rounded bg-red-50 text-red-500">
            {error}
          </div>
        ) : products.length === 0 ? (
          query ? (
            <div className="text-center p-8 border border-gray-200 rounded bg-gray-50">
              <p className="mb-4">No products found matching "{query}"</p>
              <Link to="/users/productview">
                <Button variant="outline">Browse All Products</Button>
              </Link>
            </div>
          ) : (
            <div className="text-center p-8 border border-gray-200 rounded bg-gray-50">
              <p>Enter a search term to find products</p>
            </div>
          )
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
