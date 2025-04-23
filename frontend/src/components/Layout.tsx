
import { Navbar } from './Navbar';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <footer className="bg-primary text-primary-foreground py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold">YourEverythingStore</h2>
              <p className="text-sm opacity-80">Your ultimate shopping destination</p>
            </div>
            <div className="text-sm opacity-80">
              &copy; {new Date().getFullYear()} YourEverythingStore. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
      <Sonner />
    </div>
  );
}
