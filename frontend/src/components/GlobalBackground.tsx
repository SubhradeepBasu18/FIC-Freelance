import React from "react";
import LiquidEther from "./LiquidEther";

const GlobalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <LiquidEther
        colors={["#5227FF", "#FF9FFC", "#B19EEF", "#FFD93D", "#FF7F11"]}
        mouseForce={25}
        cursorSize={120}
        isViscous={false}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.7}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.4}
        autoIntensity={2.5}
        takeoverDuration={0.3}
        autoResumeDelay={4000}
        autoRampDuration={0.8}
      />
    </div>
  );
};

export default GlobalBackground;