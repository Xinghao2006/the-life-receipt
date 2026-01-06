import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Play, Pause, Disc, Volume2, BarChart2 } from 'lucide-react';

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

// Updated URLs: Removed '/download' segment for direct stream access to avoid 403/404 errors.
const SONG_DATABASE: Record<string, Song[]> = {
    'emo': [
        { title: "Sad Piano (Demo)", artist: "Ambient Core", duration: "02:15", url: "https://cdn.pixabay.com/audio/2022/03/24/audio_03d6d52627.mp3" },
        { title: "Rainy Days", artist: "Lofi Study", duration: "02:30", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
        { title: "Solitude", artist: "Unknown", duration: "03:10", url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3" },
    ],
    'coding': [
        { title: "Deep Focus", artist: "Synthwave", duration: "02:45", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_55a29929a6.mp3" },
        { title: "Cyberpunk City", artist: "Future World", duration: "03:20", url: "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58bd.mp3" },
        { title: "Flow State", artist: "Binary Beats", duration: "04:00", url: "https://cdn.pixabay.com/audio/2022/03/24/audio_824da57c25.mp3" },
    ],
    'happy': [
        { title: "Good Vibes", artist: "Summer Pop", duration: "02:10", url: "https://cdn.pixabay.com/audio/2022/05/05/audio_13b5c65d73.mp3" },
        { title: "Morning Sun", artist: "Acoustic", duration: "02:40", url: "https://cdn.pixabay.com/audio/2022/04/27/audio_65b34f71bc.mp3" },
        { title: "Dance Floor", artist: "Electronic", duration: "03:00", url: "https://cdn.pixabay.com/audio/2022/01/18/audio_c36e4f3c7e.mp3" },
    ],
    'chill': [
        { title: "Forest Walk", artist: "Nature Sounds", duration: "03:30", url: "https://cdn.pixabay.com/audio/2022/02/07/audio_6062f62b6b.mp3" },
        { title: "Coffee Shop", artist: "Jazz Vibes", duration: "02:50", url: "https://cdn.pixabay.com/audio/2022/03/25/audio_24564c7264.mp3" },
        { title: "Ocean Waves", artist: "Relaxation", duration: "04:15", url: "https://cdn.pixabay.com/audio/2022/03/09/audio_8f45a4a98e.mp3" },
    ],
    'retro': [
        { title: "80s Arcade", artist: "Retro Synth", duration: "02:25", url: "https://cdn.pixabay.com/audio/2022/03/15/audio_73223f0340.mp3" },
        { title: "Neon Nights", artist: "Vaporwave", duration: "03:10", url: "https://cdn.pixabay.com/audio/2022/01/26/audio_2d8b525164.mp3" },
        { title: "Cassette Tape", artist: "LoFi Hiphop", duration: "02:50", url: "https://cdn.pixabay.com/audio/2022/05/17/audio_3702e8633f.mp3" },
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

  useEffect(() => {
    // Cleanup audio on unmount
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
      
      // Stop current playback if switching moods
      if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
          setCurrentSongIndex(null);
      }

      // Simulate tape winding time
      setTimeout(() => {
          setGeneratedList(SONG_DATABASE[moodId]);
          setIsGenerating(false);
      }, 1500);
  };

  const getMoodConfig = () => MOODS.find(m => m.id === selectedMood) || MOODS[0];

  const handlePlaySong = async (index: number) => {
      if (!generatedList || !audioRef.current) return;

      const audio = audioRef.current;

      try {
          // Case 1: Clicked the same song that is currently active
          if (currentSongIndex === index) {
              if (isPlaying) {
                  audio.pause();
                  setIsPlaying(false);
              } else {
                  // Ensure we are ready to play
                  if (audio.readyState >= 2) {
                       await audio.play();
                       setIsPlaying(true);
                  } else {
                      // If somehow not ready, load first (unlikely if it was paused)
                      audio.load();
                      await audio.play();
                      setIsPlaying(true);
                  }
              }
              return;
          }

          // Case 2: Changing song
          setIsPlaying(false); // Update UI immediately to prevent playing state confusion
          
          const song = generatedList[index];
          audio.src = song.url;
          audio.load(); // Explicitly load the new source
          
          setCurrentSongIndex(index);
          
          // Small safety delay or just await play
          await audio.play();
          setIsPlaying(true);
          
      } catch (error: any) {
          // Handle specific AbortError (interrupted by new play request) silently
          if (error.name === 'AbortError') {
              console.log('Playback interrupted by new request');
              return;
          }
          
          console.error("Playback failed", error);
          
          // Only alert for actual errors, not interruptions
          if (error.name === 'NotSupportedError' || error.message.includes('no supported source')) {
              alert("无法播放音频：音频源不可用或格式不支持 (Source Error)");
          } else {
              // Optional: console log other errors but don't spam alert
          }
          
          setIsPlaying(false);
      }
  };

  const handleAudioEnded = () => {
      setIsPlaying(false);
      // Optional: Auto-play next song logic could go here
      if (generatedList && currentSongIndex !== null && currentSongIndex < generatedList.length - 1) {
          handlePlaySong(currentSongIndex + 1);
      }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 bg-gradient-to-br ${selectedMood ? getMoodConfig().color : 'from-stone-900 to-black'} text-white flex flex-col items-center py-10 px-4`}>
        
        {/* Hidden Audio Element with crossOrigin for potential visualizers later */}
        <audio 
            ref={audioRef} 
            onEnded={handleAudioEnded} 
            crossOrigin="anonymous"
            preload="auto"
        />

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
                    {/* Cassette Texture */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                    
                    {/* Screws */}
                    <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-stone-400 flex items-center justify-center"><div className="w-full h-[1px] bg-stone-600 rotate-45"></div></div>
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-stone-400 flex items-center justify-center"><div className="w-full h-[1px] bg-stone-600 rotate-12"></div></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-stone-400 flex items-center justify-center"><div className="w-full h-[1px] bg-stone-600 rotate-90"></div></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-stone-400 flex items-center justify-center"><div className="w-full h-[1px] bg-stone-600 rotate-0"></div></div>

                    {/* Label Area */}
                    <div className="absolute top-[10%] left-[5%] right-[5%] height-[60%] bg-white/90 rounded-sm transform -rotate-1 p-4 shadow-sm">
                         <div className="w-full h-8 border-b-2 border-red-500/50 mb-2 font-handwriting text-2xl text-black flex items-center justify-between">
                             <span>{selectedMood ? `${getMoodConfig().label} Mix` : 'Select a Mood...'}</span>
                             {isPlaying && <BarChart2 className="text-red-500 animate-pulse" size={20} />}
                         </div>
                         <div className="w-full h-4 border-b border-stone-300"></div>
                         <div className="w-full h-4 border-b border-stone-300 flex justify-end items-end">
                            {currentSongIndex !== null && generatedList && (
                                <span className="text-[10px] font-mono text-stone-500">
                                    Track 0{currentSongIndex + 1}
                                </span>
                            )}
                         </div>
                    </div>

                    {/* Window / Reels */}
                    <div className="absolute top-[45%] left-[15%] right-[15%] h-[35%] bg-black/80 rounded-full flex justify-between items-center px-4 border border-stone-600/50 backdrop-blur-sm">
                         {/* Left Reel */}
                         <div className={`w-12 h-12 rounded-full border-4 border-white/20 bg-transparent flex items-center justify-center ${isPlaying || isGenerating ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                             <div className="w-full h-full border-t-2 border-white/50 rounded-full"></div>
                         </div>
                         
                         {/* Tape Window */}
                         <div className="flex-1 h-8 bg-transparent mx-4 flex flex-col justify-center gap-1 opacity-50 overflow-hidden">
                             {/* Tape strip moving animation */}
                             <div className={`w-full h-[2px] bg-stone-500 ${isPlaying ? 'animate-pulse' : ''}`}></div>
                         </div>

                         {/* Right Reel */}
                         <div className={`w-12 h-12 rounded-full border-4 border-white/20 bg-transparent flex items-center justify-center ${isPlaying || isGenerating ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
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

                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <p className="text-[10px] text-white/40 mb-2">
                             * 音乐资源来自无版权库，国内直连播放 (Powered by HTML5 Audio)
                        </p>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default MoodMixtape;