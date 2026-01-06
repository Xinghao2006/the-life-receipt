import React, { useState, useEffect, useRef } from 'react';
import ReceiptPaper from './components/ReceiptPaper';
import Polaroid from './components/Polaroid';
import Editor from './components/Editor';
import { generatePolaroidStory } from './services/geminiService';
import { ReceiptData, PolaroidData } from './types';
import { Edit2, Share2, Printer, ExternalLink } from 'lucide-react';

const DEFAULT_RECEIPT: ReceiptData = {
  dateRange: "2006.02.09 - 2026.02.09",
  cashier: "教务系统",
  items: [
    { qty: 1, name: "Hello World", price: "梦开始的地方" },
    { qty: 1024, name: "写代码", price: "发际线后移" },
    { qty: 1, name: "高等数学", price: "低空飘过" },
    { qty: 404, name: "找对象", price: "Not Found" },
    { qty: 365, name: "早八", price: "困意" },
    { qty: 100, name: "冰美式", price: "续命水" }
  ],
  totalLabel: "当前状态",
  totalValue: "正在编译...",
  taxLabel: "额外支出",
  taxValue: "颈椎康复费",
  hiddenStory: "只有在编译通过的那一刻，世界才是美好的。",
  hiddenImage: "https://images.pexels.com/photos/57980/pexels-photo-57980.jpeg?auto=compress&cs=tinysrgb&w=600"
};

// Helper for Unicode-safe Base64 Encoding
const toBase64 = (str: string) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode(parseInt(p1, 16)))
  );
};

