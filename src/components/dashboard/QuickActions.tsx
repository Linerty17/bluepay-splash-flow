
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Monitor, Signal, Database, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const QuickActions = () => {
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  // Preload video after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleWatch = () => {
    setIsVideoOpen(true);
  };

  const quickActions = [
    {
      id: 'buy-bpc',
      title: 'Buy BPC',
      icon: Wallet,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      onClick: () => navigate("/buy-bpc")
    },
    {
      id: 'watch',
      title: 'Watch',
      icon: Monitor,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      onClick: handleWatch
    },
    {
      id: 'airtime',
      title: 'Airtime',
      icon: Signal,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      onClick: () => navigate("/airtime")
    },
    {
      id: 'data',
      title: 'Data',
      icon: Database,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
      onClick: () => navigate("/data")
    }
  ];

  return (
    <>
      <div className="bg-white rounded-xl p-3 mb-2 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <div 
                key={action.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={action.onClick}
              >
                <div className={`h-10 w-10 ${action.bgColor} rounded-lg mb-1 flex items-center justify-center`}>
                  <IconComponent className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <p className="text-xs font-medium text-center text-gray-800">{action.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preload iframe hidden for instant loading */}
      {isVideoLoaded && (
        <div className="hidden">
          <iframe
            width="100%"
            height="100%"
            src="https://player.vimeo.com/video/1111008322"
            title="BluPay Tutorial Preload"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <DialogHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white">BluPay Tutorial</DialogTitle>
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://player.vimeo.com/video/1111008322?autoplay=1"
              title="BluPay Tutorial"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="rounded-b-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;
