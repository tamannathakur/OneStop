import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Search from "./pages/Search";
import Addresses from "./pages/Addresses";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Login />} /> // entry page is login
<Route path="/index" element={<Index />} /> // redirect here after login

              <Route path="/signup" element={<Signup />} />
              <Route path="/users/productview" element={<Products />} />
              <Route path="/search" element={<ProductDetail />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/users/search" element={<Search />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/checkout-success" element={<CheckoutSuccess />} />
              <Route path="/purchase-success" element={<PurchaseSuccess />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
