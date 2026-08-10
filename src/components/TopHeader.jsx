import React, { useState, useEffect } from 'react';
import { Clock, Navigation, Sun, Moon, Sparkles, ListMusic, Lock, Menu } from 'lucide-react';
import { BUS_ROUTES } from '../data/playlist';
import MobileSidebar from './MobileSidebar';

export default function TopHeader({
  timeOfDay,
  setTimeOfDay,
  currentRouteIndex,
  setNextRoute,
  onSelectRoute,
  onToggleQueue,
  onOpenAdmin,
  isShuffle,
  onToggleShuffle
}) {
  const [timeStr, setTimeStr] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const route = BUS_ROUTES[currentRouteIndex];
  const fromCity = route.enFrom;
  const toCity = route.enTo;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 px-3 sm:px-4 py-2 flex items-center justify-between backdrop-blur-md bg-slate-950/70 border-b border-white/10 text-xs font-sans">
        
        {/* Left: Clock & Desktop Location Route */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-200 font-mono text-[10px] sm:text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{timeStr || '09:50 AM'}</span>
          </div>

          <button
            onClick={setNextRoute}
            title="Change Route"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer text-xs"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-bold">{fromCity} ➔ {toCity}</span>
            <span className="text-[10px] opacity-80 bg-amber-400/20 px-1.5 py-0.5 rounded font-mono ml-1">{route.routeNo}</span>
          </button>
        </div>

        {/* Center Title Logo: Mo Bus */}
        <div className="text-center">
          <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(251,191,36,0.4)] tracking-wide">
            Mo Bus
          </h1>
        </div>

        {/* Right Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          
          {/* Admin Panel Button */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 px-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all cursor-pointer font-bold text-xs flex items-center gap-1"
            title="Admin Panel"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>

          {/* Queue Drawer Button */}
          <button
            onClick={onToggleQueue}
            className="p-1.5 px-2.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-900/80 transition-all cursor-pointer font-bold text-xs flex items-center gap-1"
            title="Song Queue"
          >
            <ListMusic className="w-3.5 h-3.5 text-indigo-400" />
            <span>Song Queue</span>
          </button>

          {/* Time of day toggle */}
          <button
            onClick={() => {
              const modes = ['sunset', 'night', 'dawn'];
              const nextIdx = (modes.indexOf(timeOfDay) + 1) % modes.length;
              setTimeOfDay(modes[nextIdx]);
            }}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-slate-600 transition-transform active:scale-95 cursor-pointer"
            title={`Sky Theme (${timeOfDay})`}
          >
            {timeOfDay === 'sunset' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
            {timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
            {timeOfDay === 'dawn' && <Sparkles className="w-3.5 h-3.5 text-rose-300" />}
          </button>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 px-2.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold shadow-md"
            title="Menu"
          >
            <Menu className="w-4 h-4 text-amber-400" />
            <span>Menu</span>
          </button>
        </div>

      </header>

      {/* Mobile Sidebar Navigation Drawer */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        currentRouteIndex={currentRouteIndex}
        onSelectRoute={onSelectRoute}
        onToggleQueue={onToggleQueue}
        onOpenAdmin={onOpenAdmin}
        isShuffle={isShuffle}
        onToggleShuffle={onToggleShuffle}
      />
    </>
  );
}
