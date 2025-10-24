import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const withdrawalSchema = z.object({
  bankName: z.string().min(3, "Bank name is required"),
  accountName: z.string().min(3, "Account name is required"),
  accountNumber: z.string().length(10, "Account number must be 10 digits").regex(/^\d+$/, "Must be numbers only"),
});

const WithdrawalForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      withdrawalSchema.parse({ bankName, accountName, accountNumber });
      
      navigate("/withdrawal/payment", {
        state: { bankName, accountName, accountNumber }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          description: error.errors[0].message,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Withdrawal Details</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Enter Your Bank Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
                required
              />
            </div>

            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account name"
                required
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 10-digit account number"
                maxLength={10}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-6">
              Proceed to Payment
            </Button>
          </form>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">📌 Important Notice:</p>
          <p>• Minimum withdrawal: ₦120,000</p>
          <p>• Maximum withdrawal: ₦400,000</p>
          <p>• Processing fee: ₦14,770</p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalForm;
