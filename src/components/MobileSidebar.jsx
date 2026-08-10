import React from 'react';
import { X, Navigation, Sun, Moon, Sparkles, ListMusic, Globe, Lock, MapPin, Radio, Shuffle } from 'lucide-react';
import { BUS_ROUTES } from '../data/playlist';
import { translations } from '../data/translations';

export default function MobileSidebar({
  isOpen,
  onClose,
  timeOfDay,
  setTimeOfDay,
  currentRouteIndex,
  onSelectRoute,
  onToggleQueue,
  onOpenAdmin,
  isShuffle,
  onToggleShuffle,
  lang,
  onChangeLang
}) {
  if (!isOpen) return null;

  const t = translations[lang] || translations.or;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md select-none font-odia animate-fade-in md:hidden">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Mobile Drawer Container */}
      <div className="relative w-4/5 max-w-xs h-full glass-panel flex flex-col p-5 shadow-2xl border-l border-white/20 z-10 overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-odia text-lg font-bold text-amber-300">
                {t.title} {t.controlsTitle}
              </h2>
              <p className="text-[10px] text-slate-400">Mobile Control Center</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Language Switcher */}
        <div className="py-4 border-b border-white/10">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2.5">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{t.selectLanguage}</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onChangeLang('or')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                lang === 'or'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400'
              }`}
            >
              ଓଡ଼ିଆ
            </button>

            <button
              onClick={() => onChangeLang('hi')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                lang === 'hi'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400'
              }`}
            >
              हिंदी
            </button>

            <button
              onClick={() => onChangeLang('en')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                lang === 'en'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Section 2: Location Routes */}
        <div className="py-4 border-b border-white/10">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2.5">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{t.selectRoute}</span>
          </label>

          <div className="space-y-2">
            {BUS_ROUTES.map((route, idx) => {
              const isSelected = idx === currentRouteIndex;
              const fromCity = lang === 'or' ? route.orFrom : lang === 'hi' ? route.hiFrom : route.enFrom;
              const toCity = lang === 'or' ? route.orTo : lang === 'hi' ? route.hiTo : route.enTo;

              return (
                <button
                  key={route.id}
                  onClick={() => {
                    onSelectRoute(idx);
                    onClose();
                  }}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Navigation className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                    <span className="text-xs">{fromCity} ➔ {toCity}</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-mono px-1.5 py-0.5 rounded bg-black/40">{route.routeNo}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Sky Mood Theme */}
        <div className="py-4 border-b border-white/10">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2.5">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>{t.selectSky}</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTimeOfDay('sunset')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                timeOfDay === 'sunset'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Sunset</span>
            </button>

            <button
              onClick={() => setTimeOfDay('night')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                timeOfDay === 'night'
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-300" />
              <span>Night</span>
            </button>

            <button
              onClick={() => setTimeOfDay('dawn')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                timeOfDay === 'dawn'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-rose-300" />
              <span>Dawn</span>
            </button>
          </div>
        </div>

        {/* Section 4: Quick Action Buttons */}
        <div className="pt-4 space-y-2.5">
          <button
            onClick={onToggleShuffle}
            className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isShuffle
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-amber-400'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>{isShuffle ? t.shuffleOn : t.shuffleOff}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onToggleQueue();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-900/80 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ListMusic className="w-4 h-4 text-indigo-400" />
            <span>{t.viewQueue}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 border border-amber-500/30 text-amber-300 hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>{t.adminPanel}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
