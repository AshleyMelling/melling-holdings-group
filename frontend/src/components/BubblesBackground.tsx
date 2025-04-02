import React from "react";
import "./BubblesBackground.css";

const BubblesBackground: React.FC = () => {
  return (
    <div className="bubbles-wrapper">
      <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1 animate-breathe"></div>
          <div className="g2 animate-float"></div>
          <div className="g3 animate-drift"></div>
          <div className="g4 animate-float"></div>
          <div className="g5 animate-breathe"></div>
          <div className="interactive"></div>
        </div>
      </div>
    </div>
  );
};

export default BubblesBackground;
