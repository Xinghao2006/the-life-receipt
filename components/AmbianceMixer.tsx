import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CloudRain, Flame, Wind, Sun, Volume1, Waves } from 'lucide-react';

interface AmbianceMixerProps {
  onBack: () => void;
}

type SoundType = 'white' | 'pink' | 'brown';

interface SoundTrack {
  id: string;
  icon: React.ReactNode;
  label: string;
  type: SoundType; 
  filterFreq?: number; 
}

const SOUNDS: SoundTrack[] = [
    { id: 'focus', label: '深度专注', icon: <Sun size={24} />, type: 'white' },
    { id: 'rain', label: '倾盆大雨', icon: <CloudRain size={24} />, type: 'pink' },
    { id: 'fire', label: '篝火晚会', icon: <Flame size={24} />, type: 'brown', filterFreq: 500 },
    { id: 'wind', label: '山谷微风', icon: <Wind size={24} />, type: 'pink', filterFreq: 400 },
    { id: 'ocean', label: '海浪拍岸', icon: <Waves size={24} />, type: 'brown' },
];

const AmbianceMixer: React.FC<AmbianceMixerProps> = ({ onBack }) => {
  const [activeVolumes, setActiveVolumes] = useState<Record<string, number>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { gain: GainNode, source?: AudioBufferSourceNode }>>({});

  useEffect(() => {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();

      return () => {
          if (audioCtxRef.current) {
              audioCtxRef.current.close();
          }
      };
  }, []);

  const createNoiseBuffer = (ctx: AudioContext, type: SoundType): AudioBuffer => {
      const bufferSize = ctx.sampleRate * 5; 
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      
      if (type === 'white') {
          for (let i = 0; i < bufferSize; i++) {
              output[i] = Math.random() * 2 - 1;
          }
      } else if (type === 'pink') {
          let b0, b1, b2, b3, b4, b5, b6;
          b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
          for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              b0 = 0.99886 * b0 + white * 0.0555179;
              b1 = 0.99332 * b1 + white * 0.0750759;
              b2 = 0.96900 * b2 + white * 0.1538520;
              b3 = 0.86650 * b3 + white * 0.3104856;
              b4 = 0.55000 * b4 + white * 0.5329522;
              b5 = -0.7616 * b5 - white * 0.0168980;
              output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
              output[i] *= 0.11; 
              b6 = white * 0.115926;
          }
      } else if (type === 'brown') {
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              output[i] = (lastOut + (0.02 * white)) / 1.02;
              lastOut = output[i];
              output[i] *= 3.5; 
          }
      }
      return buffer;
  };

  const toggleSound = (id: string) => {
      setActiveVolumes(prev => {
          const isActive = !!prev[id];
          if (isActive) {
              const next = { ...prev };
              delete next[id];
              return next;
          } else {
              return { ...prev, [id]: 0.5 };
          }
      });
  };

  const updateVolume = (id: string, vol: number) => {
      setActiveVolumes(prev => ({ ...prev, [id]: vol }));
  };

  useEffect(() => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      SOUNDS.forEach(sound => {
          const targetVol = activeVolumes[sound.id];
          
          if (!nodesRef.current[sound.id]) {
              const gainNode = ctx.createGain();
              gainNode.gain.value = 0;
              if (sound.filterFreq) {
                  const filter = ctx.createBiquadFilter();
                  filter.type = 'lowpass';
                  filter.frequency.value = sound.filterFreq;
                  gainNode.connect(filter);
                  filter.connect(ctx.destination);
              } else {
                  gainNode.connect(ctx.destination);
              }
              nodesRef.current[sound.id] = { gain: gainNode };
          }

          const nodeData = nodesRef.current[sound.id];

          if (targetVol !== undefined && targetVol > 0) {
              if (!nodeData.source) {
                  const src = ctx.createBufferSource();
                  src.buffer = createNoiseBuffer(ctx, sound.type);
                  src.loop = true;
                  src.connect(nodeData.gain);
                  src.start();
                  nodeData.source = src;
              }
              nodeData.gain.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.1);
          } else {
              nodeData.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
              if (nodeData.source && targetVol === undefined) {
                  setTimeout(() => {
                      if (nodesRef.current[sound.id]?.source) {
                          nodesRef.current[sound.id].source?.stop();
                          nodesRef.current[sound.id].source = undefined;
                      }
                  }, 200);
              }
          }
      });
  }, [activeVolumes]);

  return (
    <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        style={{
            background: "linear-gradient(to top, #0f172a, #334155)",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
    >
        
        {/* Back Button */}
        <button 
            onClick={onBack}
            className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
        >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">返回博客</span>
        </button>

        {/* Mixer Board */}
        <div className="flex-1 w-full overflow-y-auto p-8 flex items-center justify-center pt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full">
                
                {SOUNDS.map((sound) => {
                    const isActive = activeVolumes[sound.id] !== undefined;
                    const volume = activeVolumes[sound.id] || 0.5;

                    return (
                        <div 
                            key={sound.id}
                            className={`
                                relative p-4 rounded-xl border transition-all duration-300 group
                                ${isActive 
                                    ? 'bg-emerald-900/40 backdrop-blur-md border-emerald-500/50 shadow-lg' 
                                    : 'bg-slate-800/40 backdrop-blur-sm border-white/5 hover:bg-slate-700/40'}
                            `}
                        >
                            {/* Header / Toggle */}
                            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => toggleSound(sound.id)}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-all duration-500 ${isActive ? 'bg-emerald-400 text-emerald-900' : 'bg-slate-700 text-slate-400'}`}>
                                        {sound.icon}
                                    </div>
                                    <h3 className={`font-serif-title font-bold text-lg ${isActive ? 'text-emerald-100' : 'text-slate-300'}`}>{sound.label}</h3>
                                </div>
                                
                                <div className={`
                                    w-3 h-3 rounded-full border-2 transition-all duration-300
                                    ${isActive ? 'bg-emerald-400 border-emerald-400' : 'bg-transparent border-slate-500'}
                                `}></div>
                            </div>

                            {/* Volume Slider */}
                            <div className={`transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2 pointer-events-none grayscale'}`}>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-wider">
                                    <Volume1 size={12} />
                                    <span>音量 {Math.round(volume * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.01" 
                                    value={volume}
                                    onChange={(e) => updateVolume(sound.id, parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:accent-emerald-300"
                                />
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    </div>
  );
};

export default AmbianceMixer;