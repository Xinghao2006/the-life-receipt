import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import ReceiptGenerator from './components/ReceiptGenerator';

type ViewMode = 'blog' | 'tool';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('blog');
  
  // Audio State lifted to App level to persist playback across views
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Basic routing based on Hash
    const checkHash = () => {
        const hash = window.location.hash;
        if (hash.includes('config=')) {
            setView('tool');
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
        let volume = audio.volume; // Start from current volume (usually 0 if just loaded, or current if toggled fast)
        // If starting fresh, ensure volume is 0
        if (audio.paused) audio.volume = 0; 
        
        const targetVolume = 0.5; // Max volume
        const step = 0.05;

        fadeIntervalRef.current = window.setInterval(() => {
            if (audio.volume < targetVolume) {
                audio.volume = Math.min(audio.volume + step, targetVolume);
            } else {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            }
        }, 100); // Update every 100ms
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

  const handleOpenTool = () => {
      if (!window.location.hash.includes('config=')) {
          try {
            window.history.replaceState(null, '', window.location.pathname);
          } catch (e) {
            console.warn('Navigation history update failed:', e);
          }
      }
      setView('tool');
  };

  const handleBackToBlog = () => {
      try {
          window.history.pushState(null, '', window.location.pathname);
      } catch (e) {
          console.warn('Navigation history update failed:', e);
          try {
            if (window.location.hash) {
                window.location.hash = '';
            }
          } catch(e2) {
             console.warn('Hash update failed:', e2);
          }
      }
      setView('blog');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafaf9]">
      {/* Persistent Audio Element */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" />

      {/* Blog View (Base Layer) */}
      <div 
        className={`transition-all duration-700 ease-in-out transform ${
            view === 'tool' ? 'scale-95 opacity-50 blur-[2px]' : 'scale-100 opacity-100'
        }`}
      >
        <Blog 
            onOpenTool={handleOpenTool} 
            isPlaying={isPlaying} 
            togglePlay={togglePlay} 
        />
      </div>

      {/* Tool View (Slide Up Layer) */}
      <div 
        className={`fixed inset-0 z-50 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
            view === 'tool' ? 'translate-y-0' : 'translate-y-[110%]'
        }`}
      >
        {/* Only render contents if view is tool or transitioning (simplified here to always render but hide via css for smooth anim) 
            However, to reset state properly, sometimes unmounting is desired. 
            For smooth CSS slide-up, keeping it mounted is better. */}
        <div className="h-full w-full overflow-y-auto bg-[#fafaf9]">
            <ReceiptGenerator onBack={handleBackToBlog} />
        </div>
      </div>
    </div>
  );
};

export default App;