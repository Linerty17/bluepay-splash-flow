
import React, { useState, useEffect } from "react";
import { Users, Settings, DollarSign, MessageCircle, LogOut, User, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  balance: number;
  created_at: string;
  bpc_code: string;
}

interface AdminSettings {
  support_link: string;
  group_link: string;
  bank_details: {
    account_name: string;
    account_number: string;
    bank_name: string;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    support_link: "https://t.me/Officialbluepay",
    group_link: "https://t.me/BluepayGroup",
    bank_details: {
      account_name: "BLUEPAY LIMITED",
      account_number: "1234567890",
      bank_name: "First Bank"
    }
  });
  const [activeTab, setActiveTab] = useState("users");

  const ADMIN_EMAIL = "libertyadmin@gmail.com";
  const ADMIN_PASSWORD = "2000717";

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to admin panel",
      });
      loadUsers();
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      return;
    }

    const usersWithBPC = data.map(user => ({
      ...user,
      bpc_code: `BPC${user.user_id.slice(-8).toUpperCase()}`
    }));

    setUsers(usersWithBPC);
  };

  const handleUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleSettingsUpdate = () => {
    toast({
      title: "Settings Updated",
      description: "Settings have been saved successfully",
    });
    setShowSettingsDialog(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bluepay-blue flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4">
              <img 
                src="/lovable-uploads/9c19c608-d185-4699-b545-9999f7f6fe47.png" 
                alt="BLUEPAY Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-bluepay-blue">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-bluepay-blue text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10">
            <img 
              src="/lovable-uploads/9c19c608-d185-4699-b545-9999f7f6fe47.png" 
              alt="BLUEPAY Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl font-bold">BLUEPAY Admin Panel</h1>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm" className="text-white border-white">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-4">
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            onClick={() => setActiveTab("settings")}
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button onClick={loadUsers} variant="outline">
                Refresh
              </Button>
            </div>
            
            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => handleUserClick(user)}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-bluepay-blue rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.full_name || 'Unknown User'}</h3>
                          <p className="text-gray-600">{user.phone_number}</p>
                          <p className="text-sm text-bluepay-blue font-medium">BPC: {user.bpc_code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₦{user.balance?.toLocaleString() || '0'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
            
            <div className="grid gap-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Links Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Support Link</label>
                    <Input
                      value={settings.support_link}
                      onChange={(e) => setSettings({...settings, support_link: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Group Link</label>
                    <Input
                      value={settings.group_link}
                      onChange={(e) => setSettings({...settings, group_link: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Name</label>
                    <Input
                      value={settings.bank_details.account_name}
                      onChange={(e) => setSettings({
                        ...settings,
                        bank_details: {...settings.bank_details, account_name: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Number</label>
                    <Input
                      value={settings.bank_details.account_number}
                      onChange={(e) => setSettings({
                        ...settings,
                        bank_details: {...settings.bank_details, account_number: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Name</label>
                    <Input
                      value={settings.bank_details.bank_name}
                      onChange={(e) => setSettings({
                        ...settings,
                        bank_details: {...settings.bank_details, bank_name: e.target.value}
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSettingsUpdate} className="w-full">
                Save Settings
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-bluepay-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">{selectedUser.full_name || 'Unknown User'}</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{selectedUser.phone_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Balance:</span>
                  <span className="font-bold text-bluepay-blue">₦{selectedUser.balance?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">BPC Code:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedUser.bpc_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Joined:</span>
                  <span>{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
