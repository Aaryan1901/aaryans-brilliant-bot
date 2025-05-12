
import { useEffect, useState } from "react";

const HeroLanding = () => {
  const [animationState, setAnimationState] = useState(0);
  
  useEffect(() => {
    // Step through animation states
    const timer1 = setTimeout(() => setAnimationState(1), 300);
    const timer2 = setTimeout(() => setAnimationState(2), 1200);
    const timer3 = setTimeout(() => setAnimationState(3), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 px-4 sm:px-6">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center relative">
          {/* Character Animation */}
          <div 
            className={`transition-all duration-1000 transform ${
              animationState >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <img 
              src="/lovable-uploads/e0613fbe-0668-4140-93c2-a6fc4bfcc7e1.png" 
              alt="Aaryan's Bot Logo" 
              className={`w-48 sm:w-64 md:w-80 transition-all duration-1000 ${
                animationState >= 2 ? "scale-100" : "scale-110"
              }`}
            />
          </div>
          
          {/* Text Animation */}
          <div 
            className={`mt-4 sm:mt-6 transition-all duration-1000 transform ${
              animationState >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4 relative overflow-hidden">
              <span className={`${animationState >= 3 ? 'animate-pulse' : ''}`}>
                Welcome to Aaryan's SuperBot
              </span>
              <span 
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-1000 ${
                  animationState >= 3 ? "scale-x-100" : "scale-x-0"
                }`}
              ></span>
            </h1>
            
            <p className={`text-base sm:text-lg md:text-xl text-primary-foreground/70 max-w-lg mx-auto transition-all duration-1000 delay-300 ${
              animationState >= 3 ? "opacity-100" : "opacity-0"
            }`}>
              Your AI-powered assistant for intelligent conversations
            </p>
          </div>
        </div>
        
        {/* Loading Indicator */}
        <div className={`mt-6 sm:mt-8 transition-all duration-500 ${
          animationState >= 3 ? "opacity-100" : "opacity-0"
        }`}>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <p className="text-xs sm:text-sm text-primary/80 mt-3 sm:mt-4">Loading your AI assistant...</p>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
