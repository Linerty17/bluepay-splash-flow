
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "./stores/userStore";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ChatBot from "./components/ChatBot";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import SetupPin from "./pages/SetupPin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Withdraw from "./pages/Withdraw";
import WithdrawProcessing from "./pages/WithdrawProcessing";
import BuyBPC from "./pages/BuyBPC";
import BuyBPCProcessing from "./pages/BuyBPCProcessing";
import BuyBPCPayment from "./pages/BuyBPCPayment";
import BuyBPCVerifying from "./pages/BuyBPCVerifying";
import BuyBPCConfirmation from "./pages/BuyBPCConfirmation";
import AirtimePurchase from "./pages/AirtimePurchase";
import DataPurchase from "./pages/DataPurchase";
import Support from "./pages/Support";
import Admin from "./pages/Admin";
import Faq from "./pages/Faq";
import Platform from "./pages/Platform";
import EarnMore from "./pages/EarnMore";
import TransactionHistory from "./pages/TransactionHistory";

const queryClient = new QueryClient();

// Theme management component
const ThemeManager = () => {
  const { themeMode } = useUserStore();
  
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('dark', 'light', 'system', 'device');
    
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'system') {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
      
      // Add listener for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.remove('light');
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      };
      
      // Add listener
      mediaQuery.addEventListener('change', handleChange);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else if (themeMode === 'device') {
      root.classList.add('device');
    } else {
      // Light mode is default
      root.classList.add('light');
    }
  }, [themeMode]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeManager />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/setup-pin" element={
              <ProtectedRoute>
                <SetupPin />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/pin" element={<SetupPin />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/withdraw" element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            } />
            <Route path="/withdraw/processing" element={
              <ProtectedRoute>
                <WithdrawProcessing />
              </ProtectedRoute>
            } />
            <Route path="/buy-bpc" element={
              <ProtectedRoute>
                <BuyBPC />
              </ProtectedRoute>
            } />
            <Route path="/buy-bpc/processing" element={
              <ProtectedRoute>
                <BuyBPCProcessing />
              </ProtectedRoute>
            } />
            <Route path="/buy-bpc/payment" element={
              <ProtectedRoute>
                <BuyBPCPayment />
              </ProtectedRoute>
            } />
            <Route path="/buy-bpc/verifying" element={
              <ProtectedRoute>
                <BuyBPCVerifying />
              </ProtectedRoute>
            } />
            <Route path="/buy-bpc/confirmation" element={
              <ProtectedRoute>
                <BuyBPCConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/airtime" element={
              <ProtectedRoute>
                <AirtimePurchase />
              </ProtectedRoute>
            } />
            <Route path="/data" element={
              <ProtectedRoute>
                <DataPurchase />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/faq" element={
              <ProtectedRoute>
                <Faq />
              </ProtectedRoute>
            } />
            <Route path="/platform" element={
              <ProtectedRoute>
                <Platform />
              </ProtectedRoute>
            } />
            <Route path="/earn-more" element={
              <ProtectedRoute>
                <EarnMore />
              </ProtectedRoute>
            } />
            <Route path="/transaction-history" element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
