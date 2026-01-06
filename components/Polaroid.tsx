import React, { useState } from 'react';
import { PolaroidData } from '../types';

interface PolaroidProps {
  data: PolaroidData | null;
  onClose: () => void;
}

const Polaroid: React.FC<PolaroidProps> = ({ data, onClose }) => {
  const [imgError, setImgError] = useState(false);

  if (!data) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white p-4 pb-12 shadow-2xl transform transition-transform duration-500 hover:scale-105 max-w-[320px] w-full"
        style={{ 
            transform: `rotate(${data.rotation}deg)`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="aspect-square bg-gray-200 mb-4 overflow-hidden relative group">
            {!imgError ? (
                <img 
                    src={data.imageUrl} 
                    alt="Memory" 
                    className="w-full h-full object-cover filter contrast-110 saturation-75"
                    loading="eager"
                    onError={() => setImgError(true)}
                />
            ) : (
                // Fallback gradient if image fails to load
                <div className="w-full h-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center">
                   <span className="text-gray-400 font-mono text-xs">MEMORY_NOT_FOUND</span>
                </div>
            )}
            
            {/* Texture overlay for old photo look */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none mix-blend-overlay"></div>
            {/* Scratches/Noise */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
        </div>
        
        <div className="text-center font-handwriting text-ink">
          <p className="text-2xl leading-relaxed transform -rotate-1 text-gray-800">
            {data.story}
          </p>
          <p className="text-xs text-gray-400 mt-4 font-mono uppercase tracking-widest">{data.date}</p>
        </div>

        <button 
            onClick={onClose}
            className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold border border-gray-200"
        >
            ✕
        </button>
      </div>
    </div>
  );
};

export default Polaroid;