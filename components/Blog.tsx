import React, { useRef } from 'react';
import { ArrowRight, Sparkles, Mic, Play, Pause, Headphones, Tv, Video, Mail, CassetteTape, Clapperboard, Film } from 'lucide-react';

interface BlogProps {
  onOpenTool: (id: string) => void;
  isPlaying: boolean;
  togglePlay: () => void;
}

const TOOLS = [
    {
        id: 'receipt',
        title: "The Life Receipt",
        subtitle: "人生收据生成器",
        desc: "如果人生是一张超市小票，上面会打印什么？生成你的年度经历收据。",
        icon: <Sparkles size={10} />,
        arrowIcon: <ArrowRight size={18} />,
        theme: {
            bg: "bg-stone-900",
            accent: "bg-indigo-500",
            textAccent: "text-indigo-300",
            hoverText: "group-hover:to-indigo-200",
            decoration: "decoration-indigo-500/50",
            orb1: "from-indigo-500 via-purple-500 to-pink-500",
            orb2: "bg-blue-500"
        }
    },
    {
        id: 'mixtape',
        title: "Mood Mixtape",
        subtitle: "情绪磁带生成器",
        desc: "将此刻的情绪刻录进 A/B 面。生活是一首循环播放的 Lo-Fi。",
        icon: <CassetteTape size={10} />,
        arrowIcon: <ArrowRight size={18} />,
        theme: {
            bg: "bg-[#451a03]", // Amber 950ish / Dark Brown
            accent: "bg-amber-500",
            textAccent: "text-amber-300",
            hoverText: "group-hover:to-amber-200",
            decoration: "decoration-amber-500/50",
            orb1: "from-amber-500 via-orange-500 to-yellow-500",
            orb2: "bg-yellow-600"
        },
        disabled: false
    },
    {
        id: 'cinema',
        title: "Time Cinema",
        subtitle: "时光电影院",
        desc: "Coming Soon. 凭票入场。重映那些从未褪色的记忆片段，仅限今夜放映。",
        icon: <Clapperboard size={10} />,
        arrowIcon: <Film size={18} />,
        theme: {
            bg: "bg-[#881337]", // Rose 900
            accent: "bg-rose-500",
            textAccent: "text-rose-300",
            hoverText: "group-hover:to-rose-200",
            decoration: "decoration-rose-500/50",
            orb1: "from-rose-500 via-red-500 to-pink-500",
            orb2: "bg-red-800"
        },
        disabled: true
    }
];

