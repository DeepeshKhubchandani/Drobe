import { useState, useEffect } from "react";
import { SplashScreen } from "./components/screens/SplashScreen";
import { AuthScreen } from "./components/screens/AuthScreen";
import { WardrobeScreen } from "./components/screens/WardrobeScreen";
import { AIScreen } from "./components/screens/AIScreen";
import { OutfitPlannerScreen } from "./components/screens/OutfitPlannerScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import { BottomNav } from "./components/BottomNav";
import { useAuth } from "../contexts/AuthContext";

export default function App() {
  const { user, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>("splash");
  const [activeTab, setActiveTab] = useState("ai");

  // Once authenticated, navigate to app
  useEffect(() => {
    if (user && currentScreen !== 'app') {
      setCurrentScreen('app');
      setActiveTab('ai');
    }
  }, [user]);

  const handleNavigate = (screen: string) => {
    if (screen === "splash") {
      setCurrentScreen("splash");
    } else if (screen === "auth") {
      setCurrentScreen("auth");
    } else {
      setCurrentScreen("app");
      setActiveTab(screen);
    }
  };

  const handleSplashNext = (mode: 'signin' | 'signup') => {
    setCurrentScreen("auth");
  };

  const handleAuthSuccess = () => {
    setCurrentScreen("app");
    setActiveTab("ai");
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F0ECE4 0%, #E8E2D8 50%, #EDE5D8 100%)',
        }}
      >
        <p style={{ color: '#A0917E' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen overflow-hidden"
      style={{
        background: "#F7F5F2",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {currentScreen === "splash" ? (
        <SplashScreen onNext={handleSplashNext} />
      ) : currentScreen === "auth" ? (
        <AuthScreen onSuccess={handleAuthSuccess} />
      ) : (
        <div className="relative w-full h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            {activeTab === "ai" && <AIScreen onNavigate={handleNavigate} />}
            {activeTab === "wardrobe" && <WardrobeScreen onNavigate={handleNavigate} />}
            {activeTab === "planner" && <OutfitPlannerScreen onNavigate={handleNavigate} />}
            {activeTab === "profile" && <ProfileScreen />}
          </div>
          <BottomNav active={activeTab} onNavigate={handleNavigate} />
        </div>
      )}
    </div>
  );
}