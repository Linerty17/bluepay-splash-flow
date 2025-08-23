import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, resendConfirmation, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleResendConfirmation = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const { error } = await resendConfirmation(user.email);
      
      if (error) {
        toast({
          title: "Failed to resend",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email sent!",
          description: "Please check your email for the verification link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bluepay-blue text-white">
      <header className="p-3">
        <button onClick={() => navigate("/")} className="flex items-center text-white">
          <ArrowLeft className="h-5 w-5 mr-2" />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center p-4">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="mb-6">
            <Mail className="h-16 w-16 mx-auto mb-4 text-white" />
            <h1 className="text-2xl font-bold mb-2 text-white">Verify Your Email</h1>
            <p className="text-gray-100 text-sm">
              We've sent a verification link to{" "}
              <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-200 text-sm">
              Please check your email and click the verification link to activate your account.
              Don't forget to check your spam folder!
            </p>

            <Button
              onClick={handleResendConfirmation}
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-2 font-medium rounded-full"
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </Button>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full bg-transparent hover:bg-white/10 text-white border-white/30 py-2 font-medium rounded-full"
            >
              Sign Out
            </Button>
          </div>

          <div className="mt-8 text-xs text-gray-300">
            <p>Having trouble? Contact our support team for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;