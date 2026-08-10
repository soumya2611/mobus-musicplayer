import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { playBusHorn } from '../utils/soundEngine';

export default function HornButton({ onHonk }) {
  const [isPressed, setIsPressed] = useState(false);
  const [hornPopups, setHornPopups] = useState([]);

  const handleHornClick = () => {
    // Play ONE real Indian bus horn sound file sequentially per click
    const hornName = playBusHorn();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);

    if (onHonk) onHonk();

    // Display floating popup with horn sound name
    const popupText = hornName ? `🎺 ${hornName}` : "POOO POOO! 🎺";
    
    const newPopup = {
      id: Date.now() + Math.random(),
      text: popupText,
      x: Math.random() * 30 - 15,
      y: Math.random() * 20 - 10
    };

    setHornPopups(prev => [...prev.slice(-3), newPopup]);

    setTimeout(() => {
      setHornPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 1400);
  };

  return (
    <div className="fixed left-2 sm:left-8 top-[50%] -translate-y-1/2 z-30 flex flex-col items-center select-none font-sans">
      
      {/* Floating sound effect text popups */}
      {hornPopups.map(popup => (
        <div
          key={popup.id}
          className="absolute -top-14 text-[10px] sm:text-sm font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.8)] pointer-events-none animate-bounce whitespace-nowrap z-40 bg-slate-900/95 border border-amber-400 px-2.5 py-0.5 rounded-full shadow-2xl"
          style={{ transform: `translate(${popup.x}px, ${popup.y}px)` }}
        >
          {popup.text}
        </div>
      ))}

      {/* Retro Indian Horn Badge Button */}
      <button
        onClick={handleHornClick}
        className={`relative group flex flex-col items-center justify-center w-18 h-18 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-500 via-red-600 to-rose-900 border-2 sm:border-4 border-amber-300 shadow-[0_10px_35px_rgba(239,68,68,0.6)] cursor-pointer transition-transform duration-150 active:scale-90 ${
          isPressed ? 'scale-90 ring-4 sm:ring-8 ring-amber-400/50' : 'hover:scale-105 animate-horn-pulse'
        }`}
        title="Tap to Honk"
      >
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md group-hover:bg-amber-400/40 transition-colors" />

        {/* Horn Icon & English Sticker Text */}
        <Volume2 className={`w-6 h-6 sm:w-10 sm:h-10 text-amber-200 transition-transform ${isPressed ? 'scale-125 rotate-12' : 'group-hover:rotate-6'}`} />

        <span className="text-[10px] sm:text-sm font-black text-amber-100 mt-0.5 tracking-tight drop-shadow-md text-center px-1 truncate max-w-[70px] sm:max-w-none">
          Horn OK Please
        </span>
      </button>

      <span className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800 backdrop-blur-sm hidden xs:inline">
        Tap to Honk 🎺
      </span>
    </div>
  );
}
