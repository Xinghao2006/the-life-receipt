import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface RetroSnakeProps {
  onBack: () => void;
}

const GRID_SIZE = 20;
const SPEED = 120;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const RetroSnake: React.FC<RetroSnakeProps> = ({ onBack }) => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef<Direction>('RIGHT'); // To prevent rapid double-turns causing self-collision
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('snake_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake_highscore', score.toString());
    }
  }, [score, highScore]);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') changeDir('UP');
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') changeDir('DOWN');
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') changeDir('LEFT');
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') changeDir('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const changeDir = (newDir: Direction) => {
      setDirection(newDir);
      directionRef.current = newDir;
  };

  const spawnFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(spawnFood());
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const gameOverLogic = () => {
    setIsPlaying(false);
    setGameOver(true);
    if (navigator.vibrate) navigator.vibrate(200);
  };

  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = window.setInterval(() => {
        setSnake((prevSnake) => {
          const head = prevSnake[0];
          const newHead = { ...head };

          switch (directionRef.current) {
            case 'UP': newHead.y -= 1; break;
            case 'DOWN': newHead.y += 1; break;
            case 'LEFT': newHead.x -= 1; break;
            case 'RIGHT': newHead.x += 1; break;
          }

          // Wall Collision
          if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            gameOverLogic();
            return prevSnake;
          }

          // Self Collision
          if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
             gameOverLogic();
             return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          // Food Collision
          if (newHead.x === food.x && newHead.y === food.y) {
            setScore(s => s + 10);
            setFood(spawnFood());
            if (navigator.vibrate) navigator.vibrate(50);
            // Grow: Don't pop tail
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, food]);


  return (
    <div className="min-h-screen w-full bg-[#2d3748] flex flex-col items-center justify-center font-mono relative select-none">
       {/* Background Decoration */}
       <div className="absolute inset-0 opacity-10" style={{ 
           backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
           backgroundSize: '20px 20px' 
       }}></div>

       {/* Top Bar */}
       <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full"
          >
            <ArrowLeft size={16} /> BACK
          </button>
          <div className="flex gap-4 text-yellow-500 font-bold">
             <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded">
                <Trophy size={16} /> {highScore}
             </div>
          </div>
       </div>

       {/* Gameboy Body */}
       <div className="bg-[#c0c0c0] p-6 rounded-b-3xl rounded-t-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b-8 border-gray-400 relative z-10 w-full max-w-[360px]">
           
           {/* Screen Bezel */}
           <div className="bg-[#555] p-6 rounded-t-lg rounded-b-[40px] relative shadow-inner">
               <div className="text-[10px] text-gray-400 mb-1 flex justify-between uppercase tracking-widest font-bold">
                   <span>Dot Matrix</span>
                   <span>Stereo Sound</span>
               </div>
               
               {/* LCD Screen */}
               <div 
                  ref={containerRef}
                  className="w-full aspect-square bg-[#9bbc0f] relative shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] overflow-hidden border-2 border-[#8b9c0f]"
               >
                   {/* Pixel Grid */}
                   <div 
                      className="grid w-full h-full"
                      style={{ 
                          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
                      }}
                   >
                       {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                           const x = i % GRID_SIZE;
                           const y = Math.floor(i / GRID_SIZE);
                           const isSnake = snake.some(s => s.x === x && s.y === y);
                           const isFood = food.x === x && food.y === y;
                           
                           return (
                               <div 
                                  key={i} 
                                  className={`
                                    w-full h-full border-[0.5px] border-[#8b9c0f]/20
                                    ${isSnake ? 'bg-[#0f380f]' : ''}
                                    ${isFood ? 'bg-[#306230] rounded-full scale-75' : ''}
                                  `}
                               />
                           );
                       })}
                   </div>

                   {/* Overlay: Game Over / Start */}
                   {(!isPlaying || gameOver) && (
                       <div className="absolute inset-0 bg-[#9bbc0f]/80 flex flex-col items-center justify-center p-4 text-[#0f380f]">
                           <h2 className="text-2xl font-black mb-2 tracking-widest">{gameOver ? 'GAME OVER' : 'SNAKE'}</h2>
                           {gameOver && <p className="mb-4 font-bold">SCORE: {score}</p>}
                           <button 
                              onClick={resetGame}
                              className="animate-pulse font-bold text-sm border-2 border-[#0f380f] px-4 py-2 hover:bg-[#0f380f] hover:text-[#9bbc0f] transition-colors"
                           >
                              {gameOver ? 'TRY AGAIN' : 'PRESS START'}
                           </button>
                       </div>
                   )}
               </div>
           </div>

           {/* Brand */}
           <div className="mt-4 mb-8 pl-2">
               <span className="font-sans font-bold italic text-blue-800 text-lg tracking-wide">Nintendo</span>
               <span className="font-sans text-blue-800 text-sm ml-1">GAME BOY</span>
           </div>

           {/* Controls */}
           <div className="flex justify-between items-center px-4 pb-8">
               
               {/* D-Pad */}
               <div className="relative w-28 h-28">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#333] rounded-t hover:bg-[#222] active:bg-[#000] cursor-pointer shadow-md" onClick={() => { if(direction !== 'DOWN') changeDir('UP') }}>
                        <ChevronUp className="w-full h-full p-1 text-[#555]" />
                   </div>
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#333] rounded-b hover:bg-[#222] active:bg-[#000] cursor-pointer shadow-md" onClick={() => { if(direction !== 'UP') changeDir('DOWN') }}>
                        <ChevronDown className="w-full h-full p-1 text-[#555]" />
                   </div>
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#333] rounded-l hover:bg-[#222] active:bg-[#000] cursor-pointer shadow-md" onClick={() => { if(direction !== 'RIGHT') changeDir('LEFT') }}>
                        <ChevronLeft className="w-full h-full p-1 text-[#555]" />
                   </div>
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#333] rounded-r hover:bg-[#222] active:bg-[#000] cursor-pointer shadow-md" onClick={() => { if(direction !== 'LEFT') changeDir('RIGHT') }}>
                        <ChevronRight className="w-full h-full p-1 text-[#555]" />
                   </div>
                   {/* Center Hub */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#333]"></div>
               </div>

               {/* A/B Buttons */}
               <div className="flex gap-4 rotate-[-15deg] translate-y-4">
                   <div className="flex flex-col items-center gap-1">
                       <button 
                         onClick={resetGame}
                         className="w-10 h-10 bg-red-700 rounded-full shadow-[0_2px_0_rgb(100,0,0)] active:shadow-none active:translate-y-[2px]"
                       ></button>
                       <span className="font-bold text-gray-500 text-xs">B</span>
                   </div>
                   <div className="flex flex-col items-center gap-1 mt-[-10px]">
                       <button 
                         onClick={() => { if(!isPlaying) resetGame(); }}
                         className="w-10 h-10 bg-red-700 rounded-full shadow-[0_2px_0_rgb(100,0,0)] active:shadow-none active:translate-y-[2px]"
                       ></button>
                       <span className="font-bold text-gray-500 text-xs">A</span>
                   </div>
               </div>

           </div>

           {/* Start/Select */}
           <div className="flex justify-center gap-8 px-12 mb-2">
               <div className="flex flex-col items-center">
                   <div className="w-12 h-3 bg-gray-500 rounded-full transform rotate-[25deg] shadow-sm"></div>
                   <span className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-wider">Select</span>
               </div>
               <div className="flex flex-col items-center">
                   <button onClick={resetGame} className="w-12 h-3 bg-gray-500 rounded-full transform rotate-[25deg] shadow-sm hover:bg-gray-600 active:scale-95"></button>
                   <span className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-wider">Start</span>
               </div>
           </div>

       </div>
    </div>
  );
};

export default RetroSnake;