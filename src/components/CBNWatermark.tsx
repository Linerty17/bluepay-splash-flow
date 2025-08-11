import React from "react";

const CBNWatermark = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
      <div className="opacity-10 transform scale-75 md:scale-100">
        <img 
          src="/lovable-uploads/05c135b3-4a7f-4226-84df-6d84ed83be2b.png" 
          alt="Verified by CBN"
          className="w-80 h-60 object-contain filter brightness-150 hue-rotate-180"
          style={{ filter: 'brightness(1.5) hue-rotate(200deg) saturate(0.8)' }}
        />
      </div>
    </div>
  );
};

export default CBNWatermark;