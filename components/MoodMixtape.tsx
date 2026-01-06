import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Play, ExternalLink, Disc, Music } from 'lucide-react';

interface MoodMixtapeProps {
  onBack: () => void;
}

// Mock Data for "China Friendly" Music (Linking to Netease Cloud Music / Bilibili)
// We use generic search links or specific ID links where stable.
// Search is safer to avoid dead links.
const MOODS = [
    { id: 'emo', label: '网抑云', emoji: '🌧️', color: 'from-blue-900 to-slate-900', tapeColor: '#1e293b' },
    { id: 'coding', label: '深夜编译', emoji: '☕', color: 'from-emerald-900 to-gray-900', tapeColor: '#064e3b' },
    { id: 'happy', label: '多巴胺', emoji: '✨', color: 'from-orange-500 to-pink-500', tapeColor: '#f97316' },
    { id: 'chill', label: '放空发呆', emoji: '🍃', color: 'from-stone-500 to-stone-700', tapeColor: '#78716c' },
    { id: 'retro', label: '千禧年', emoji: '📼', color: 'from-amber-700 to-red-900', tapeColor: '#92400e' }
];

const SONG_DATABASE: Record<string, { title: string; artist: string; duration: string }[]> = {
    'emo': [
        { title: "海底", artist: "一支榴莲", duration: "04:15" },
        { title: "水星记", artist: "郭顶", duration: "05:25" },
        { title: "富士山下", artist: "陈奕迅", duration: "04:19" },
        { title: "大眠", artist: "王心凌", duration: "03:55" }
    ],
    'coding': [
        { title: "Cornfield Chase", artist: "Hans Zimmer", duration: "02:06" },
        { title: "Experience", artist: "Ludovico Einaudi", duration: "05:15" },
        { title: "Time", artist: "Hans Zimmer", duration: "04:35" },
        { title: "Intro", artist: "The xx", duration: "02:07" }
    ],
    'happy': [
        { title: "New Boy", artist: "朴树", duration: "03:52" },
        { title: "日不落", artist: "蔡依林", duration: "03:42" },
        { title: "爱你", artist: "王心凌", duration: "03:36" },
        { title: "阳光宅男", artist: "周杰伦", duration: "03:42" }
    ],
    'chill': [
        { title: "Summer", artist: "久石让", duration: "06:23" },
        { title: "Last Dance", artist: "伍佰 & China Blue", duration: "04:31" },
        { title: "萱草花", artist: "张小斐", duration: "03:45" },
        { title: "夏天的风", artist: "温岚", duration: "03:56" }
    ],
    'retro': [
        { title: "反方向的钟", artist: "周杰伦", duration: "04:19" },
        { title: "Last Christmas", artist: "Wham!", duration: "04:24" },
        { title: "Billie Jean", artist: "Michael Jackson", duration: "04:54" },
        { title: "Monica", artist: "张国荣", duration: "03:56" }
    ]
};

