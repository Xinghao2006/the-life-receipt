import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap, Sparkles, Music, Volume2, VolumeX } from 'lucide-react';

interface KarmaClickerProps {
  onBack: () => void;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

const WOOD_SOUND = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; // Placeholder, we will use a generated beep logic or short url if base64 is too long. 
// Actually for a wood block sound, a short beep via AudioContext is better and lighter, but for this demo I will use a reliable external short sound or synthesized buffer.

const KarmaClicker: React.FC<KarmaClickerProps> = ({ onBack }) => {
  const [count, setCount] = useState(0);
  const [clicks, setClicks] = useState<FloatingText[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  
  // Audio Context for low latency sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const autoClickerRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('karma_count');
    if (saved) setCount(parseInt(saved));
    
    // Init Audio Context
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
       if (autoClickerRef.current) clearInterval(autoClickerRef.current);
       if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('karma_count', count.toString());
  }, [count]);

  useEffect(() => {
    if (autoPlay) {
        autoClickerRef.current = window.setInterval(() => {
            triggerHit(window.innerWidth / 2, window.innerHeight / 2, true);
        }, 1000);
    } else {
        if (autoClickerRef.current) clearInterval(autoClickerRef.current);
    }
  }, [autoPlay]);

  const playWoodSound = () => {
      if (isMuted || !audioCtxRef.current) return;
      
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Simulate wood block: Sine wave with rapid decay, slightly detuned
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
  };

  const triggerHit = (x: number, y: number, isAuto: boolean = false) => {
      setCount(prev => prev + 1);
      playWoodSound();
      
      // Add floating text
      const id = Date.now();
      const text = isAuto ? "自动积德 +1" : "功德 +1";
      // Randomize position slightly around center if auto
      const finalX = isAuto ? x + (Math.random() - 0.5) * 50 : x;
      const finalY = isAuto ? y + (Math.random() - 0.5) * 50 : y;

      setClicks(prev => [...prev, { id, x: finalX, y: finalY, text }]);
      
      // Cleanup text
      setTimeout(() => {
          setClicks(prev => prev.filter(c => c.id !== id));
      }, 1000);

      // Vibration
      if (navigator.vibrate && !isAuto) navigator.vibrate(50);
  };

  const handleClick = (e: React.MouseEvent) => {
      triggerHit(e.clientX, e.clientY);
  };

  return (
    <div className="min-h-screen w-full bg-[#1c1917] text-stone-200 flex flex-col font-sans relative overflow-hidden select-none touch-manipulation">
        
        {/* Background Zen Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-stone-800 rounded-full opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-stone-800 rounded-full opacity-30 pointer-events-none"></div>

        {/* Header */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-stone-500 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full"
            >
                <ArrowLeft size={16} /> 返回
            </button>
            <div className="flex gap-4">
                 <button onClick={() => setAutoPlay(!autoPlay)} className={`p-3 rounded-full transition-all ${autoPlay ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-500'}`}>
                    <Zap size={20} className={autoPlay ? 'fill-current' : ''} />
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-stone-800 rounded-full text-stone-500 hover:text-white transition-colors">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10" onClick={handleClick}>
            
            {/* Counter */}
            <div className="mb-12 text-center">
                <div className="text-sm font-bold tracking-[0.5em] text-stone-500 uppercase mb-2">Total Karma</div>
                <div className="text-6xl md:text-8xl font-serif-title font-bold text-white tabular-nums tracking-tight">
                    {count}
                </div>
            </div>

            {/* Wooden Fish Visual (CSS Shapes) */}
            <div className="relative group cursor-pointer active:scale-95 transition-transform duration-75">
                 {/* Stick */}
                 <div className="absolute -right-16 -top-16 w-32 h-6 bg-stone-600 rounded-full transform rotate-45 origin-bottom-left transition-transform group-active:rotate-[30deg] z-10"></div>
                 <div className="absolute -right-20 -top-20 w-12 h-12 bg-stone-500 rounded-full transform z-20"></div>

                 {/* Fish Body */}
                 <div className="w-48 h-40 md:w-64 md:h-52 bg-gradient-to-br from-amber-700 to-amber-900 rounded-[3rem] shadow-2xl relative border-b-8 border-amber-950 flex items-center justify-center">
                    {/* Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent rounded-[3rem]"></div>
                    {/* Eye/Opening */}
                    <div className="w-24 h-4 bg-black/40 rounded-full"></div>
                 </div>
                 
                 {/* Ripple Effect Container */}
                 <div className="absolute inset-0 rounded-[3rem] animate-ping opacity-0 group-active:opacity-20 bg-white pointer-events-none"></div>
            </div>

            <p className="mt-16 text-stone-500 text-xs tracking-widest uppercase animate-pulse">
                Tap anywhere to accumulate merit
            </p>

        </div>

        {/* Floating Text Overlay */}
        {clicks.map(c => (
            <div 
                key={c.id}
                className="fixed pointer-events-none text-amber-400 font-bold text-xl animate-fade-in-up"
                style={{ left: c.x, top: c.y, transform: 'translate(-50%, -100%)' }}
            >
                {c.text}
            </div>
        ))}
        
        <style>{`
            @keyframes fade-in-up {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
                100% { opacity: 0; transform: translate(-50%, -150%) scale(1.2); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.8s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default KarmaClicker;