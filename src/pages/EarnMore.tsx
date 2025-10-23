import React, { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Users, Copy, Share2, CheckCircle, Wallet, ArrowUpCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const withdrawalSchema = z.object({
  amount: z.number()
    .min(170000, 'Minimum withdrawal is ₦170,000')
    .max(10000000, 'Maximum withdrawal is ₦10,000,000')
    .positive('Amount must be positive'),
  accountName: z.string()
    .trim()
    .min(3, 'Account name too short')
    .max(100, 'Account name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Account name must contain only letters'),
  accountNumber: z.string()
    .trim()
    .length(10, 'Account number must be exactly 10 digits')
    .regex(/^\d{10}$/, 'Account number must contain only digits'),
  bankName: z.string()
    .trim()
    .min(1, 'Please select a bank')
});

const EarnMore = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState<number>(0);
  const [referralRate, setReferralRate] = useState<number>(15000);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Withdrawal form state
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  
  // Upgrade state
  const [selectedUpgrade, setSelectedUpgrade] = useState<number | null>(null);

  useEffect(() => {
    fetchUserReferralData();
  }, []);

  const fetchUserReferralData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to view your referral data",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referral_count, referral_earnings, referral_rate')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setReferralCode(data.referral_code);
        setReferralCount(data.referral_count);
        setReferralEarnings(Number(data.referral_earnings) || 0);
        setReferralRate(Number(data.referral_rate) || 15000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = () => {
    return `${window.location.origin}/register?ref=${referralCode}`;
  };

  const generateReferralMessage = () => {
    return `🎉 Join BluePay and earn money! 💰\n\nUse my referral code: ${referralCode}\n\nRegister here: ${generateReferralLink()}\n\n#BluePay #EarnMoney #Referral`;
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(generateReferralLink());
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const copyReferralMessage = () => {
    navigator.clipboard.writeText(generateReferralMessage());
    toast({
      title: "Message Copied!",
      description: "Full referral message copied to clipboard",
    });
  };

  const shareReferralLink = () => {
    const referralLink = generateReferralLink();
    const referralMessage = generateReferralMessage();
    
    if (navigator.share) {
      navigator.share({
        title: 'Join BluePay and Earn!',
        text: referralMessage,
        url: referralLink,
      });
    } else {
      copyReferralMessage();
    }
  };

  const handleWithdraw = async () => {
    setSubmitting(true);
    try {
      // Validate inputs
      const validated = withdrawalSchema.parse({
        amount: referralEarnings,
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim()
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user.id,
          amount: validated.amount,
          account_name: validated.accountName,
          account_number: validated.accountNumber,
          bank_name: validated.bankName,
        });

      if (error) throw error;

      toast({
        title: "Withdrawal Request Submitted",
        description: "Your request is being processed",
      });

      setShowWithdrawModal(false);
      setAccountName("");
      setAccountNumber("");
      setBankName("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit withdrawal request",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedUpgrade) return;

    // Validate upgrade amount is valid
    if (![25000, 30000].includes(selectedUpgrade)) {
      toast({
        title: "Invalid Upgrade",
        description: "Please select a valid upgrade tier",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('referral_upgrades')
        .insert({
          user_id: user.id,
          previous_rate: referralRate,
          new_rate: selectedUpgrade,
          payment_amount: selectedUpgrade,
          payment_status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Upgrade Request Submitted",
        description: "Complete payment to activate your upgrade",
      });

      setShowUpgradeModal(false);
      setSelectedUpgrade(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit upgrade request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-5">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3 text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Earn More</h1>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{referralCount}</p>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </Card>
          <Card className="p-4 text-center">
            <Wallet className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-foreground">{formatCurrency(referralEarnings)}</p>
            <p className="text-xs text-muted-foreground">Earnings</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-foreground">{formatCurrency(referralRate)}</p>
            <p className="text-xs text-muted-foreground">Per Referral</p>
          </Card>
        </div>

        {/* Referral Details */}
        <Card className="p-5">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Referral Program</h3>
              <p className="text-sm text-muted-foreground">Share and earn {formatCurrency(referralRate)}/referral</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Your Referral Code</h4>
              <div className="flex items-center gap-2 p-3 bg-background rounded border">
                <span className="font-mono text-lg font-bold flex-1">{referralCode}</span>
                <Button size="sm" variant="outline" onClick={copyReferralCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Your Referral Link</h4>
              <div className="flex items-center gap-2 p-3 bg-background rounded border">
                <span className="text-sm flex-1 break-all">{generateReferralLink()}</span>
                <Button size="sm" variant="outline" onClick={copyReferralLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={shareReferralLink}
              >
                <Share2 className="h-4 w-4" />
                Share Link
              </Button>
              <Button 
                variant="outline"
                onClick={copyReferralMessage}
              >
                <Copy className="h-4 w-4" />
                Copy Message
              </Button>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-sm">How it works:</h5>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Share your referral code or link with friends</li>
                    <li>• When they register, you earn {formatCurrency(referralRate)}</li>
                    <li>• Track your earnings in real-time</li>
                    <li>• Withdraw when you reach ₦170,000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Withdrawal Section */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Withdraw Earnings</h3>
              <p className="text-sm text-muted-foreground">
                {referralEarnings >= 170000 
                  ? "You can withdraw your earnings now!" 
                  : `Earn ${formatCurrency(170000 - referralEarnings)} more to withdraw`}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-green-600" />
          </div>
          
          <Button 
            className="w-full"
            size="lg"
            disabled={referralEarnings < 170000}
            onClick={() => setShowWithdrawModal(true)}
          >
            Withdraw {formatCurrency(referralEarnings)}
          </Button>
        </Card>

        {/* Upgrade Section */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Upgrade Referral Earnings</h3>
              <p className="text-sm text-muted-foreground">Increase your earnings per referral</p>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-blue-600" />
          </div>

          <div className="space-y-3">
            {[
              { rate: 15000, label: "Default", current: referralRate === 15000 },
              { rate: 25000, label: "Premium", current: referralRate === 25000, disabled: referralRate < 15000 },
              { rate: 30000, label: "Elite", current: referralRate === 30000, disabled: referralRate < 25000 },
            ].map((tier) => (
              <div
                key={tier.rate}
                className={`p-4 border rounded-lg ${
                  tier.current ? 'border-primary bg-primary/5' : 'border-border'
                } ${tier.disabled ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{tier.label} - {formatCurrency(tier.rate)}/referral</p>
                    <p className="text-sm text-muted-foreground">
                      {tier.current ? 'Current Rate' : `Upgrade for ${formatCurrency(tier.rate)}`}
                    </p>
                  </div>
                  {!tier.current && !tier.disabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUpgrade(tier.rate);
                        setShowUpgradeModal(true);
                      }}
                    >
                      Upgrade
                    </Button>
                  )}
                  {tier.current && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Earnings</DialogTitle>
            <DialogDescription>
              Enter your bank details to withdraw {formatCurrency(referralEarnings)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder="John Doe"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleWithdraw}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Withdraw ${formatCurrency(referralEarnings)}`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Referral Rate</DialogTitle>
            <DialogDescription>
              Upgrade to earn {selectedUpgrade ? formatCurrency(selectedUpgrade) : ''} per referral
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-accent p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Current Rate:</span>
                <span className="font-semibold">{formatCurrency(referralRate)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">New Rate:</span>
                <span className="font-semibold text-primary">
                  {selectedUpgrade ? formatCurrency(selectedUpgrade) : ''}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Payment Required:</span>
                <span className="font-bold text-lg">
                  {selectedUpgrade ? formatCurrency(selectedUpgrade) : ''}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                After payment confirmation, your referral rate will be upgraded immediately. 
                All future referrals will earn at the new rate.
              </p>
            </div>

            <Button 
              className="w-full" 
              onClick={handleUpgrade}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${selectedUpgrade ? formatCurrency(selectedUpgrade) : ''} to Upgrade`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EarnMore;
