import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import ReceiptGenerator from './components/ReceiptGenerator';
import MoodMixtape from './components/MoodMixtape';

type ActiveTool = 'receipt' | 'mixtape' | null;

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  
  // Audio State lifted to App level to persist playback across views
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Basic routing based on Hash
    const checkHash = () => {
        const hash = window.location.hash;
        if (hash.includes('config=')) {
            setActiveTool('receipt');
        } else if (hash.includes('tool=mixtape')) {
            setActiveTool('mixtape');
        }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Audio Fade In/Out Logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
    }

    if (isPlaying) {
        // Fade In
        audio.play().catch(e => console.log("Audio play failed:", e));
        let volume = audio.volume; // Start from current volume
        if (audio.paused) audio.volume = 0; 
        
        const targetVolume = 0.5; 
        const step = 0.05;

        fadeIntervalRef.current = window.setInterval(() => {
            if (audio.volume < targetVolume) {
                audio.volume = Math.min(audio.volume + step, targetVolume);
            } else {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            }
        }, 100);
    } else {
        // Fade Out
        const step = 0.05;
        fadeIntervalRef.current = window.setInterval(() => {
            if (audio.volume > 0) {
                audio.volume = Math.max(audio.volume - step, 0);
            } else {
                audio.pause();
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            }
        }, 100);
    }

    return () => {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleOpenTool = (toolId: string) => {
      // Clear hash if moving to a fresh tool to avoid state conflicts
      if (!window.location.hash.includes('config=')) {
          try {
            window.history.replaceState(null, '', window.location.pathname);
          } catch (e) {
            console.warn('Navigation history update failed:', e);
          }
      }
      
      if (toolId === 'receipt') setActiveTool('receipt');
      if (toolId === 'mixtape') setActiveTool('mixtape');
  };

  const handleBackToBlog = () => {
      try {
          window.history.pushState(null, '', window.location.pathname);
      } catch (e) {
          console.warn('Navigation history update failed:', e);
          try {
            window.location.hash = '';
          } catch(e2) {
             console.warn('Hash update failed:', e2);
          }
      }
      setActiveTool(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafaf9]">
      {/* Persistent Audio Element */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" />

      {/* Blog View (Base Layer) */}
      <div 
        className={`transition-all duration-700 ease-in-out transform ${
            activeTool ? 'scale-95 opacity-50 blur-[2px]' : 'scale-100 opacity-100'
        }`}
      >
        <Blog 
            onOpenTool={handleOpenTool} 
            isPlaying={isPlaying} 
            togglePlay={togglePlay} 
        />
      </div>

      {/* Tool Layer - Receipt */}
      <div 
        className={`fixed inset-0 z-50 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
            activeTool === 'receipt' ? 'translate-y-0' : 'translate-y-[110%]'
        }`}
      >
        <div className="h-full w-full overflow-y-auto bg-[#fafaf9]">
            <ReceiptGenerator onBack={handleBackToBlog} />
        </div>
      </div>

       {/* Tool Layer - Mixtape */}
       <div 
        className={`fixed inset-0 z-50 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
            activeTool === 'mixtape' ? 'translate-y-0' : 'translate-y-[110%]'
        }`}
      >
        <div className="h-full w-full overflow-y-auto bg-[#451a03]">
            <MoodMixtape onBack={handleBackToBlog} />
        </div>
      </div>

    </div>
  );
};

export default App;