
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, Check, MapPin, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { Product, productService } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await productService.getAllProducts();
        setFeaturedProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20 -mx-4 md:-mx-6 px-4 md:px-6 mb-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-10 md:mb-0 md:mr-8 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">
                Your One-Stop Shop for Everything
              </h1>
              <p className="text-lg mb-8 text-muted-foreground max-w-xl mx-auto md:mx-0">
                Discover amazing products at great prices. Shop with confidence and enjoy a seamless experience from browsing to delivery.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button size="lg" asChild>
                  <Link to="/users/productview">
                    <ShoppingCart className="mr-2" size={20} />
                    Shop Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/search">
                    <Search className="mr-2" size={20} />
                    Search Products
                  </Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <div className="bg-card shadow-xl rounded-lg p-6 border border-border max-w-sm mx-auto md:mx-0">
                <img 
                  src="data:image/jpeg;base64,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" 
                  alt="Featured Products" 
                  className="rounded-md mb-4 w-full"
                />
                <div className="text-center">
                  <p className="text-lg font-medium">Special Collection</p>
                  <p className="text-muted-foreground mb-4">Limited time offers</p>
                  <Button variant="secondary" asChild>
                    <Link to="/users/productview">View Collection</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link to="/users/productview">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center p-12 border border-gray-200 rounded-lg">
              <p className="text-muted-foreground">No products available. Check back soon!</p>
              <Button className="mt-4" asChild>
                <Link to="/users/productview">Browse All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mb-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Shop With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Tag className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">
                We offer competitive prices on our 100+ products.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">
                All transactions are processed securely.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick delivery to your home or work address.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-12 rounded-lg mb-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers who shop with us every day.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/users/productview">
              <ShoppingCart className="mr-2" size={20} />
              Shop Now
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
