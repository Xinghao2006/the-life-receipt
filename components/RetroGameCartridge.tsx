import React, { useState } from 'react';
import { ArrowLeft, Gamepad2, Rocket, Share2 } from 'lucide-react';

interface RetroGameCartridgeProps {
  onBack: () => void;
}

const GENRES = [
    { id: 'rpg', label: 'RPG', color: 'bg-emerald-700' },
    { id: 'action', label: 'ACT', color: 'bg-red-700' },
    { id: 'sim', label: 'SIM', color: 'bg-pink-600' },
    { id: 'puzzle', label: 'PZL', color: 'bg-blue-600' },
];

const RetroGameCartridge: React.FC<RetroGameCartridgeProps> = ({ onBack }) => {
  const [title, setTitle] = useState('25岁的生存游戏');
  const [genre, setGenre] = useState('rpg');
  const [time, setTime] = useState('25 Years');
  const [isGenerated, setIsGenerated] = useState(false);

  const getGenreColor = () => GENRES.find(g => g.id === genre)?.color || 'bg-gray-700';
  const getGenreLabel = () => GENRES.find(g => g.id === genre)?.label || 'GAME';

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center py-10 px-4">
        
        {/* Nav */}
        <div className="w-full max-w-2xl flex justify-between items-center mb-12">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">返回</span>
            </button>
            <h1 className="font-serif-title text-xl font-bold tracking-widest opacity-80 flex items-center gap-2">
                <Gamepad2 size={24} /> RETRO LAB
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl items-center">
            
            {/* Input Form */}
            <div className="space-y-6 order-2 md:order-1">
                 <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-1">游戏标题 (Game Title)</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={20}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">类型 (Genre)</label>
                            <div className="flex gap-2">
                                {GENRES.map(g => (
                                    <button
                                        key={g.id}
                                        onClick={() => setGenre(g.id)}
                                        className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold transition-all ${genre === g.id ? 'bg-white text-black scale-110' : 'bg-slate-700 text-slate-400'}`}
                                    >
                                        {g.label.substring(0,1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">通关耗时 (Play Time)</label>
                            <input 
                                type="text" 
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none font-mono"
                            />
                        </div>
                    </div>
                 </div>

                 <div className="text-xs text-slate-500 text-center leading-relaxed">
                    * 生成一张属于你当前人生阶段的游戏卡带。<br/>
                    或许难度是 Hard 模式，但请享受过程。
                 </div>
            </div>

            {/* 3D Visualizer */}
            <div className="order-1 md:order-2 flex justify-center perspective-1000 py-10">
                <div 
                    className="relative group w-64 h-72 transform-style-3d transition-transform duration-500 rotate-x-12 hover:rotate-x-0 hover:rotate-y-12"
                    style={{
                        transform: 'perspective(1000px) rotateX(20deg) rotateY(-10deg)',
                    }}
                >
                    {/* Cartridge Body - Front */}
                    <div className="absolute inset-0 bg-stone-200 rounded-t-lg shadow-2xl overflow-hidden border-b-8 border-stone-300">
                        {/* Grip Lines */}
                        <div className="absolute top-0 left-0 right-0 h-4 bg-stone-300"></div>
                        
                        {/* Sticker Area */}
                        <div className="absolute top-8 left-4 right-4 bottom-12 bg-black rounded-sm p-1 shadow-inner">
                            <div className={`w-full h-full ${getGenreColor()} relative overflow-hidden flex flex-col items-center justify-center text-center p-2`}>
                                {/* Sticker Texture */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30 mix-blend-overlay"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20"></div>

                                {/* Header */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    <div className="w-8 h-4 bg-white/90 transform -skew-x-12"></div>
                                    <div className="w-2 h-4 bg-red-500/90 transform -skew-x-12"></div>
                                </div>
                                <div className="absolute top-2 right-2 text-[10px] font-black text-white/80 tracking-tighter border border-white/50 px-1 rounded">
                                    {getGenreLabel()}
                                </div>

                                {/* Title */}
                                <h2 className="relative z-10 font-black text-2xl text-white drop-shadow-md uppercase leading-tight font-sans tracking-tight break-words max-w-full">
                                    {title}
                                </h2>

                                {/* Footer Graphic */}
                                <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent z-0"></div>
                                <div className="absolute bottom-2 font-mono text-[8px] text-white/70">
                                    PLAY TIME: {time}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Grip */}
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-stone-300 flex items-center justify-center gap-1">
                             {[1,2,3,4,5,6].map(i => (
                                 <div key={i} className="w-1 h-6 bg-stone-400 rounded-full"></div>
                             ))}
                        </div>
                    </div>

                    {/* Cartridge Depth (Fake 3D Side) */}
                    <div className="absolute top-0 right-0 w-8 h-full bg-stone-400 origin-left transform rotate-y-90 translate-x-full rounded-tr-lg"></div>
                    <div className="absolute top-0 left-0 w-full h-8 bg-stone-100 origin-bottom transform rotate-x-90 -translate-y-full rounded-t-lg"></div>
                    
                    {/* Shadow */}
                    <div className="absolute -bottom-10 left-0 right-0 h-10 bg-black/40 blur-xl transform scale-x-110"></div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default RetroGameCartridge;