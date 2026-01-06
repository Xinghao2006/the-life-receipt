import React, { useState } from 'react';
import { Sparkles, Mic, Pause, Headphones, Tv, Video, Mail, CassetteTape, Volume2, Camera, ArrowLeft, ArrowRight, Gamepad2, Smartphone } from 'lucide-react';

interface BlogProps {
  onOpenTool: (id: string) => void;
  isPlaying: boolean;
  togglePlay: () => void;
}

// Updated Tools List
const TOOLS = [
    {
        id: 'receipt',
        title: "The Life Receipt",
        subtitle: "人生收据",
        desc: "如果人生是一张超市小票，上面会打印什么？",
        icon: <Sparkles size={16} />,
        bgGradient: "from-stone-800 to-stone-900",
        accent: "text-indigo-400"
    },
    {
        id: 'mixtape',
        title: "Mood Mixtape",
        subtitle: "情绪磁带",
        desc: "将此刻的情绪刻录进 A/B 面。Lo-Fi 生活。",
        icon: <CassetteTape size={16} />,
        bgGradient: "from-[#451a03] to-[#78350f]",
        accent: "text-amber-400"
    },
    {
        id: 'polaroid',
        title: "Polaroid Lab",
        subtitle: "时光拍立得",
        desc: "定格瞬间。生成带有做旧效果和时间戳的拍立得。",
        icon: <Camera size={16} />,
        bgGradient: "from-stone-900 to-neutral-900",
        accent: "text-red-400"
    },
    {
        id: 'mixer',
        title: "8-Bit Ambiance",
        subtitle: "白噪音混音台",
        desc: "定制你的专注背景音。雨声、炉火与键盘声。",
        icon: <Volume2 size={16} />,
        bgGradient: "from-slate-900 to-slate-800",
        accent: "text-emerald-400"
    }
];

const Blog: React.FC<BlogProps> = ({ onOpenTool, isPlaying, togglePlay }) => {
  
  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-stone-200 flex flex-col">
      <style>{`
        /* Custom Scrollbar for the Carousel */
        .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f5f5f4; 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #d6d3d1; 
            border-radius: 4px;
            border: 2px solid #f5f5f4;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #a8a29e; 
        }
      `}</style>

      {/* Navigation - Fixed with Frosted Glass */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#fafaf9]/70 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif-title font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white shadow-sm">
                 <Mic size={14} />
            </div>
            <span>我的播客</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-500">
            <a href="#about" className="hover:text-stone-900 transition-colors">关于</a>
            <a href="#connect" className="hover:text-stone-900 transition-colors">联系</a>
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
                {isPlaying ? '正在播放' : '直播中'}
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
                    <span>{isPlaying ? '暂停音乐' : '开始收听'}</span>
                </button>
            </div>
        </header>

        {/* Horizontal Scroll Carousel Section */}
        <div className="mb-20">
            <div className="flex justify-between items-end mb-8">
                <h3 className="font-serif-title text-2xl font-bold text-stone-900">交互式工具</h3>
                {/* Scroll hint */}
                <span className="text-xs text-stone-400 uppercase tracking-widest hidden md:block">滑动探索 →</span>
            </div>

            {/* Scroll Container */}
            <div className="
                flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 
                snap-x snap-mandatory 
                custom-scrollbar
            ">
                
                {TOOLS.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={() => onOpenTool(tool.id)}
                        className={`
                            snap-center shrink-0 w-[85vw] sm:w-[320px] h-[380px] rounded-3xl cursor-pointer 
                            bg-gradient-to-br ${tool.bgGradient} text-white p-8 flex flex-col justify-between group
                            shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2
                            relative overflow-hidden
                        `}
                    >
                         {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex justify-between items-start z-10">
                            <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-md ${tool.accent}`}>
                                {tool.icon}
                            </div>
                        </div>

                        <div className="z-10">
                            <h2 className="font-serif-title text-3xl font-bold mb-2">{tool.title}</h2>
                            <h3 className={`text-lg font-medium mb-4 ${tool.accent}`}>{tool.subtitle}</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-6">
                                {tool.desc}
                            </p>
                            
                            <div className="flex items-center gap-2 text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                <span>打开应用</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>

        <div className="border-t border-stone-200 mb-16"></div>

        {/* Info & Connect Section */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Card */}
            <div className="bg-[#f5f5f4] rounded-2xl p-8 flex flex-col">
                <h4 className="font-serif-title text-lg font-bold mb-6">关于我</h4>
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
            <div id="connect" className="border border-stone-200 rounded-2xl p-8 flex flex-col">
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
                    </a>

                    {/* Douyin */}
                    <a 
                        href="https://www.douyin.com/user/MS4wLjABAAAAGnSEWak2bYGKQaRoiT1fQj5a0BrBD3XT_oMQFrkD9Rs?from_tab_name=main" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors duration-300">
                            <Smartphone size={18} />
                        </div>
                        <div>
                            <h5 className="font-bold text-stone-800 text-sm group-hover:text-black transition-colors">抖音</h5>
                            <p className="text-xs text-stone-400">关注日常</p>
                        </div>
                    </a>

                    {/* Email */}
                    <a 
                        href="mailto:X18143003659@163.com"
                        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                            <Mail size={18} />
                        </div>
                        <div>
                            <h5 className="font-bold text-stone-800 text-sm group-hover:text-orange-500 transition-colors">邮箱</h5>
                            <p className="text-xs text-stone-400">合作联系</p>
                        </div>
                    </a>

                </div>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-stone-100 py-12 border-t border-stone-200 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4">
            <div className="text-center">
                <div className="font-serif-title font-bold text-lg text-stone-900 mb-2">我的播客</div>
                <p className="text-stone-500 text-sm">© 2026 由 xinghao 开发</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;