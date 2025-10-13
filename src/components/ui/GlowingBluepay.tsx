import React from "react";
import { cn } from "@/lib/utils";

interface GlowingBluepayProps {
  text?: string;
  className?: string;
}

const GlowingBluepay: React.FC<GlowingBluepayProps> = ({ 
  text = "BLUEPAY",
  className = "" 
}) => {
  return (
    <span 
      className={cn(
        "relative inline-block font-bold text-white",
        "drop-shadow-[0_0_25px_rgba(56,189,248,0.9)]",
        "drop-shadow-[0_0_50px_rgba(14,165,233,0.6)]",
        "drop-shadow-[0_0_75px_rgba(6,182,212,0.4)]",
        "[text-shadow:0_0_20px_rgba(56,189,248,0.8),0_0_40px_rgba(14,165,233,0.6),0_0_60px_rgba(6,182,212,0.4)]",
        className
      )}
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #e0f2fe 50%, #38bdf8 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "brightness(1.2)"
      }}
    >
      {text}
    </span>
  );
};

export default GlowingBluepay;
