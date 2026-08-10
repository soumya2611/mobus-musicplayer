import React from 'react';

export default function HighwayBackground({ isPlaying, timeOfDay, currentRoute }) {
  // Dynamic Sky Background gradients based on time of day
  const skyGradients = {
    sunset: 'from-amber-950 via-rose-950 to-slate-950',
    night: 'from-slate-950 via-indigo-950 to-slate-950',
    dawn: 'from-orange-950 via-pink-950 to-slate-950'
  };

  const sunMoonStyles = {
    sunset: 'bg-gradient-to-tr from-amber-500 to-rose-400 shadow-[0_0_90px_rgba(245,158,11,0.7)] w-24 h-24 sm:w-32 sm:h-32',
    night: 'bg-gradient-to-tr from-slate-100 to-slate-300 shadow-[0_0_80px_rgba(255,255,255,0.6)] w-20 h-20 sm:w-28 sm:h-28',
    dawn: 'bg-gradient-to-tr from-rose-400 to-amber-300 shadow-[0_0_100px_rgba(244,63,94,0.6)] w-24 h-24 sm:w-32 sm:h-32'
  };

  // Get destination city name in English
  const destCity = currentRoute?.enTo || 'Odisha';
  const distance = currentRoute?.distanceKm || 50;
  const routeNo = currentRoute?.routeNo || 'NH-44';

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${skyGradients[timeOfDay] || skyGradients.sunset} transition-colors duration-1000 overflow-hidden pointer-events-none select-none`}>
      
      {/* Animated Parabolic Celestial Arc (Sun & Moon trajectory from horizon across zenith) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className={`absolute rounded-full transition-all duration-1000 animate-celestial-arc ${sunMoonStyles[timeOfDay]}`} />
      </div>

      {/* Night Stars */}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent opacity-80 z-0">
          <div className="w-full h-1/2 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px] opacity-40 animate-pulse" />
        </div>
      )}

      {/* Moving Clouds */}
      <div className="absolute top-10 left-0 right-0 h-40 opacity-30 z-0">
        <div className={`absolute top-4 w-72 sm:w-96 h-20 bg-slate-300/20 blur-xl rounded-full ${isPlaying ? 'animate-cloud-slow' : ''}`} />
        <div className={`absolute top-16 w-60 sm:w-80 h-16 bg-amber-200/20 blur-lg rounded-full ${isPlaying ? 'animate-cloud-fast' : ''}`} style={{ animationDelay: '-10s' }} />
      </div>

      {/* Mountain Silhouettes */}
      <div className="absolute bottom-40 left-0 right-0 h-48 opacity-60 z-0">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120 L0 60 Q 150 10 300 70 Q 450 100 600 40 Q 750 0 900 60 Q 1050 90 1200 50 L1200 120 Z"
            fill="#090d16"
          />
          <path
            d="M0 120 L0 80 Q 200 30 400 90 Q 600 20 800 80 Q 1000 40 1200 85 L1200 120 Z"
            fill="#050810"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Road Perspective Highway & Asphalt */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-slate-900 border-t-4 border-amber-600 shadow-[inset_0_20px_40px_rgba(0,0,0,0.8)] z-0">
        
        {/* Asphalt Texture */}
        <div className="absolute inset-0 bg-slate-950/80" />

        {/* Top road shoulder line */}
        <div className="absolute top-2 left-0 right-0 h-1 bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />

        {/* Center Dash Lines Moving */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-3 overflow-hidden">
          <div
            className={`w-[4000px] h-full ${isPlaying ? 'animate-road' : ''}`}
            style={{
              backgroundImage: 'linear-[#fbbf24_50%,_transparent_50%]',
              backgroundSize: '80px 100%',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: '0 0'
            }}
          >
            <div className="w-full h-full flex gap-12">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-16 h-full bg-amber-400 rounded-sm shadow-[0_0_12px_rgba(251,191,36,0.8)] shrink-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom road edge line */}
        <div className="absolute bottom-2 left-0 right-0 h-1 bg-slate-400/50" />

        {/* Road speed lines particle effect when playing */}
        {isPlaying && (
          <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-road-fast" />
          </div>
        )}
      </div>

      {/* Dynamic Passing Highway Milestones (Route-based Destination) */}
      <div className="absolute bottom-44 left-0 right-0 overflow-hidden pointer-events-none h-24 z-0">
        <div
          className={`absolute flex items-end gap-96 ${isPlaying ? 'animate-road-slow' : ''}`}
          style={{ width: '4000px' }}
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const currentDist = Math.max(5, distance - i * 8);
            return (
              <div key={i} className="flex items-center gap-80 shrink-0">
                {/* Milestone Stone */}
                <div className="w-14 h-18 bg-white border-2 border-amber-600 rounded-t-full flex flex-col items-center justify-between p-1 shadow-lg text-[9px] font-bold text-slate-900">
                  <div className="w-full bg-amber-500 py-0.5 text-center text-slate-950 font-black rounded-t-full truncate px-0.5">
                    {routeNo}
                  </div>
                  <div className="text-center font-mono">
                    <div className="truncate max-w-[48px] uppercase">{destCity}</div>
                    <div className="text-[11px] text-amber-700 font-extrabold">{currentDist} KM</div>
                  </div>
                </div>

                {/* Highway Dhaba / Service Sign */}
                {i % 2 === 0 && (
                  <div className="px-3 py-1 bg-emerald-800 text-emerald-100 border border-emerald-400 rounded text-[10px] shadow-lg font-bold flex items-center gap-1">
                    <span>🍱 Highway Dhaba 500m</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
