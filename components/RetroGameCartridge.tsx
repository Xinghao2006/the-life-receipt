import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gamepad2, Save, RefreshCw, Trophy, Skull, Heart, BarChart2 } from 'lucide-react';

interface RetroGameCartridgeProps {
  onBack: () => void;
}

// RPG Classes for flavor
const CLASSES = [
    { id: 'coder', label: 'Code Mage', icon: '🧙‍♂️', color: 'bg-indigo-600', desc: 'Mana = Caffeine' },
    { id: 'warrior', label: 'Deadline Warrior', icon: '⚔️', color: 'bg-red-700', desc: 'Thrives under pressure' },
    { id: 'rogue', label: 'Bug Hunter', icon: '🕵️', color: 'bg-emerald-600', desc: 'Stealthy debugger' },
    { id: 'bard', label: 'Product Manager', icon: '🎭', color: 'bg-amber-600', desc: 'Talks a lot' },
];

const RetroGameCartridge: React.FC<RetroGameCartridgeProps> = ({ onBack }) => {
  const [name, setName] = useState('Player 1');
  const [selectedClass, setSelectedClass] = useState('coder');
  const [level, setLevel] = useState(24);
  
  // Stats
  const [stats, setStats] = useState({
      str: 5, // Strength (Physical Health)
      int: 8, // Intelligence (Coding Skill)
      luck: 3, // Luck (Gacha/Deploy success)
  });

  // Derived Avatar URL (DiceBear Pixel Art)
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${name}&scale=120&radius=10`;

  const handleStatChange = (key: keyof typeof stats, val: number) => {
      setStats(prev => ({ ...prev, [key]: val }));
  };

  const currentClass = CLASSES.find(c => c.id === selectedClass) || CLASSES[0];

  return (
    <div className="min-h-screen w-full bg-[#1a1b26] text-white flex flex-col items-center py-10 px-4 font-mono">
        
        {/* Nav */}
        <div className="w-full max-w-2xl flex justify-between items-center mb-8">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium font-sans">返回</span>
            </button>
            <h1 className="text-xl font-bold tracking-widest text-[#7aa2f7] flex items-center gap-2 text-shadow-neon">
                <Gamepad2 size={24} /> 
                <span className="hidden sm:inline">CHARACTER CREATION</span>
                <span className="sm:hidden">CREATE</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl items-start">
            
            {/* Left: Input Console */}
            <div className="order-2 lg:order-1 space-y-6">
                 {/* Card 1: Identity */}
                 <div className="bg-[#24283b] p-6 rounded-xl border border-[#414868] shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#bb9af7]"></div>
                    <h3 className="text-[#7aa2f7] font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Save size={16} /> Identity Module
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-[#565f89] mb-1">PLAYER NAME</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={12}
                                className="w-full bg-[#1a1b26] border border-[#414868] rounded p-3 text-[#c0caf5] focus:border-[#7aa2f7] outline-none font-bold tracking-widest"
                            />
                        </div>

                        <div>
                             <label className="block text-xs text-[#565f89] mb-1">LEVEL (AGE)</label>
                             <div className="flex items-center gap-4">
                                <input 
                                    type="range" 
                                    min="1" max="99" 
                                    value={level}
                                    onChange={(e) => setLevel(parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-[#1a1b26] rounded-lg appearance-none cursor-pointer accent-[#bb9af7]"
                                />
                                <span className="text-2xl font-bold text-[#bb9af7] w-12 text-right">{level}</span>
                             </div>
                        </div>

                        <div>
                            <label className="block text-xs text-[#565f89] mb-2">CLASS SELECTION</label>
                            <div className="grid grid-cols-2 gap-2">
                                {CLASSES.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedClass(c.id)}
                                        className={`p-2 rounded border text-left transition-all flex items-center gap-2 ${selectedClass === c.id ? 'bg-[#7aa2f7]/20 border-[#7aa2f7] text-white' : 'bg-[#1a1b26] border-[#414868] text-[#565f89] hover:bg-[#292e42]'}`}
                                    >
                                        <span className="text-xl">{c.icon}</span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold">{c.label}</span>
                                            <span className="text-[9px] opacity-70">{c.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Card 2: Stats */}
                 <div className="bg-[#24283b] p-6 rounded-xl border border-[#414868] shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#f7768e]"></div>
                    <h3 className="text-[#f7768e] font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                        <BarChart2 size={16} /> Stats Allocation
                    </h3>
                    
                    <div className="space-y-4">
                        {[
                            { id: 'str', label: 'STRENGTH (HP)', color: 'bg-red-500', icon: <Heart size={14}/> },
                            { id: 'int', label: 'INTELLIGENCE (MP)', color: 'bg-blue-500', icon: <RefreshCw size={14}/> },
                            { id: 'luck', label: 'LUCK (CRIT)', color: 'bg-yellow-500', icon: <Trophy size={14}/> }
                        ].map((stat) => (
                            <div key={stat.id}>
                                <div className="flex justify-between text-xs text-[#a9b1d6] mb-1">
                                    <span className="flex items-center gap-1">{stat.icon} {stat.label}</span>
                                    <span>{(stats as any)[stat.id]} / 10</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="range" min="1" max="10"
                                        value={(stats as any)[stat.id]}
                                        onChange={(e) => handleStatChange(stat.id as any, parseInt(e.target.value))}
                                        className={`flex-1 h-2 bg-[#1a1b26] rounded-lg appearance-none cursor-pointer accent-${stat.color.split('-')[1]}-500`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

            {/* Right: The Cartridge (Visualizer) */}
            <div className="order-1 lg:order-2 flex flex-col items-center">
                <div className="relative group w-72 h-80 transform-style-3d transition-transform duration-500 hover:rotate-x-12 hover:rotate-y-12" style={{ perspective: '1000px' }}>
                    
                    {/* Cartridge Plastic Shell */}
                    <div className="absolute inset-0 bg-[#c0caf5] rounded-t-lg shadow-2xl overflow-hidden border-b-[12px] border-[#9aa5ce] flex flex-col items-center">
                        
                        {/* Top Grip */}
                        <div className="w-full h-6 bg-[#9aa5ce] mb-4 border-b border-black/10"></div>

                        {/* The Sticker (The Main Content) */}
                        <div className="w-[85%] h-[75%] bg-[#1a1b26] rounded-sm relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-black/50 group-hover:sepia-[.1] transition-all">
                            
                            {/* Background Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(122,162,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(122,162,247,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                            
                            {/* Sticker Content */}
                            <div className="relative z-10 p-3 flex flex-col h-full">
                                
                                {/* Header */}
                                <div className="flex justify-between items-start mb-2 border-b-2 border-[#7aa2f7] pb-1">
                                    <span className="text-[10px] text-[#7aa2f7] font-bold">SAVE FILE: 01</span>
                                    <span className="text-[10px] text-[#bb9af7] font-bold animate-pulse">Lv.{level}</span>
                                </div>

                                {/* Main Body */}
                                <div className="flex gap-3 flex-1">
                                    {/* Avatar */}
                                    <div className="w-20 h-20 border-2 border-white/20 rounded bg-[#24283b] flex-shrink-0 relative overflow-hidden">
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover pixelated" />
                                        <div className="absolute bottom-0 w-full bg-black/60 text-[8px] text-center text-white py-0.5">
                                            {currentClass.label}
                                        </div>
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-lg font-black text-white leading-none uppercase tracking-tighter mb-1">{name}</h2>
                                            <div className="text-[8px] text-[#9ece6a] font-mono">&gt; STATUS: ONLINE</div>
                                        </div>
                                        
                                        {/* Stat Bars Visualization */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[8px] w-4 text-red-400">STR</span>
                                                <div className="flex-1 h-1 bg-[#24283b]"><div className="h-full bg-red-500" style={{width: `${stats.str * 10}%`}}></div></div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[8px] w-4 text-blue-400">INT</span>
                                                <div className="flex-1 h-1 bg-[#24283b]"><div className="h-full bg-blue-500" style={{width: `${stats.int * 10}%`}}></div></div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[8px] w-4 text-yellow-400">LCK</span>
                                                <div className="flex-1 h-1 bg-[#24283b]"><div className="h-full bg-yellow-500" style={{width: `${stats.luck * 10}%`}}></div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-auto pt-2 flex justify-between items-end">
                                    <div className="text-[8px] text-[#565f89] max-w-[60%] leading-tight">
                                        {currentClass.desc}
                                    </div>
                                    <div className="w-8 h-8 bg-white p-0.5">
                                        {/* Fake QR */}
                                        <div className="w-full h-full bg-black flex flex-wrap content-start">
                                            {Array.from({length:16}).map((_,i) => (
                                                <div key={i} className={`w-1/4 h-1/4 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Holo Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                        </div>

                    </div>
                    
                    {/* Shadow */}
                    <div className="absolute -bottom-12 left-4 right-4 h-8 bg-black/50 blur-xl rounded-full transform scale-x-90"></div>
                </div>

                <p className="mt-8 text-[#565f89] text-xs font-mono text-center">
                    生成你的 RPG 角色卡带。<br/>
                    (3D View: Hover to Rotate)
                </p>
            </div>
        </div>

    </div>
  );
};

export default RetroGameCartridge;