const Blog: React.FC<BlogProps> = ({ onOpenTool, isPlaying, togglePlay }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-stone-200 flex flex-col">
      
      {/* Navigation - Frosted Glass Effect Enhanced */}
      <nav className="fixed top-0 w-full bg-[#fafaf9]/70 backdrop-blur-md z-40 border-b border-stone-100/50 transition-all duration-300 supports-[backdrop-filter]:bg-[#fafaf9]/60">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif-title font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white shadow-sm">
                 <Mic size={14} />
            </div>
            <span>My Podcast.</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-500">
            <a href="#" className="hover:text-stone-900 transition-colors">About</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Connect</a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 pt-32 pb-20 overflow-hidden">
        
        {/* Header Section */}
        <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 ${isPlaying ? 'animate-ping' : ''}`}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                {isPlaying ? 'Now Playing' : 'On Air'}
            </div>
            <h1 className="font-serif-title text-5xl sm:text-6xl font-medium leading-tight mb-6 text-stone-900">
              记录生活，<br/>
              以及那些<span className="italic font-serif text-stone-400">编译通过</span>的瞬间。
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed mb-8 max-w-md">
              这里是我的数字花园与播客空间。没有复杂的算法，只有关于技术、生活与极简主义的音频笔记。
            </p>
            <div className="flex gap-4">
                <button 
                    onClick={togglePlay}
                    className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full hover:bg-stone-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-stone-900/20"
                >
                    {isPlaying ? <Pause size={18} /> : <Headphones size={18} />}
                    <span>{isPlaying ? 'Pause Music' : 'Start Listening'}</span>
                </button>
            </div>
        </header>

        {/* Carousel Section */}
        <div className="mb-20">
            <div className="flex justify-between items-end mb-6">
                <h3 className="font-serif-title text-2xl font-bold text-stone-900">Interactive Tools</h3>
                <div className="flex gap-2">
                    {/* Visual indicators for scrolling if needed, but native scrollbar is hidden */}
                </div>
            </div>

            {/* Scroll Container */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar -mx-6 px-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {TOOLS.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={() => !tool.disabled && onOpenTool(tool.id)}
                        className={`
                            relative flex-shrink-0 w-[85vw] md:w-[400px] snap-center
                            group overflow-hidden rounded-3xl p-8 text-white transition-all duration-500 
                            ${tool.disabled ? 'cursor-not-allowed opacity-80 grayscale-[0.3]' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2'}
                            ${tool.theme.bg}
                        `}
                    >
                         {/* Abstract Background Art */}
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${tool.theme.orb1}`}></div>
                        <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity ${tool.theme.orb2}`}></div>
                        
                        <div className="relative z-10 h-full flex flex-col justify-between min-h-[260px]">
                            <div className="flex justify-between items-start">
                                <div className={`flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest border px-2 py-1 rounded-full backdrop-blur-md ${tool.theme.textAccent} border-${tool.theme.textAccent}/30 bg-white/5`}>
                                    {tool.icon}
                                    <span>{tool.disabled ? 'Coming Soon' : 'Interactive Tool'}</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    {tool.arrowIcon}
                                </div>
                            </div>

                            <div>
                                <h2 className={`font-serif-title text-3xl font-medium mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white ${tool.theme.hoverText} transition-all`}>
                                    {tool.title}
                                </h2>
                                <div className={`w-12 h-1 mb-4 rounded-full ${tool.theme.accent}`}></div>
                                <h3 className="text-white/80 font-medium text-sm mb-2">{tool.subtitle}</h3>
                                <p className="text-stone-400 text-xs leading-relaxed max-w-xs mb-4">
                                    {tool.desc}
                                </p>
                                {!tool.disabled && (
                                    <span className={`text-xs font-mono ${tool.theme.textAccent} group-hover:underline ${tool.theme.decoration} underline-offset-4`}>
                                        Click to generate →
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="border-t border-stone-200 mb-16"></div>

        {/* Info & Connect Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* About Card */}
            <div className="bg-[#f5f5f4] rounded-2xl p-8 flex flex-col">
                <h4 className="font-serif-title text-lg font-bold mb-6">关于主播</h4>
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-stone-300 overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                         <p className="text-stone-600 text-sm leading-relaxed">
                            构建数字工具，探讨代码、设计与生活的交汇点。<br/>
                            喜欢在深夜写代码，在清晨喝咖啡。
                        </p>
                    </div>
                </div>
               
                <div className="mt-auto pt-4">
                    <a href="#" className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-0.5 hover:opacity-70">
                        更多关于我
                    </a>
                </div>
            </div>

            {/* Connect / Social Links */}
            <div className="border border-stone-200 rounded-2xl p-8 flex flex-col">
                <h4 className="font-serif-title text-lg font-bold mb-6">找到我 (Connect)</h4>
                <div className="space-y-3 flex-grow">
                    
                    {/* Bilibili */}
                    <a 
                        href="https://space.bilibili.com/271852283?spm_id_from=333.788.0.0" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 group-hover:bg-[#00AEEC] group-hover:text-white flex items-center justify-center transition-colors duration-300">
                            <Tv size={18} />
                        </div>
                        <div>
                            <h5 className="font-bold text-stone-800 text-sm group-hover:text-[#00AEEC] transition-colors">Bilibili</h5>
                            <p className="text-xs text-stone-400">观看视频</p>
                        </div>
                        <ArrowRight size={14} className="ml-auto text-stone-300 group-hover:text-[#00AEEC] transition-colors" />
                    </a>

                    {/* Douyin */}
                    <a 
                        href="https://www.douyin.com/user/MS4wLjABAAAAGnSEWak2bYGKQaRoiT1fQj5a0BrBD3XT_oMQFrkD9Rs?from_tab_name=main" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors duration-300">
                            <Video size={18} />
                        </div>
                        <div>
                            <h5 className="font-bold text-stone-800 text-sm group-hover:text-black transition-colors">Douyin</h5>
                            <p className="text-xs text-stone-400">短视频日常</p>
                        </div>
                            <ArrowRight size={14} className="ml-auto text-stone-300 group-hover:text-black transition-colors" />
                    </a>

                    {/* Email */}
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white border border-stone-100 shadow-sm group">
                        <div className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 flex items-center justify-center">
                            <Mail size={18} />
                        </div>
                        <div className="overflow-hidden">
                            <h5 className="font-bold text-stone-800 text-sm">Email</h5>
                            <p className="text-xs text-stone-500 truncate select-all">X18143003659@163.com</p>
                        </div>
                    </div>

                </div>
            </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-stone-100 py-12 border-t border-stone-200 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4">
            <div className="text-center">
                <div className="font-serif-title font-bold text-lg text-stone-900 mb-2">My Podcast.</div>
                <p className="text-stone-500 text-sm">© 2026 Built by xinghao.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;