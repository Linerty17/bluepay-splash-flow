import React, { useState, useEffect } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Check admin role from database
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
      }

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "Admin privileges required",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      // Show sidebar after successful auth
      setTimeout(() => {
        setShowSidebar(true);
      }, 300);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify access",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setShowSidebar(false);
    setTimeout(() => {
      navigate("/dashboard");
    }, 500); // Wait longer for animation to complete
  };

  const handleAdminClick = () => {
    window.open("https://t.me/Officialbluepay", "_blank");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 bg-white">
        {/* Content would go here */}
        <div className="p-6 flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-gray-500 mb-6">Admin features are coming soon</p>
          <button 
            onClick={handleBackToDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Sidebar overlay with animation */}
      <div className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-500 ${showSidebar ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`w-[85%] h-full bg-gray-900 flex flex-col transform transition-transform duration-500 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Logo and title area */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-40 h-40 mb-6 flex items-center justify-center">
              <img 
                src="/lovable-uploads/9c19c608-d185-4699-b545-9999f7f6fe47.png" 
                alt="BLUEPAY Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-white text-3xl font-bold">BLUEPAY</h1>
          </div>
          
          {/* Admin section */}
          <div className="px-8 py-6 mt-4 border-t border-gray-700">
            <div 
              className="flex items-center space-x-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={handleAdminClick}
            >
              <MessageCircle className="text-white h-9 w-9" />
              <span className="text-white text-2xl font-bold">Admin</span>
            </div>
          </div>

          {/* Additional menu items would go here */}
          <div className="flex-1"></div>

          {/* Close button */}
          <div className="p-6">
            <button 
              onClick={handleBackToDashboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-md text-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
