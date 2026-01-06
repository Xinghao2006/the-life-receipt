import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Upload, Image as ImageIcon, RotateCcw, Download, Printer, Zap } from 'lucide-react';

interface PolaroidGeneratorProps {
  onBack: () => void;
}

const PolaroidGenerator: React.FC<PolaroidGeneratorProps> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPolaroid, setShowPolaroid] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  
  // "Developing" state for the photo fade-in effect
  const [isDeveloping, setIsDeveloping] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Advanced Synthesized Sound: Shutter Click + Motor Whir
  const playPrintSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;

    // 1. Shutter Click (Short burst of noise/high pitch)
    const shutterOsc = ctx.createOscillator();
    const shutterGain = ctx.createGain();
    shutterOsc.connect(shutterGain);
    shutterGain.connect(ctx.destination);
    
    shutterOsc.type = 'square';
    shutterOsc.frequency.setValueAtTime(800, t);
    shutterOsc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    
    shutterGain.gain.setValueAtTime(0.3, t);
    shutterGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    
    shutterOsc.start(t);
    shutterOsc.stop(t + 0.05);

    // 2. Motor Whir (Sawtooth ramp)
    const motorOsc = ctx.createOscillator();
    const motorGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    motorOsc.connect(filter);
    filter.connect(motorGain);
    motorGain.connect(ctx.destination);
    
    motorOsc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    // Pitch envelope (Motor revving up then stabilizing then stopping)
    motorOsc.frequency.setValueAtTime(50, t + 0.1);
    motorOsc.frequency.linearRampToValueAtTime(120, t + 0.3);
    motorOsc.frequency.setValueAtTime(120, t + 1.8);
    motorOsc.frequency.linearRampToValueAtTime(40, t + 2.0);

    // Volume envelope
    motorGain.gain.setValueAtTime(0, t);
    motorGain.gain.linearRampToValueAtTime(0.2, t + 0.2);
    motorGain.gain.setValueAtTime(0.2, t + 1.8);
    motorGain.gain.linearRampToValueAtTime(0, t + 2.0);

    motorOsc.start(t + 0.1);
    motorOsc.stop(t + 2.0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setImage(ev.target?.result as string);
              setShowPolaroid(false);
              setGeneratedUrl(null);
              setIsDeveloping(false);
          };
          reader.readAsDataURL(file);
      }
  };

  const handlePrint = () => {
      if (!image) return;
      setIsProcessing(true);
      playPrintSound();
      
      // Delay to simulate processing and start animation
      setTimeout(() => {
          setShowPolaroid(true);
          generateCanvasImage();
          
          // Start developing effect
          setIsDeveloping(true);
          setIsProcessing(false);
          
          // Finish developing after a few seconds
          setTimeout(() => {
              setIsDeveloping(false);
          }, 4500); // 4.5s developing time
      }, 1000);
  };

  const generateCanvasImage = () => {
      const canvas = canvasRef.current;
      if (!canvas || !image) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = image;
      
      img.onload = () => {
          // Polaroid Config
          const width = 800;
          const height = 960;
          const padding = 50;
          const bottomPadding = 200;
          const imageSize = width - (padding * 2);

          canvas.width = width;
          canvas.height = height;

          // 1. Draw Paper Frame
          ctx.fillStyle = "#fafaf9"; // stone-50
          ctx.fillRect(0, 0, width, height);

          // 2. Draw Dark Inner Frame Background
          ctx.fillStyle = "#1c1917";
          ctx.fillRect(padding, padding, imageSize, imageSize);

          // 3. Draw Image with Crop (Center Crop)
          const aspect = img.width / img.height;
          let drawW, drawH, sx, sy;
          
          if (aspect > 1) { // Landscape
              drawH = img.height;
              drawW = img.height;
              sx = (img.width - img.height) / 2;
              sy = 0;
          } else { // Portrait
              drawW = img.width;
              drawH = img.width;
              sx = 0;
              sy = (img.height - img.width) / 2;
          }

          // Apply filters
          ctx.filter = 'sepia(0.3) contrast(1.1) brightness(1.1) saturate(0.85)';
          ctx.drawImage(img, sx, sy, drawW, drawH, padding, padding, imageSize, imageSize);
          ctx.filter = 'none';

          // --- VINTAGE EFFECTS ---

          // 4. Add Film Grain (Noise)
          const imageData = ctx.getImageData(padding, padding, imageSize, imageSize);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
              const noise = (Math.random() - 0.5) * 25;
              data[i] = Math.min(255, Math.max(0, data[i] + noise));
              data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
              data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
          }
          ctx.putImageData(imageData, padding, padding);

          // 5. Light Leaks (Gradient overlay)
          ctx.globalCompositeOperation = 'screen';
          const leak = ctx.createLinearGradient(0, 0, width, height);
          leak.addColorStop(0, 'rgba(255, 150, 50, 0.1)'); 
          leak.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
          leak.addColorStop(1, 'rgba(255, 100, 100, 0.15)');
          ctx.fillStyle = leak;
          ctx.fillRect(padding, padding, imageSize, imageSize);

          // 6. Vignette
          ctx.globalCompositeOperation = 'multiply';
          const vig = ctx.createRadialGradient(
              width/2, height/2 - 100, imageSize/3, 
              width/2, height/2 - 100, imageSize/1.1
          );
          vig.addColorStop(0, "rgba(0,0,0,0)");
          vig.addColorStop(1, "rgba(0,0,0,0.5)");
          ctx.fillStyle = vig;
          ctx.fillRect(padding, padding, imageSize, imageSize);
          
          ctx.globalCompositeOperation = 'source-over';

          // 7. Date Stamp (Digital Orange - CURRENT TIME)
          const now = new Date();
          // Format: 'YY MM DD (Classic Film Camera Style)
          const year = now.getFullYear().toString().slice(2);
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0');
          const dateStr = `'${year} ${month} ${day}`;
          
          ctx.font = 'bold 24px "Courier New", monospace';
          ctx.fillStyle = 'rgba(255, 140, 0, 0.85)'; // Slightly more opaque orange
          ctx.shadowColor = 'rgba(255, 60, 0, 0.6)';
          ctx.shadowBlur = 4;
          ctx.textAlign = 'right';
          ctx.fillText(dateStr, width - padding - 20, height - bottomPadding - 30);
          ctx.shadowBlur = 0;

          // 8. Draw Caption
          if (caption) {
              ctx.fillStyle = "#292524";
              ctx.font = 'normal 50px "Caveat", "Ma Shan Zheng", cursive';
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              const textY = height - (bottomPadding / 2) + 10;
              ctx.fillText(caption, width / 2, textY);
          }

          setGeneratedUrl(canvas.toDataURL('image/jpeg', 0.9));
      };
  };

  const handleDownload = () => {
      if (generatedUrl) {
          const link = document.createElement('a');
          link.download = `polaroid-${Date.now()}.jpg`;
          link.href = generatedUrl;
          link.click();
      }
  };

  return (
    <div className="min-h-screen w-full bg-[#292524] text-stone-200 flex flex-col font-sans relative overflow-hidden select-none">
        {/* Hidden Canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header */}
        <div className="relative z-20 w-full p-6 flex justify-between items-center bg-[#1c1917] border-b border-stone-800 shadow-md">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full"
            >
                <ArrowLeft size={16} /> 返回
            </button>
            <h1 className="font-serif-title font-bold text-lg tracking-widest text-stone-400 uppercase flex items-center gap-2">
                <Camera size={20} /> Polaroid Lab
            </h1>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col items-center justify-start pt-10 px-4 relative">
            
            {/* The "Camera" Body (Visual Only) */}
            <div className="w-full max-w-[340px] bg-[#1c1917] rounded-t-2xl p-6 border-x border-t border-stone-700 relative z-30 shadow-2xl">
                 {/* Lens / Viewfinder Area */}
                 <div className="w-full aspect-square bg-[#0f0e0d] rounded-lg border-2 border-stone-800 mb-6 relative overflow-hidden flex items-center justify-center group">
                      {image ? (
                          <img src={image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                      ) : (
                          <div className="text-stone-700 flex flex-col items-center gap-2">
                              <ImageIcon size={48} />
                              <span className="text-xs uppercase tracking-widest">No Film Loaded</span>
                          </div>
                      )}
                      
                      {/* Upload Overlay */}
                      <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                          <Upload size={32} className="mb-2" />
                          <span className="text-xs font-bold uppercase">Insert Photo</span>
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                 </div>

                 {/* Controls */}
                 <div className="space-y-4">
                     <input 
                        type="text" 
                        placeholder="写下这一刻的心情..." 
                        maxLength={25}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full bg-[#292524] text-center text-stone-300 placeholder:text-stone-600 border border-stone-700 rounded p-2 text-sm font-handwriting outline-none focus:border-stone-500"
                     />
                     
                     <button 
                        onClick={handlePrint}
                        disabled={!image || isProcessing || showPolaroid}
                        className={`
                            w-full py-3 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                            ${!image || isProcessing || showPolaroid 
                                ? 'bg-stone-800 text-stone-600 cursor-not-allowed' 
                                : 'bg-red-700 hover:bg-red-600 text-white shadow-lg active:scale-95'}
                        `}
                     >
                        {isProcessing ? 'Processing...' : (
                            <>
                                <Printer size={18} />
                                Print Photo
                            </>
                        )}
                     </button>
                 </div>

                 {/* Camera decorative details */}
                 <div className="absolute -right-2 top-10 w-2 h-16 bg-stone-800 rounded-r border-y border-r border-stone-600"></div>
                 <div className="absolute left-4 top-[-10px] w-20 h-4 bg-stone-800 rounded-t-lg border-t border-stone-600"></div>
            </div>

            {/* The Ejection Slot / Result Area */}
            <div className="relative w-full max-w-[340px] z-20">
                 {/* Slot opening shadow */}
                 <div className="absolute top-0 left-2 right-2 h-2 bg-black/50 rounded-full blur-sm z-30"></div>
                 
                 {/* The Polaroid Animation Container */}
                 <div className={`
                    relative w-full flex justify-center origin-top transition-all duration-[2000ms] ease-out
                    ${showPolaroid ? 'translate-y-0 opacity-100' : '-translate-y-[90%] opacity-0 pointer-events-none'}
                 `}>
                      {/* Result Card */}
                      <div className="bg-[#fafaf9] p-4 pb-12 shadow-2xl w-[280px] transform rotate-1 mt-[-10px] relative">
                          <div className="aspect-square bg-[#1c1917] mb-4 overflow-hidden relative">
                              {generatedUrl ? (
                                  <>
                                    <img 
                                        src={generatedUrl} 
                                        className={`w-full h-full object-cover transition-all duration-[5000ms] ease-in-out ${isDeveloping ? 'brightness-[0.1] grayscale blur-[1px]' : 'brightness-100 grayscale-0 blur-0'}`}
                                        alt="Generated" 
                                    />
                                    {isDeveloping && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="text-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">Developing...</div>
                                        </div>
                                    )}
                                  </>
                              ) : (
                                  <div className="w-full h-full bg-black"></div>
                              )}
                              {/* Texture Overlay for Realism on screen */}
                              <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
                          </div>
                          
                          {/* Reset / Download Buttons (Only visible when done) */}
                          {generatedUrl && !isDeveloping && (
                              <div className="absolute -bottom-14 left-0 w-full flex justify-center gap-4 animate-fade-in">
                                  <button onClick={() => { setShowPolaroid(false); setImage(null); setCaption(''); }} className="p-3 bg-stone-700 text-white rounded-full hover:bg-stone-600 shadow-lg transition-transform hover:scale-110" title="New Photo">
                                      <RotateCcw size={20} />
                                  </button>
                                  <button onClick={handleDownload} className="p-3 bg-white text-black rounded-full hover:bg-stone-200 shadow-lg transition-transform hover:scale-110" title="Save Image">
                                      <Download size={20} />
                                  </button>
                              </div>
                          )}
                      </div>
                 </div>
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none z-0" 
                 style={{ 
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                 }}>
            </div>
        </div>
    </div>
  );
};

export default PolaroidGenerator;