
// Base API services for connecting to the backend

const API_URL = 'http://localhost:8000'; // Adjust this to your actual backend URL

// Types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  type: 'home' | 'work';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Auth services
export const authService = {
  signup: async (username: string, email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to signup');
    }
    
    return response.json();
  },
  
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }
    
    return response.json();
  },
  
  logout: async (): Promise<void> => {
    // If your backend requires logout call
    // await fetch(`${API_URL}/logout`, {
    //   method: 'POST',
    //   credentials: 'include',
    // });
    
    // Clear local auth state
    localStorage.removeItem('user');
  }
};

// Product services
export const productService = {
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(`${API_URL}/users/productview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add product');
    }
    
    return response.json();
  },
  
  getProduct: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/users/productview/${id}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get product');
    }
    
    return response.json();
  },
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/users/search?name=${encodeURIComponent(query)}`, {
      credentials: 'include',
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search products');
    }
  
    const rawProducts = await response.json();

    return rawProducts.map((p: any) => ({
      id: p.Product_ID,                // <-- mapping backend field to your expected frontend type
      product_name: p.product_name,
      price: p.price,
      rating: p.rating,
      image: p.image,
    }));
    
  },
  
  getAllProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/users/productview`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get products');
    }
    
    return response.json();
  }
};

// Cart services
export const cartService = {
  addToCart: async (productId: string, quantity: number = 1): Promise<CartItem> => {
    const response = await fetch(`${API_URL}/cart/add/${productId}?quantity=${quantity}`, {
      method: 'GET', // Based on the route list, this uses GET
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add to cart');
    }
    
    return response.json();
  },
  
  removeFromCart: async (productId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
      method: 'GET', // Based on the route list, this uses GET
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove from cart');
    }
  },
  
  getCart: async (): Promise<CartItem[]> => {
    const response = await fetch(`${API_URL}/cart`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get cart');
    }
    
    return response.json();
  },
  
  checkout: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/cart/checkout`, {
      method: 'GET', // Based on the route list, this uses GET
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to checkout');
    }
    
    return response.json();
  },
  
  buyProducts: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/users/productview/buy`, {
      method: 'GET', // Based on the route list, this uses GET
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to buy products');
    }
    
    return response.json();
  }
};

// Address services
export const addressService = {
  addAddress: async (address: Omit<Address, 'id'>): Promise<Address> => {
    const response = await fetch(`${API_URL}/address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add address');
    }
    
    return response.json();
  },
  
  editHomeAddress: async (addressId: string, address: Partial<Address>): Promise<Address> => {
    const response = await fetch(`${API_URL}/address/home/${addressId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to edit home address');
    }
    
    return response.json();
  },
  
  editWorkAddress: async (addressId: string, address: Partial<Address>): Promise<Address> => {
    const response = await fetch(`${API_URL}/address/work/${addressId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to edit work address');
    }
    
    return response.json();
  },
  
  deleteAddress: async (addressId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/address/${addressId}`, {
      method: 'GET', // Based on the route list, this uses GET for delete
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete address');
    }
  },
  
  getAddresses: async (): Promise<Address[]> => {
    const response = await fetch(`${API_URL}/addresses`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get addresses');
    }
    
    return response.json();
  }
};