const MoodMixtape: React.FC<MoodMixtapeProps> = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedList, setGeneratedList] = useState<{ title: string; artist: string; duration: string }[] | null>(null);

  const handleGenerate = (moodId: string) => {
      setSelectedMood(moodId);
      setIsGenerating(true);
      setGeneratedList(null);

      // Simulate tape winding time
      setTimeout(() => {
          setGeneratedList(SONG_DATABASE[moodId]);
          setIsGenerating(false);
      }, 1500);
  };

  const getMoodConfig = () => MOODS.find(m => m.id === selectedMood) || MOODS[0];

  const handlePlaySong = (song: string, artist: string) => {
      // Direct search on Netease Cloud Music (Web) - Works in China
      const query = `${song} ${artist}`;
      window.open(`https://music.163.com/#/search/m/?s=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 bg-gradient-to-br ${selectedMood ? getMoodConfig().color : 'from-stone-900 to-black'} text-white flex flex-col items-center py-10 px-4`}>
        
        {/* Nav */}
        <div className="w-full max-w-2xl flex justify-between items-center mb-10">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">返回</span>
            </button>
            <h1 className="font-serif-title text-xl font-bold tracking-widest opacity-80">MOOD MIXTAPE</h1>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-md flex flex-col gap-8">
            
            {/* Cassette Visual */}
            <div className="relative group perspective-1000">
                <div 
                    className={`
                        w-full aspect-[1.6] rounded-xl shadow-2xl relative overflow-hidden border-2 border-white/10 transition-all duration-700
                        ${isGenerating ? 'animate-pulse' : ''}
                    `}
                    style={{ 
                        backgroundColor: selectedMood ? getMoodConfig().tapeColor : '#333',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Cassette Texture */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                    
                    {/* Screws */}
                    <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-stone-400 flex items-center justify-center"><div className="w-full h-[1px] bg-stone-600 rotate-45"></div></div>
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-stone-400 flex items-center justify-center"><div className="w-full h-[1px] bg-stone-600 rotate-12"></div></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-stone-400 flex items-center justify-center"><div className="w-full h-[1px] bg-stone-600 rotate-90"></div></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-stone-400 flex items-center justify-center"><div className="w-full h-[1px] bg-stone-600 rotate-0"></div></div>

                    {/* Label Area */}
                    <div className="absolute top-[10%] left-[5%] right-[5%] height-[60%] bg-white/90 rounded-sm transform -rotate-1 p-4 shadow-sm">
                         <div className="w-full h-8 border-b-2 border-red-500/50 mb-2 font-handwriting text-2xl text-black flex items-center">
                             {selectedMood ? `${getMoodConfig().label} Mix` : 'Select a Mood...'}
                         </div>
                         <div className="w-full h-4 border-b border-stone-300"></div>
                         <div className="w-full h-4 border-b border-stone-300"></div>
                    </div>

                    {/* Window / Reels */}
                    <div className="absolute top-[45%] left-[15%] right-[15%] h-[35%] bg-black/80 rounded-full flex justify-between items-center px-4 border border-stone-600/50 backdrop-blur-sm">
                         {/* Left Reel */}
                         <div className={`w-12 h-12 rounded-full border-4 border-white/20 bg-transparent flex items-center justify-center ${isGenerating ? 'animate-spin' : ''}`}>
                             <div className="w-full h-full border-t-2 border-white/50 rounded-full"></div>
                         </div>
                         
                         {/* Tape Window */}
                         <div className="flex-1 h-8 bg-transparent mx-4 flex flex-col justify-center gap-1 opacity-50">
                             <div className="w-full h-[1px] bg-stone-500"></div>
                             <div className="w-full h-[1px] bg-stone-500"></div>
                         </div>

                         {/* Right Reel */}
                         <div className={`w-12 h-12 rounded-full border-4 border-white/20 bg-transparent flex items-center justify-center ${isGenerating ? 'animate-spin' : ''}`}>
                             <div className="w-full h-full border-t-2 border-white/50 rounded-full"></div>
                         </div>
                    </div>

                     {/* Bottom Text */}
                    <div className="absolute bottom-4 w-full text-center text-[10px] font-mono tracking-widest text-white/50 uppercase">
                        High Bias 70μs EQ
                    </div>
                </div>
            </div>

            {/* Controls */}
            {!generatedList && !isGenerating && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                    {MOODS.map(mood => (
                        <button
                            key={mood.id}
                            onClick={() => handleGenerate(mood.id)}
                            className={`
                                py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all
                                flex flex-col items-center gap-2 hover:scale-105 active:scale-95
                                ${selectedMood === mood.id ? 'ring-2 ring-white bg-white/20' : ''}
                            `}
                        >
                            <span className="text-2xl">{mood.emoji}</span>
                            <span className="text-xs font-bold">{mood.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {isGenerating && (
                <div className="text-center space-y-2 py-8 animate-pulse">
                    <RefreshCw className="w-8 h-8 mx-auto animate-spin text-white/50" />
                    <p className="text-sm font-mono text-white/70">Recording Side A...</p>
                </div>
            )}

            {/* Generated Playlist */}
            {generatedList && (
                <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-md border border-white/10 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Disc size={18} />
                            Side A
                        </h3>
                        <button onClick={() => setGeneratedList(null)} className="text-xs text-white/50 hover:text-white underline">
                            Eject & Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        {generatedList.map((song, idx) => (
                            <div 
                                key={idx} 
                                className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => handlePlaySong(song.title, song.artist)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-white/30 font-mono text-sm">0{idx + 1}</div>
                                    <div>
                                        <div className="font-medium text-sm group-hover:text-amber-300 transition-colors">{song.title}</div>
                                        <div className="text-xs text-white/50">{song.artist}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-white/30">{song.duration}</span>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                        <Play size={12} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <p className="text-[10px] text-white/40 mb-2">
                             * 点击播放将跳转至网易云音乐搜索页 (Mainland China Friendly)
                        </p>
                        <button className="w-full py-3 bg-white text-black font-bold rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <ExternalLink size={14} />
                            分享这张磁带
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default MoodMixtape;