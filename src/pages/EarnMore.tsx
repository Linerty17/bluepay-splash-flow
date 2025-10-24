import React, { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Users, Copy, Share2, CheckCircle, Wallet, ArrowUpCircle, Loader2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EarnMore = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState<number>(0);
  const [referralRate, setReferralRate] = useState<number>(15000);
  const [accountUpgraded, setAccountUpgraded] = useState(false);
  const [taxJoinCompletedAt, setTaxJoinCompletedAt] = useState<string | null>(null);

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
        .select('referral_code, referral_count, referral_earnings, referral_rate, account_upgraded, tax_join_completed_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setReferralCode(data.referral_code);
        setReferralCount(data.referral_count);
        setReferralEarnings(Number(data.referral_earnings) || 0);
        setReferralRate(Number(data.referral_rate) || 15000);
        setAccountUpgraded(data.account_upgraded || false);
        setTaxJoinCompletedAt(data.tax_join_completed_at);
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

  const handleWithdraw = () => {
    if (!accountUpgraded) {
      toast({
        variant: "destructive",
        description: "Please upgrade your account first to access withdrawals",
      });
      navigate('/account-upgrade');
      return;
    }

    if (referralEarnings < 120000) {
      toast({
        variant: "destructive",
        description: "Minimum withdrawal amount is ₦120,000",
      });
      return;
    }

    if (referralEarnings > 400000) {
      toast({
        variant: "destructive",
        description: "Maximum withdrawal per request is ₦400,000. Please contact support.",
      });
      return;
    }

    navigate('/withdrawal/form');
  };

  const handleTaxJoinGroup = async () => {
    const whatsappLink = "https://chat.whatsapp.com/JNuHAVaGNgQD40cQXOwFwV";
    const telegramLink = "https://t.me/+wYh9iSrC3YkyMTlk";
    
    window.open(whatsappLink, '_blank');
    window.open(telegramLink, '_blank');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newRate = referralRate + 10000;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          referral_rate: newRate,
          tax_join_completed_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        description: "🎉 Bonus activated! Your referral rate increased by ₦10,000 for 24 hours!",
      });

      fetchUserReferralData();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to activate bonus. Please try again.",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
            <p className="text-2xl font-bold text-foreground">₦{formatCurrency(referralEarnings)}</p>
            <p className="text-xs text-muted-foreground">Earnings</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-foreground">₦{formatCurrency(referralRate)}</p>
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
              <p className="text-sm text-muted-foreground">Share and earn ₦{formatCurrency(referralRate)}/referral</p>
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
                    <li>• When they register, you earn ₦{formatCurrency(referralRate)}</li>
                    <li>• Track your earnings in real-time</li>
                    <li>• Withdraw when you reach ₦120,000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Status & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!accountUpgraded && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 font-medium mb-2">
                  🔒 Account Not Upgraded
                </p>
                <p className="text-sm text-amber-700 mb-3">
                  Upgrade your account for ₦15,000 to unlock withdrawal features
                </p>
                <Button 
                  onClick={() => navigate('/account-upgrade')}
                  className="w-full"
                  variant="default"
                >
                  Upgrade Account Now
                </Button>
              </div>
            )}

            {accountUpgraded && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium mb-2">
                  ✅ Account Upgraded
                </p>
                <p className="text-2xl font-bold text-green-700 mb-3">
                  ₦{formatCurrency(referralEarnings)}
                </p>
                <Button 
                  onClick={handleWithdraw}
                  className="w-full"
                  size="lg"
                  disabled={referralEarnings < 120000 || referralEarnings > 400000}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Request Withdrawal
                </Button>
                {referralEarnings < 120000 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Minimum: ₦120,000 • Need ₦{formatCurrency(120000 - referralEarnings)} more
                  </p>
                )}
                {referralEarnings > 400000 && (
                  <p className="text-xs text-amber-600 mt-2 text-center">
                    Maximum per withdrawal: ₦400,000 • Please contact support
                  </p>
                )}
              </div>
            )}

            {/* Tax/Join Group Button */}
            {!taxJoinCompletedAt && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">
                  🎁 Boost Your Earnings!
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Join our community groups and get +₦10,000 bonus for 24 hours
                </p>
                <Button 
                  onClick={handleTaxJoinGroup}
                  className="w-full"
                  variant="default"
                >
                  Perform Tax / Join Group
                </Button>
              </div>
            )}

            {taxJoinCompletedAt && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">
                  ✨ Bonus Active! +₦10,000 for 24hrs
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upgrade Referral Rate Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5" />
              Upgrade Referral Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { rate: 15000, label: "Default", current: referralRate === 15000 },
              { rate: 25000, label: "Premium", current: referralRate === 25000 },
              { rate: 30000, label: "Elite", current: referralRate === 30000 },
            ].map((tier) => (
              <div
                key={tier.rate}
                className={`p-4 border rounded-lg ${
                  tier.current ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{tier.label} - ₦{formatCurrency(tier.rate)}/referral</p>
                    <p className="text-sm text-muted-foreground">
                      {tier.current ? 'Current Rate' : `Upgrade for ₦${formatCurrency(tier.rate)}`}
                    </p>
                  </div>
                  {tier.current && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Contact support to upgrade your referral rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarnMore;
