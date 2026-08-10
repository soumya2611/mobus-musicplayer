import React from 'react';
import { Play, Pause, Volume2, VolumeX, Disc, Radio, ListMusic } from 'lucide-react';
import { playBusHorn } from '../utils/soundEngine';

export default function MusicPlayerBar({
  currentTrack,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  volume,
  onChangeVolume,
  isMuted,
  onToggleMute,
  playlistLength,
  currentIndex,
  onToggleQueue
}) {
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl z-30 select-none font-sans">
      
      {/* Glassmorphic Player Container */}
      <div className="glass-panel rounded-2xl p-2.5 sm:p-4 flex flex-col gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15">
        
        {/* Upper Row: Track Info & Controls */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Track Cover & Artwork */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0">
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10 group">
              <img
                src={currentTrack.cover}
                alt={currentTrack.englishTitle}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <Disc className={`w-5 h-5 sm:w-7 sm:h-7 text-amber-300 ${isPlaying ? 'animate-spin-fast' : ''}`} />
              </div>
            </div>

            {/* Song Metadata */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-base font-bold text-slate-100 truncate leading-tight">
                  {currentTrack.englishTitle}
                </h3>
                <button
                  onClick={onToggleQueue}
                  className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 font-mono font-semibold hover:bg-amber-500/30 transition-colors flex items-center gap-0.5 cursor-pointer"
                  title="Song Queue"
                >
                  <ListMusic className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{currentIndex + 1}/{playlistLength}</span>
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-amber-300/90 font-medium truncate leading-tight">
                {currentTrack.title} • <span className="text-slate-300">{currentTrack.movie}</span>
              </p>
              <p className="text-[9px] sm:text-[11px] text-slate-400 truncate hidden xs:block">
                🎤 {currentTrack.artists}
              </p>
            </div>
          </div>

          {/* Player Main Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Horn button inside player bar */}
            <button
              onClick={playBusHorn}
              className="p-1.5 sm:p-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 transition-transform active:scale-95 cursor-pointer"
              title="Tap to Honk"
            >
              <Radio className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400" />
            </button>

            {/* Listen Live / Mute Button */}
            <button
              onClick={onTogglePlay}
              className="px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? "Mute Broadcast" : "Listen Live"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">Pause Live</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Listen Live</span>
                </>
              )}
            </button>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
              <button
                onClick={onToggleMute}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-slate-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

          </div>
        </div>

        {/* Lower Row: 24/7 Live Broadcast Indicator & Progress */}
        <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 uppercase tracking-widest text-[9px] sm:text-[10px]">🔴 24/7 LIVE FM RADIO</span>
          </div>

          <div className="flex-1 relative h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.7)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="text-slate-300 font-bold">{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>

      </div>
    </div>
  );
}
