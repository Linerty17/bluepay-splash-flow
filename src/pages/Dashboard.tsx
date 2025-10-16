
import React, { useEffect, useRef } from "react";
import { useUserStore } from "../stores/userStore";
import Header from "../components/dashboard/Header";
import UserGreeting from "../components/dashboard/UserGreeting";
import BalanceCard from "../components/dashboard/BalanceCard";
import QuickActions from "../components/dashboard/QuickActions";
import MoreServices from "../components/dashboard/MoreServices";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BottomNavigation from "../components/dashboard/BottomNavigation";
import OpayNotificationBanner from "../components/dashboard/OpayNotificationBanner";
import ImportantInformation from "../components/dashboard/ImportantInformation";
import WithdrawalNotifications from "../components/dashboard/WithdrawalNotifications";
import WelcomeOnboarding from "../components/dashboard/WelcomeOnboarding";
import DraggableBadge from "../components/dashboard/DraggableBadge";

const Dashboard = () => {
  const { userData, balance, transactions } = useUserStore();
  const hasPlayedWelcome = useRef(false);

  useEffect(() => {
    const playWelcomeMessage = async () => {
      if (hasPlayedWelcome.current || !userData?.fullName) return;
      hasPlayedWelcome.current = true;

      try {
        const welcomeText = `Hi ${userData.fullName}, welcome to bluepay to the latest version of bluepay, where you can make 200,000 naira daily just by purchasing your BPC code for the sum of 6,200 naira, kindly click on the BPC button to purchase your code directly from the application, have a nice day.`;

        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY || ''
          },
          body: JSON.stringify({
            text: welcomeText,
            model_id: 'eleven_turbo_v2_5',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });

        if (!response.ok) {
          console.error('Failed to generate speech');
          return;
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.play().catch(err => {
          console.error('Failed to play audio:', err);
        });

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      } catch (error) {
        console.error('Error playing welcome message:', error);
      }
    };

    playWelcomeMessage();
  }, [userData]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16 relative">
      <WelcomeOnboarding />
      <WithdrawalNotifications />
      <OpayNotificationBanner />
      <Header />

      <div className="p-2 space-y-2">
        <UserGreeting userData={userData} />
        <BalanceCard balance={balance} />
        <QuickActions />
        <MoreServices />
        <ImportantInformation />
        <RecentTransactions transactions={transactions} />
      </div>
      
      <BottomNavigation />
      <DraggableBadge />
    </div>
  );
};

export default Dashboard;
