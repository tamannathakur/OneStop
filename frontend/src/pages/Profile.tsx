
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, ShoppingCart, LogOut } from 'lucide-react';
import { Layout } from '@/components/Layout';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* User Info Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="mr-2" size={20} />
                Account Information
              </CardTitle>
              <CardDescription>
                Your personal account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account ID:</span>
                  <span className="font-medium">{user.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Links */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Addresses</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="mb-4 text-sm">Manage your delivery addresses</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/addresses')}
              >
                Manage Addresses
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Order History</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="mb-4 text-sm">View your past orders</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/cart')}
              >
                View Cart
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Sign Out</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <LogOut size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="mb-4 text-sm">Sign out from your account</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
