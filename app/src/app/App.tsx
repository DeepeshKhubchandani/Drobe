import { useState, useEffect } from "react";
import logoImg from "../assets/logo.png";
import { PhoneFrame } from "./components/PhoneFrame";
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
      className="min-h-screen flex items-center justify-center py-8"
      style={{
        background: "linear-gradient(135deg, #F0ECE4 0%, #E8E2D8 50%, #EDE5D8 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Background label */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="Drobe" style={{ height: 28, width: "auto" }} />
          <span style={{ fontSize: 11, color: "#A0917E", letterSpacing: "2px", textTransform: "uppercase", marginLeft: 6 }}>
            Design Preview
          </span>
        </div>
      </div>

      {/* Screen selector (shown when in app mode) */}
      {currentScreen === "app" && (
        <div
          className="absolute top-6 right-8 flex items-center gap-2"
        >
          {[
            { id: "ai", label: "Style AI" },
            { id: "wardrobe", label: "Wardrobe" },
            { id: "planner", label: "Planner" },
            { id: "profile", label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 600 : 400,
                background: activeTab === tab.id ? "#1A1A1A" : "rgba(255,255,255,0.6)",
                color: activeTab === tab.id ? "#fff" : "#6B5E4E",
                border: "1px solid rgba(0,0,0,0.08)",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setCurrentScreen("splash")}
            style={{
              padding: "6px 14px",
              borderRadius: 100,
              fontSize: 12,
              background: "rgba(201,169,110,0.2)",
              color: "#8B6A30",
              border: "1px solid rgba(201,169,110,0.3)",
              cursor: "pointer",
              marginLeft: 4,
            }}
          >
            ← Welcome
          </button>
        </div>
      )}

      <PhoneFrame>
        {currentScreen === "splash" ? (
          <SplashScreen onNext={handleSplashNext} />
        ) : currentScreen === "auth" ? (
          <AuthScreen onSuccess={handleAuthSuccess} />
        ) : (
          <div className="relative w-full h-full">
            <div className="w-full h-full overflow-hidden">
              {activeTab === "ai" && <AIScreen onNavigate={handleNavigate} />}
              {activeTab === "wardrobe" && <WardrobeScreen onNavigate={handleNavigate} />}
              {activeTab === "planner" && <OutfitPlannerScreen onNavigate={handleNavigate} />}
              {activeTab === "profile" && <ProfileScreen />}
            </div>
            <BottomNav active={activeTab} onNavigate={handleNavigate} />
          </div>
        )}
      </PhoneFrame>
    </div>
  );
}