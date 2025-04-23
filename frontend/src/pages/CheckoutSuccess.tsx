
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';

export default function CheckoutSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-lg mx-auto py-12">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto my-4 bg-green-100 rounded-full p-6 w-24 h-24 flex items-center justify-center">
              <Check size={64} className="text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold">Checkout Successful!</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-muted-foreground mb-6">
              Your order has been successfully processed. You will receive a confirmation email shortly.
            </p>
            <p className="font-medium mb-4">
              Thank you for shopping with us!
            </p>
            <div className="flex justify-center">
              <ShoppingBag size={48} className="text-primary opacity-50" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full">
              <Link to="/users/productview">
                <ArrowRight size={16} className="mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
