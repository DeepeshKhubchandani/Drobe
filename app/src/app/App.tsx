import { useState } from "react";
import { AuthScreen } from "./components/screens/AuthScreen";
import { WardrobeScreen } from "./components/screens/WardrobeScreen";
import { AIScreen } from "./components/screens/AIScreen";
import { OutfitPlannerScreen } from "./components/screens/OutfitPlannerScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import { BottomNav } from "./components/BottomNav";
import { useAuth } from "../contexts/AuthContext";
import logoMini from "../assets/DrobeLogoMini.png";

export default function App() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("ai");

  const handleNavigate = (screen: string) => {
    setActiveTab(screen);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F0ECE4 0%, #E8E2D8 50%, #EDE5D8 100%)',
        }}
      >
        <style>
          {`
            @keyframes spinPause {
              0% { transform: rotate(0deg); }
              30% { transform: rotate(360deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div
          style={{
            width: 80,
            height: 80,
            animation: "spinPause 2s ease-in-out infinite",
          }}
        >
          <img
            src={logoMini}
            alt="Loading"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen onSuccess={() => {}} />;
  }

  // Show main app if logged in
  return (
    <div
      className="w-full h-screen overflow-hidden"
      style={{
        background: "#F7F5F2",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="relative w-full h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          {activeTab === "ai" && <AIScreen onNavigate={handleNavigate} />}
          {activeTab === "wardrobe" && <WardrobeScreen onNavigate={handleNavigate} />}
          {activeTab === "planner" && <OutfitPlannerScreen onNavigate={handleNavigate} />}
          {activeTab === "profile" && <ProfileScreen />}
        </div>
        <BottomNav active={activeTab} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}