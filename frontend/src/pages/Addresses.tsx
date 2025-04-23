
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address, addressService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  MapPinPlus, 
  Home, 
  Briefcase, 
  Trash2, 
  Plus,
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Layout } from '@/components/Layout';

interface AddressFormData {
  type: 'home' | 'work';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchAddresses();
  }, [user, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch addresses';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId: string) => {
    try {
      setLoading(true);
      await addressService.deleteAddress(addressId);
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
      
      fetchAddresses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete address';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: 'home' | 'work') => {
    setFormData(prev => ({ ...prev, type }));
  };

  const validateForm = () => {
    const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof AddressFormData]?.trim()) {
        toast({
          title: "Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      if (editingAddress) {
       
        if (editingAddress.type === 'home') {
          await addressService.editHomeAddress(editingAddress.id, formData);
        } else {
          await addressService.editWorkAddress(editingAddress.id, formData);
        }
        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
     
        await addressService.addAddress(formData);
        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }
 
      resetForm();
      fetchAddresses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save address';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="mb-6 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Addresses</h1>
          {!showAddForm && (
            <Button onClick={handleAddNew}>
              <Plus size={16} className="mr-2" />
              Add New Address
            </Button>
          )}
        </div>
        
        {loading && !showAddForm ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error && !showAddForm ? (
          <div className="text-center p-8 border border-red-200 rounded bg-red-50 text-red-500">
            {error}
          </div>
        ) : !showAddForm && addresses.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <MapPinPlus size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-medium mb-2">No addresses found</h2>
              <p className="text-muted-foreground mb-6">
                Add your first address to get started.
              </p>
              <Button onClick={handleAddNew}>
                <Plus size={16} className="mr-2" />
                Add New Address
              </Button>
            </CardContent>
          </Card>
        ) : !showAddForm ? (
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <Card key={address.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-lg">
                      {address.type === 'home' ? (
                        <Home className="mr-2" size={18} />
                      ) : (
                        <Briefcase className="mr-2" size={18} />
                      )}
                      {address.type === 'home' ? 'Home' : 'Work'} Address
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</CardTitle>
              <CardDescription>
                {editingAddress 
                  ? 'Update your address information below' 
                  : 'Fill in the details to add a new address'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={formData.type === 'home' ? 'default' : 'outline'}
                    className="w-1/2"
                    onClick={() => handleTypeChange('home')}
                  >
                    <Home className="mr-2" size={16} />
                    Home
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === 'work' ? 'default' : 'outline'}
                    className="w-1/2"
                    onClick={() => handleTypeChange('work')}
                  >
                    <Briefcase className="mr-2" size={16} />
                    Work
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address*</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Main St, Apt 4B"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province*</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code*</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country*</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => resetForm()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <span className="mr-2">Saving</span>
                      <span className="animate-spin">⋯</span>
                    </span>
                  ) : editingAddress ? (
                    'Update Address'
                  ) : (
                    <span className="flex items-center">
                      <MapPinPlus className="mr-2" size={16} />
                      Add Address
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </Layout>
  );
}
