
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserData } = useUserStore();
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      toast({
        title: "Referral Code Applied!",
        description: `Using referral code: ${refCode}. You'll get ₦20,000 bonus after registration!`,
      });
    }
  }, [searchParams, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData({
      fullName: formData.fullName,
      email: formData.email
    });
    
    if (referralCode) {
      toast({
        title: "Registration Successful!",
        description: `Welcome! Your ₦20,000 referral bonus will be credited after PIN setup.`,
      });
    }
    
    navigate("/setup-pin");
  };

  const handleHelpClick = () => {
    window.open("https://t.me/Officialbluepay", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bluepay-blue text-white">
      <header className="p-3">
        <button onClick={() => navigate("/")} className="flex items-center text-white">
          <ArrowLeft className="h-5 w-5 mr-2" />
        </button>
        <div className="absolute top-3 right-3">
          <span className="text-white cursor-pointer text-sm" onClick={handleHelpClick}>You Need Help?</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-white text-center">BLUEPAY</h1>
          <h2 className="text-xl font-bold mb-3 text-white">Welcome!</h2>
          
          {referralCode && (
            <div className="bg-green-500/20 border border-green-400 rounded-lg p-2 mb-3">
              <p className="text-green-100 text-xs">
                🎉 Using referral code: <span className="font-bold">{referralCode}</span>
              </p>
              <p className="text-green-100 text-xs">You'll get ₦20,000 bonus after registration!</p>
            </div>
          )}
          
          <p className="text-gray-100 mb-4 text-sm">
            Get your account ready and instantly start buying, selling airtime and data online and start paying all your bills in cheaper price.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              name="fullName"
              placeholder="Your Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="rounded-md bg-white/10 border-white/20 px-3 py-2 text-white placeholder:text-gray-300"
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-md bg-white/10 border-white/20 px-3 py-2 text-white placeholder:text-gray-300"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-md bg-white/10 border-white/20 px-3 py-2 text-white placeholder:text-gray-300"
              required
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">+234</span>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="rounded-md bg-white/10 border-white/20 pl-12 py-2 text-white placeholder:text-gray-300"
                required
              />
            </div>

            <p className="text-xs text-gray-200">
              Any further actions indicates that you agree with our terms & conditions!
            </p>

            <Button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-bluepay-blue py-2 font-bold rounded-full"
            >
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-200 text-sm">Already have an account? </span>
            <button 
              onClick={() => navigate("/pin")} 
              className="text-white font-medium underline text-sm"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
