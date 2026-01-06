import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CloudRain, Flame, Wind, Keyboard, Moon, Coffee, Volume2, Volume1, VolumeX } from 'lucide-react';

interface AmbianceMixerProps {
  onBack: () => void;
}

interface SoundTrack {
  id: string;
  icon: React.ReactNode;
  label: string;
  url: string;
  color: string;
}

const SOUNDS: SoundTrack[] = [
    { id: 'rain', label: 'Heavy Rain', icon: <CloudRain size={24} />, url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg', color: 'bg-blue-600' },
    { id: 'fire', label: 'Campfire', icon: <Flame size={24} />, url: 'https://actions.google.com/sounds/v1/ambiences/fire.ogg', color: 'bg-orange-600' },
    { id: 'wind', label: 'Windy', icon: <Wind size={24} />, url: 'https://actions.google.com/sounds/v1/weather/wind_medium.ogg', color: 'bg-slate-500' },
    { id: 'coffee', label: 'Coffee Shop', icon: <Coffee size={24} />, url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg', color: 'bg-amber-700' },
    { id: 'night', label: 'Thunder', icon: <Moon size={24} />, url: 'https://actions.google.com/sounds/v1/weather/thunderstorm.ogg', color: 'bg-indigo-900' },
];

const AmbianceMixer: React.FC<AmbianceMixerProps> = ({ onBack }) => {
  // State to track volume of each sound (0 = off, 1-100 = on)
  const [activeVolumes, setActiveVolumes] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const toggleSound = (id: string) => {
      setActiveVolumes(prev => {
          const isActive = !!prev[id];
          if (isActive) {
              const next = { ...prev };
              delete next[id];
              return next;
          } else {
              // Increase default volume for Thunder (night)
              const defaultVol = id === 'night' ? 0.8 : 0.5;
              return { ...prev, [id]: defaultVol };
          }
      });
  };

  const updateVolume = (id: string, vol: number) => {
      setActiveVolumes(prev => ({
          ...prev,
          [id]: vol
      }));
  };

  // Sync Audio Elements
  useEffect(() => {
      SOUNDS.forEach(sound => {
          let audio = audioRefs.current[sound.id];
          if (!audio) {
              audio = new Audio(sound.url);
              audio.loop = true;
              audioRefs.current[sound.id] = audio;
          }

          const targetVol = activeVolumes[sound.id];
          
          if (targetVol !== undefined) {
              if (audio.paused) {
                  audio.play().catch(e => console.log("Autoplay blocked", e));
              }
              audio.volume = targetVol;
          } else {
              if (!audio.paused) {
                  audio.pause();
              }
              audio.currentTime = 0;
          }
      });

      return () => {
          // Cleanup on unmount is handled by next effect or manually if needed
          // But refs persist, so we should pause all on unmount
      };
  }, [activeVolumes]);

  useEffect(() => {
      return () => {
          Object.values(audioRefs.current).forEach((audio: HTMLAudioElement) => {
              audio.pause();
              audio.src = "";
          });
      };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex flex-col font-mono relative overflow-hidden">
        
        {/* Pixel Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
                 backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
                 backgroundSize: '20px 20px'
             }}>
        </div>

        {/* Header */}
        <div className="relative z-20 p-6 flex justify-between items-center bg-[#1e293b] border-b border-slate-700 shadow-lg">
             <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
            >
                <ArrowLeft size={16} /> Exit Mixer
            </button>
            <h1 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Volume2 size={16} /> 8-BIT AMBIANCE
            </h1>
        </div>

        {/* Mixer Board */}
        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
                
                {SOUNDS.map((sound) => {
                    const isActive = activeVolumes[sound.id] !== undefined;
                    // Show correct default volume on slider even when inactive
                    const volume = activeVolumes[sound.id] || (sound.id === 'night' ? 0.8 : 0.5);

                    return (
                        <div 
                            key={sound.id}
                            className={`
                                relative p-6 rounded-xl border-2 transition-all duration-300 group
                                ${isActive 
                                    ? 'bg-slate-800 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                                    : 'bg-slate-900 border-slate-700 hover:border-slate-500'}
                            `}
                        >
                            {/* Header / Toggle */}
                            <div className="flex justify-between items-start mb-6 cursor-pointer" onClick={() => toggleSound(sound.id)}>
                                <div className={`p-3 rounded-lg transition-colors ${isActive ? sound.color : 'bg-slate-800 text-slate-500'}`}>
                                    {sound.icon}
                                </div>
                                <div className={`w-3 h-3 rounded-full shadow-inner transition-colors ${isActive ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-800'}`}></div>
                            </div>

                            <div className="mb-4">
                                <h3 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-slate-500'}`}>{sound.label}</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{isActive ? 'ACTIVE' : 'MUTED'}</p>
                            </div>

                            {/* Volume Slider */}
                            <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-20 pointer-events-none'}`}>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                    <Volume1 size={12} />
                                    <span>VOL {Math.round(volume * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.01" 
                                    value={volume}
                                    onChange={(e) => updateVolume(sound.id, parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                                />
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-20 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-20 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-20 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-20 rounded-br-lg"></div>
                        </div>
                    );
                })}

            </div>
        </div>
    </div>
  );
};

export default AmbianceMixer;