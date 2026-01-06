import React, { useState, useEffect, useRef } from 'react';
import ReceiptPaper from './components/ReceiptPaper';
import Polaroid from './components/Polaroid';
import Editor from './components/Editor';
import { generatePolaroidStory } from './services/geminiService';
import { ReceiptData, PolaroidData, HiddenContentItem } from './types';
import { Edit2, Share2, Printer, ExternalLink } from 'lucide-react';
import LZString from 'lz-string';

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
  // Expanded hidden content pool (20 items)
  hiddenContent: [
    { id: 'img1', type: 'image', content: "https://images.pexels.com/photos/57980/pexels-photo-57980.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt1', type: 'text', content: "只有在编译通过的那一刻，世界才是美好的。" },
    { id: 'img2', type: 'image', content: "https://images.pexels.com/photos/2088170/pexels-photo-2088170.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt2', type: 'text', content: "凌晨四点的城市，和未闭合的标签页。" },
    { id: 'img3', type: 'image', content: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt3', type: 'text', content: "那个夏天，风吹过代码行，留下了Bug。" },
    { id: 'img4', type: 'image', content: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt4', type: 'text', content: "我们都是被封装好的类，等待被调用。" },
    { id: 'img5', type: 'image', content: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt5', type: 'text', content: "生活没有撤销键 (Ctrl+Z)。" },
    { id: 'img6', type: 'image', content: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt6', type: 'text', content: "在这个死循环里，你是唯一的跳出条件。" },
    { id: 'img7', type: 'image', content: "https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt7', type: 'text', content: "咖啡是把梦想转换成现实的燃料。" },
    { id: 'img8', type: 'image', content: "https://images.pexels.com/photos/259915/pexels-photo-259915.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt8', type: 'text', content: "Error 404: 青春 Not Found." },
    { id: 'img9', type: 'image', content: "https://images.pexels.com/photos/316466/pexels-photo-316466.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt9', type: 'text', content: "提交记录是绿色的，但我的脸是黑色的。" },
    { id: 'img10', type: 'image', content: "https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt10', type: 'text', content: "所有的伟大，都源于一个 Hello World。" },
    { id: 'img11', type: 'image', content: "https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt11', type: 'text', content: "即使是乱码，也是宇宙的一种表达。" },
    { id: 'img12', type: 'image', content: "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt12', type: 'text', content: "未被定义的变量，往往最自由。" },
    { id: 'img13', type: 'image', content: "https://images.pexels.com/photos/2603464/pexels-photo-2603464.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt13', type: 'text', content: "在此处暂停，为了更好地运行。" },
    { id: 'img14', type: 'image', content: "https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt14', type: 'text', content: "把焦虑打包压缩，丢进回收站。" },
    { id: 'img15', type: 'image', content: "https://images.pexels.com/photos/2441454/pexels-photo-2441454.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt15', type: 'text', content: "每一个 Warning 都是善意的提醒。" },
    { id: 'img16', type: 'image', content: "https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt16', type: 'text', content: "在二进制的世界里，寻找彩色的梦。" },
    { id: 'img17', type: 'image', content: "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt17', type: 'text', content: "重启试试，说不定一切都会好起来。" },
    { id: 'img18', type: 'image', content: "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt18', type: 'text', content: "时间复杂度 O(n)，n 是余生。" },
    { id: 'img19', type: 'image', content: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 'txt19', type: 'text', content: "你是我永远不想修复的 Bug。" },
    { id: 'img20', type: 'image', content: "https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=600" }
  ]
};

// --- DATA SERIALIZATION UTILS ---

// Legacy: Unicode-safe Base64 Decoding (for backward compatibility)
const fromBase64Legacy = (str: string) => {
  try {
    let safeStr = str.replace(/ /g, '+');
    while (safeStr.length % 4) safeStr += '=';
    return decodeURIComponent(atob(safeStr).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    console.error("Legacy decode failed:", e);
    return null;
  }
};

// New: Clean and Compress Data
const compressData = (data: ReceiptData): string => {
  // 1. Minify: Remove deprecated/empty fields to save space
  const cleanData = { ...data };
  delete cleanData.hiddenStory; // Remove legacy
  delete cleanData.hiddenImage; // Remove legacy
  
  if (cleanData.hiddenContent) {
    // Filter out empty items
    cleanData.hiddenContent = cleanData.hiddenContent.filter(
        i => i.content && i.content.trim() !== ""
    );
    // If empty array, remove it
    if (cleanData.hiddenContent.length === 0) delete cleanData.hiddenContent;
  }

  // 2. Compress
  const jsonString = JSON.stringify(cleanData);
  return LZString.compressToEncodedURIComponent(jsonString);
};

const decompressData = (str: string): ReceiptData | null => {
  try {
    // Try decompressing first
    const decompressed = LZString.decompressFromEncodedURIComponent(str);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
    // If null/empty, it might be a legacy Base64 string
    const legacy = fromBase64Legacy(str);
    if (legacy) {
      return JSON.parse(legacy);
    }
    return null;
  } catch (e) {
    console.error("Decompression failed", e);
    return null;
  }
};

const App: React.FC = () => {
  const [receiptData, setReceiptData] = useState<ReceiptData>(DEFAULT_RECEIPT);
  const [polaroidData, setPolaroidData] = useState<PolaroidData | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Load from URL Hash (Priority) or Search (Legacy) on mount
  useEffect(() => {
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
        } else if (hashParams.has('d')) {
            // Short alias 'd' for data
            configStr = hashParams.get('d') || "";
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
            const decoded = decompressData(configStr);
            
            if (decoded) {
                // --- Migration Logic for Old Data Format ---
                if (!decoded.hiddenContent && (decoded.hiddenStory || decoded.hiddenImage)) {
                    decoded.hiddenContent = [];
                    if (decoded.hiddenImage) {
                        decoded.hiddenContent.push({ id: 'mig-img', type: 'image', content: decoded.hiddenImage });
                    }
                    if (decoded.hiddenStory) {
                        decoded.hiddenContent.push({ id: 'mig-txt', type: 'text', content: decoded.hiddenStory });
                    }
                }
                // -------------------------------------------

                setReceiptData(decoded);
                setIsPrinting(true);
                setTimeout(() => setIsPrinting(false), 1600);

                // If loaded from legacy query, clean URL
                if (isLegacyQuery && window.location.protocol !== 'blob:') {
                    const newHash = `d=${compressData(decoded)}`;
                    const url = new URL(window.location.href);
                    url.search = ""; 
                    url.hash = newHash;
                    window.history.replaceState(null, '', url.toString());
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
    // Logic: Randomly select 1 Image and 1 Text from the pool (if available)
    if (receiptData.hiddenContent && receiptData.hiddenContent.length > 0) {
        const images = receiptData.hiddenContent.filter(i => i.type === 'image');
        const texts = receiptData.hiddenContent.filter(i => i.type === 'text');

        const selectedItems: HiddenContentItem[] = [];

        // 1. Random Image
        if (images.length > 0) {
            const randomImg = images[Math.floor(Math.random() * images.length)];
            selectedItems.push(randomImg);
        }

        // 2. Random Text
        if (texts.length > 0) {
            const randomTxt = texts[Math.floor(Math.random() * texts.length)];
            selectedItems.push(randomTxt);
        }

        // Only display if we found something, otherwise fall through to legacy/auto logic
        if (selectedItems.length > 0) {
            setPolaroidData({
                items: selectedItems,
                date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
            });
            return;
        }
    }

    // Fallback/Legacy Check: If user had old format but migration failed for some reason
    if (receiptData.hiddenStory || receiptData.hiddenImage) {
         const legacyItems: HiddenContentItem[] = [];
         if(receiptData.hiddenImage) legacyItems.push({ id: 'leg-img', type: 'image', content: receiptData.hiddenImage });
         if(receiptData.hiddenStory) legacyItems.push({ id: 'leg-txt', type: 'text', content: receiptData.hiddenStory });
         
         setPolaroidData({
            items: legacyItems,
            date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
        });
        return;
    }

    // Fallback to auto-generation if totally empty
    const randomItem = receiptData.items[Math.floor(Math.random() * receiptData.items.length)];
    const generatedItems = await generatePolaroidStory(randomItem.name);
    
    setPolaroidData({
      items: generatedItems,
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
    });
  };

  // Robust Copy function that works in HTTP (Insecure Context)
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP / Insecure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSave = async () => {
      try {
        // 1. Clean & Compress (Use 'd' for data to save chars)
        const compressed = compressData(receiptData);
        const hashString = `d=${compressed}`;
        
        let targetUrl = window.location.href;

        // 2. Update Browser URL safely
        if (window.location.protocol === 'blob:') {
            window.location.hash = hashString;
            targetUrl = window.location.href;
        } else {
            const url = new URL(window.location.href);
            url.search = ""; 
            url.hash = hashString;
            targetUrl = url.toString();
            window.history.pushState(null, '', targetUrl);
        }
        
        // 3. Copy using robust method
        await copyToClipboard(targetUrl);
        
        setShowShareToast(true);
      } catch (err) {
        console.error("Share failed", err);
        // Minimal Fallback if compression fails (rare)
        try {
           window.location.hash = `config=${encodeURIComponent(btoa(JSON.stringify(receiptData)))}`;
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

      {/* Polaroid/Memory Strip Modal */}
      {polaroidData && (
        <Polaroid 
            data={polaroidData} 
            onClose={() => setPolaroidData(null)} 
        />
      )}
    </div>
  );
};

export default App;