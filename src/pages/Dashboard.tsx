
import React from "react";
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
import JoinGroupsAd from "../components/dashboard/JoinGroupsAd";
import DraggableBadge from "../components/dashboard/DraggableBadge";

const Dashboard = () => {
  const { userData, balance, transactions } = useUserStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16 relative">
      <JoinGroupsAd />
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
