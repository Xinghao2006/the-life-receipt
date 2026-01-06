import React from 'react';
import { ArrowRight, Sparkles, Mic } from 'lucide-react';

interface BlogProps {
  onOpenTool: () => void;
}

const Blog: React.FC<BlogProps> = ({ onOpenTool }) => {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-stone-200 flex flex-col">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#fafaf9]/80 backdrop-blur-sm z-40 border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif-title font-bold text-xl tracking-tight flex items-center gap-2">
            <Mic size={18} className="text-stone-400" />
            <span>My Podcast.</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center max-w-4xl mx-auto px-6 pt-32 pb-20 w-full">
        
        {/* Header / Intro */}
        <header className="mb-16">
          <h1 className="font-serif-title text-4xl sm:text-5xl font-medium leading-tight mb-6 text-stone-900">
            记录生活，<br/>
            以及那些编译通过的瞬间。
          </h1>
          <p className="text-stone-500 text-lg max-w-xl leading-relaxed">
            欢迎来到我的播客空间。这里没有复杂的算法，只有对生活的简单记录与思考。
          </p>
        </header>

        {/* Featured Tool Entry */}
        <section>
          <div 
            onClick={onOpenTool}
            className="group relative overflow-hidden bg-stone-900 rounded-2xl p-8 sm:p-12 text-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 text-blue-300 font-medium text-xs uppercase tracking-widest mb-2">
                  <Sparkles size={14} />
                  <span>Interactive Experience</span>
                </div>
                <h2 className="font-serif-title text-3xl font-medium mb-3">The Life Receipt</h2>
                <p className="text-stone-400 max-w-md">
                  一款极简美学的生成器。将你的年度经历、得失与回忆打印成一张带有复古条形码的超市收据。
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-stone-100 py-8 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-6 text-center sm:text-left text-stone-500 text-sm">
            <p>&copy; 2024 My Podcast.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;