// Helper for Unicode-safe Base64 Decoding with robustness fixes
const fromBase64 = (str: string) => {
  try {
    // Fix for URLSearchParams potentially decoding '+' as space
    let safeStr = str.replace(/ /g, '+');
    // Ensure padding is correct
    while (safeStr.length % 4) {
      safeStr += '=';
    }
    return decodeURIComponent(atob(safeStr).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    throw new Error("Invalid config string");
  }
};

const App: React.FC = () => {
  const [receiptData, setReceiptData] = useState<ReceiptData>(DEFAULT_RECEIPT);
  const [polaroidData, setPolaroidData] = useState<PolaroidData | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isWeChat, setIsWeChat] = useState(false);

  // Load from URL Hash (Priority) or Search (Legacy) on mount
  useEffect(() => {
    // 1. Detect WeChat environment
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)) {
      setIsWeChat(true);
    }

    // 2. Load State
    const handleStateLoad = () => {
      try {
        let configStr = "";
        let isLegacyQuery = false;

        // Try Hash (Preferred)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        if (hashParams.has('config')) {
            configStr = hashParams.get('config') || "";
        } 
        // Try Query Params (Legacy / Fallback)
        else {
            const searchParams = new URLSearchParams(window.location.search);
            if (searchParams.has('config')) {
                configStr = searchParams.get('config') || "";
                isLegacyQuery = true;
            }
        }
        
        if (configStr) {
            const decoded = JSON.parse(fromBase64(configStr));
            setReceiptData(decoded);
            setIsPrinting(true);
            setTimeout(() => setIsPrinting(false), 1600);

            // If we loaded from legacy query params, migrate to hash immediately to fix the URL
            if (isLegacyQuery && window.location.protocol !== 'blob:') {
                try {
                  const url = new URL(window.location.href);
                  url.search = ""; // Remove query params
                  url.hash = `config=${encodeURIComponent(configStr)}`;
                  window.history.replaceState(null, '', url.toString());
                } catch (err) {
                  console.error("Failed to migrate URL:", err);
                }
            }
        }
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    };

    handleStateLoad();

    // Listen for hash changes
    window.addEventListener('hashchange', handleStateLoad);
    return () => window.removeEventListener('hashchange', handleStateLoad);
  }, []);

  const handleBarcodeClick = async () => {
    // If user customized hidden story, use it
    if (receiptData.hiddenStory && receiptData.hiddenImage) {
        const rotation = (Math.random() * 6) - 3;
        setPolaroidData({
            imageUrl: receiptData.hiddenImage,
            date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
            story: receiptData.hiddenStory,
            rotation
        });
        return;
    }

    // Fallback to auto-generation
    const randomItem = receiptData.items[Math.floor(Math.random() * receiptData.items.length)];
    const story = await generatePolaroidStory(randomItem.name);
    const rotation = (Math.random() * 6) - 3; 
    setPolaroidData({
      imageUrl: DEFAULT_RECEIPT.hiddenImage || "",
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
      story: story,
      rotation
    });
  };

  const handleSave = async () => {
      try {
        // 1. Serialize data
        const jsonString = JSON.stringify(receiptData);
        // 2. Base64 Encode (Unicode safe)
        const encoded = toBase64(jsonString);
        // 3. URL Encode (to protect +, /, = characters)
        const urlSafeEncoded = encodeURIComponent(encoded);
        const hashString = `config=${urlSafeEncoded}`;
        
        // 4. Update Browser URL safely
        if (window.location.protocol === 'blob:') {
            window.location.hash = hashString;
            await navigator.clipboard.writeText(window.location.href);
        } else {
            const url = new URL(window.location.href);
            url.search = ""; 
            url.hash = hashString;
            const cleanUrl = url.toString();
            window.history.pushState(null, '', cleanUrl);
            await navigator.clipboard.writeText(cleanUrl);
        }
        
        setShowShareToast(true);
      } catch (err) {
        console.error("Share failed", err);
        try {
            window.location.hash = `config=${encodeURIComponent(toBase64(JSON.stringify(receiptData)))}`;
        } catch(e) {}
        setShowShareToast(true); 
      }

      setTimeout(() => setShowShareToast(false), 3000);
      setIsEditorOpen(false);
      
      // Re-trigger print animation
      setIsPrinting(true);
      setTimeout(() => setIsPrinting(false), 1600);
  };

  return (
    <div 
      className="h-[100dvh] w-screen relative flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #00416A, #E4E5E6)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center transform scale-[0.85] sm:scale-100 origin-center transition-transform duration-300">
        <div className="w-[340px] h-2 bg-gray-800/50 rounded-full mb-[-2px] blur-[1px] relative z-20"></div>
        <div className="relative w-full perspective-1000">
             <ReceiptPaper 
                data={receiptData} 
                onBarcodeClick={handleBarcodeClick} 
                isPrinting={isPrinting}
             />
        </div>
      </div>

      {/* Controls UI (Floating) */}
      <div className="absolute bottom-8 right-6 flex flex-col gap-4 z-40">
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="w-12 h-12 bg-white text-black rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          title="定制内容"
        >
          <Edit2 size={20} />
        </button>
        <button 
            onClick={handleSave}
            className="w-12 h-12 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            title="复制分享链接"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Toast Notification */}
      <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-2 rounded-full backdrop-blur transition-all duration-300 z-50 ${showShareToast ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <p className="text-sm font-medium">链接已复制！快去分享吧。</p>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <Editor 
            data={receiptData} 
            onChange={setReceiptData} 
            onClose={() => setIsEditorOpen(false)} 
            onSave={handleSave}
        />
      )}

      {/* Polaroid Modal */}
      {polaroidData && (
        <Polaroid 
            data={polaroidData} 
            onClose={() => setPolaroidData(null)} 
        />
      )}

      {/* WeChat Guide Overlay */}
      {isWeChat && (
        <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center pt-8 px-8 text-white animate-fade-in"
            onClick={() => setIsWeChat(false)}
        >
            <div className="w-full flex justify-end mb-4">
               {/* Curved Arrow pointing to top right */}
               <svg width="80" height="80" viewBox="0 0 100 100" className="text-white transform rotate-12 animate-bounce">
                  <path d="M10,50 Q40,10 80,10" fill="none" stroke="currentColor" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                    </marker>
                  </defs>
               </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 font-handwriting">糟糕，被拦截了...</h2>
            <div className="space-y-4 text-center max-w-xs">
                <p className="text-gray-300 leading-relaxed">
                   微信可能不支持直接访问或保存图片。
                </p>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="font-bold text-lg text-yellow-400 mb-2">💡 正确打开方式：</p>
                    <ol className="text-left text-sm space-y-2 list-decimal list-inside text-gray-300">
                        <li>点击右上角的 <span className="font-bold text-white">···</span></li>
                        <li>选择 <span className="font-bold text-white">在浏览器打开</span></li>
                        <li>(Safari 或 Chrome)</li>
                    </ol>
                </div>
            </div>
            <button className="mt-12 text-gray-500 text-sm underline">
                我已知晓，继续尝试访问
            </button>
        </div>
      )}
    </div>
  );
};

export default App;