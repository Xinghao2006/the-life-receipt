import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Play, Pause, Disc, Volume2, BarChart2, WifiOff } from 'lucide-react';

interface MoodMixtapeProps {
  onBack: () => void;
}

const MOODS = [
    { id: 'emo', label: '网抑云', emoji: '🌧️', color: 'from-blue-900 to-slate-900', tapeColor: '#1e293b' },
    { id: 'coding', label: '深夜编译', emoji: '☕', color: 'from-emerald-900 to-gray-900', tapeColor: '#064e3b' },
    { id: 'happy', label: '多巴胺', emoji: '✨', color: 'from-orange-500 to-pink-500', tapeColor: '#f97316' },
    { id: 'chill', label: '放空发呆', emoji: '🍃', color: 'from-stone-500 to-stone-700', tapeColor: '#78716c' },
    { id: 'retro', label: '千禧年', emoji: '📼', color: 'from-amber-700 to-red-900', tapeColor: '#92400e' }
];

interface Song {
    title: string;
    artist: string;
    duration: string;
    url: string;
}

// Replaced with SoundHelix (Global CDN) to guarantee access without CORS/Referer issues.
const SONG_DATABASE: Record<string, Song[]> = {
    'emo': [
        { title: "Rainy Mood", artist: "Nature", duration: "01:30", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
        { title: "Melancholy", artist: "Piano", duration: "02:15", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    ],
    'coding': [
        { title: "Cyber Pattern", artist: "Synth", duration: "02:45", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Logic Gate", artist: "Beats", duration: "03:20", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
    ],
    'happy': [
        { title: "Sunshine", artist: "Pop", duration: "02:10", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
        { title: "Groove", artist: "Funk", duration: "02:40", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
    ],
    'chill': [
        { title: "Lounge", artist: "Jazz", duration: "03:30", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
        { title: "Breeze", artist: "Acoustic", duration: "02:50", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
    ],
    'retro': [
        { title: "8-Bit Adventure", artist: "Chiptune", duration: "02:25", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
        { title: "Neon Drive", artist: "Synthwave", duration: "03:10", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    ]
};

const MoodMixtape: React.FC<MoodMixtapeProps> = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedList, setGeneratedList] = useState<Song[] | null>(null);
  
  // Audio State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    };
  }, []);

  const handleGenerate = (moodId: string) => {
      setSelectedMood(moodId);
      setIsGenerating(true);
      setGeneratedList(null);
      setErrorMsg(null);
      
      if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
          setCurrentSongIndex(null);
      }

      setTimeout(() => {
          setGeneratedList(SONG_DATABASE[moodId]);
          setIsGenerating(false);
      }, 1000);
  };

  const getMoodConfig = () => MOODS.find(m => m.id === selectedMood) || MOODS[0];

  const handlePlaySong = async (index: number) => {
      if (!generatedList || !audioRef.current) return;
      setErrorMsg(null);

      const audio = audioRef.current;

      try {
          if (currentSongIndex === index) {
              if (isPlaying) {
                  audio.pause();
                  setIsPlaying(false);
              } else {
                  try {
                    await audio.play();
                    setIsPlaying(true);
                  } catch (e: any) {
                    if (e.name === 'AbortError') {
                        // Playback was interrupted (e.g. by pause or load), this is expected.
                        return;
                    }
                    throw e;
                  }
              }
              return;
          }

          setIsPlaying(false);
          setCurrentSongIndex(index);
          
          audio.src = generatedList[index].url;
          audio.load();
          
          const playPromise = audio.play();
          if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(error => {
                    if (error.name === 'AbortError') return; // Ignore aborts
                    console.error("Playback Error:", error);
                    setIsPlaying(false);
                    setErrorMsg("播放失败，请检查网络或音频源。");
                });
          }
          
      } catch (error: any) {
          if (error.name === 'AbortError') return;
          console.error("General Error:", error);
          setErrorMsg("未知错误，请重试。");
      }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 bg-gradient-to-br ${selectedMood ? getMoodConfig().color : 'from-stone-900 to-black'} text-white flex flex-col items-center py-10 px-4`}>
        
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onError={(e) => {
            // Only report error if we are actually trying to play a song (index is not null)
            // This prevents errors when unmounting or resetting src
            if (currentSongIndex !== null) {
                console.error("Audio Error Event:", e);
                setIsPlaying(false);
                setErrorMsg("音频加载失败 (Network Error)");
            }
        }} />

        {/* Nav */}
        <div className="w-full max-w-2xl flex justify-between items-center mb-10">
            <button 
                onClick={() => {
                    if (audioRef.current) audioRef.current.pause();
                    onBack();
                }}
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
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                    
                    {/* Simplified Cassette UI for brevity */}
                    <div className="absolute top-[10%] left-[5%] right-[5%] height-[60%] bg-white/90 rounded-sm transform -rotate-1 p-4 shadow-sm">
                         <div className="w-full h-8 border-b-2 border-red-500/50 mb-2 font-handwriting text-2xl text-black flex items-center justify-between">
                             <span>{selectedMood ? `${getMoodConfig().label} Mix` : 'Select a Mood...'}</span>
                             {isPlaying && <BarChart2 className="text-red-500 animate-pulse" size={20} />}
                         </div>
                         <div className="text-black/50 text-xs font-mono mt-1">
                             {currentSongIndex !== null && generatedList ? `NOW PLAYING: ${generatedList[currentSongIndex].title}` : 'READY TO PLAY'}
                         </div>
                    </div>

                    <div className="absolute top-[45%] left-[15%] right-[15%] h-[35%] bg-black/80 rounded-full flex justify-between items-center px-4 border border-stone-600/50 backdrop-blur-sm">
                         <div className={`w-12 h-12 rounded-full border-4 border-white/20 bg-transparent flex items-center justify-center ${isPlaying || isGenerating ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                             <div className="w-full h-full border-t-2 border-white/50 rounded-full"></div>
                         </div>
                         <div className={`w-12 h-12 rounded-full border-4 border-white/20 bg-transparent flex items-center justify-center ${isPlaying || isGenerating ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                             <div className="w-full h-full border-t-2 border-white/50 rounded-full"></div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-sm text-red-200 animate-fade-in">
                    <WifiOff size={16} />
                    {errorMsg}
                </div>
            )}

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
                    <p className="text-sm font-mono text-white/70">Loading Cassette...</p>
                </div>
            )}

            {/* Generated Playlist */}
            {generatedList && (
                <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-md border border-white/10 animate-fade-in">
                    <div className="space-y-4">
                        {generatedList.map((song, idx) => (
                            <div 
                                key={idx} 
                                className={`
                                    flex items-center justify-between group p-3 rounded-lg transition-colors cursor-pointer border border-transparent
                                    ${currentSongIndex === idx ? 'bg-white/10 border-white/20' : 'hover:bg-white/5'}
                                `}
                                onClick={() => handlePlaySong(idx)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-white/30 font-mono text-sm">
                                        {currentSongIndex === idx && isPlaying ? <Volume2 size={14} className="animate-pulse text-amber-400" /> : `0${idx + 1}`}
                                    </div>
                                    <div>
                                        <div className={`font-medium text-sm transition-colors ${currentSongIndex === idx ? 'text-amber-300' : 'text-white'}`}>
                                            {song.title}
                                        </div>
                                        <div className="text-xs text-white/50">{song.artist}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-white/30">{song.duration}</span>
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                                        ${currentSongIndex === idx && isPlaying ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/50 group-hover:bg-white group-hover:text-black'}
                                    `}>
                                        {currentSongIndex === idx && isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="mt-4 pt-4 border-t border-white/10 text-center text-[10px] text-white/30">
                        * 已替换为SoundHelix公开测试音源以解决防盗链问题。
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default MoodMixtape;