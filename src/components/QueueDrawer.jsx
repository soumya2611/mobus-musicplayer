import React from 'react';
import { X, Radio, Disc, Lock } from 'lucide-react';

export default function QueueDrawer({ isOpen, onClose, playlist, currentIndex, isPlaying }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-sm select-none font-sans animate-fade-in">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-full sm:max-w-md h-full glass-panel flex flex-col p-4 sm:p-6 shadow-2xl border-l border-white/15 z-10 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                Song Queue
              </h2>
              <p className="text-xs text-amber-300/80 font-medium">
                Mo Bus Live Radio • {playlist.length} Songs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Info Banner */}
        <div className="my-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 font-sans shrink-0">
          <Lock className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Continuous Bus Radio — Tracks auto-play in sequence</span>
        </div>

        {/* Highly-optimized 60fps Smooth Playlist Songs Queue List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 smooth-scroll-container">
          {playlist.map((track, index) => {
            const isCurrent = index === currentIndex;
            
            return (
              <div
                key={track.id}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-colors flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400/60'
                    : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800/90'
                }`}
              >
                {/* Track Thumbnail & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-950">
                    <img
                      src={track.cover}
                      alt={track.englishTitle}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Disc className={`w-5 h-5 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-amber-300' : 'text-slate-200'} truncate`}>
                        {track.englishTitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-200/80 truncate">
                      {track.title} • <span className="text-slate-400">{track.movie}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      🎤 {track.artists}
                    </p>
                  </div>
                </div>

                {/* Queue Status Badge */}
                <div className="shrink-0 text-right">
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                      Playing
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      #{index + 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 text-center shrink-0">
          <p className="text-[11px] text-slate-400">
            Mo Bus • Safe & Scenic Highway Experience 🚌
          </p>
        </div>

      </div>
    </div>
  );
}
