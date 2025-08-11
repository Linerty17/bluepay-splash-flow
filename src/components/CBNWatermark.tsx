import React from "react";

const CBNWatermark = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
      <div className="opacity-5 transform scale-75 md:scale-100">
        <img 
          src="/lovable-uploads/3a8d935d-3aaa-4dba-baf7-3a9f6f69b654.png" 
          alt="Verified by CBN"
          className="w-80 h-60 object-contain filter grayscale"
        />
      </div>
    </div>
  );
};

export default CBNWatermark;