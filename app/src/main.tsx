import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './styles/index.css';
import { AuthProvider } from './contexts/AuthContext';
import { WardrobeProvider } from './contexts/WardrobeContext';
import { OutfitProvider } from './contexts/OutfitContext';
import { WeatherProvider } from './contexts/WeatherContext';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <WardrobeProvider>
      <OutfitProvider>
        <WeatherProvider>
          <App />
        </WeatherProvider>
      </OutfitProvider>
    </WardrobeProvider>
  </AuthProvider>
);