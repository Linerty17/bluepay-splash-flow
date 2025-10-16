
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
    const playWelcomeMessage = () => {
      if (hasPlayedWelcome.current || !userData?.fullName) return;
      
      // Check if speech synthesis is supported
      if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        return;
      }

      hasPlayedWelcome.current = true;

      const welcomeText = `Hi ${userData.fullName}, welcome to bluepay to the latest version of bluepay, where you can make 200,000 naira daily just by purchasing your BPC code for the sum of 6,200 naira, kindly click on the BPC button to purchase your code directly from the application, have a nice day.`;

      const utterance = new SpeechSynthesisUtterance(welcomeText);
      
      // Configure speech settings
      utterance.rate = 0.9; // Slightly slower for better understanding
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to use a good quality voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && (voice.name.includes('Female') || voice.name.includes('Samantha'))
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Small delay to ensure voices are loaded
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 500);
    };

    // Load voices and play message
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        playWelcomeMessage();
      };
    } else {
      playWelcomeMessage();
    }
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
