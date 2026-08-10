import React, { useState, useRef, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import HighwayBackground from './components/HighwayBackground';
import BusGraphic from './components/BusGraphic';
import HornButton from './components/HornButton';
import BusQuotesTicker from './components/BusQuotesTicker';
import MusicPlayerBar from './components/MusicPlayerBar';
import QueueDrawer from './components/QueueDrawer';
import AdminPanel from './components/AdminPanel';
import { playlist as allSongsList, BUS_ROUTES } from './data/playlist';
import { translations } from './data/translations';
import { Play, Sparkles, Volume2 } from 'lucide-react';

export default function App() {
  // Load enabled song IDs from localStorage or default to all 33 songs
  const [enabledSongIds, setEnabledSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('mobus_enabled_songs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return allSongsList.map(s => s.id);
  });

  // Load Shuffle mode preference from localStorage
  const [isShuffle, setIsShuffle] = useState(() => {
    try {
      return localStorage.getItem('mobus_shuffle_mode') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Active playlist contains only checked songs
  const activePlaylist = allSongsList.filter(s => enabledSongIds.includes(s.id));
  const validPlaylist = activePlaylist.length > 0 ? activePlaylist : allSongsList;

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const [timeOfDay, setTimeOfDay] = useState('night');
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [isHonking, setIsHonking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lang, setLang] = useState('or'); // 'or' | 'hi' | 'en'

  const audioRef = useRef(null);

  const safeTrackIndex = currentTrackIndex % validPlaylist.length;
  const currentTrack = validPlaylist[safeTrackIndex] || validPlaylist[0];
  const currentRoute = BUS_ROUTES[currentRouteIndex];
  const t = translations[lang] || translations.or;

  // Toggle Shuffle Mode
  const toggleShuffle = () => {
    setIsShuffle(prev => {
      const nextState = !prev;
      localStorage.setItem('mobus_shuffle_mode', String(nextState));
      return nextState;
    });
  };

  // Save enabled songs to localStorage and update active playlist
  const handleSaveEnabledSongs = (newIds) => {
    setEnabledSongIds(newIds);
    localStorage.setItem('mobus_enabled_songs', JSON.stringify(newIds));
    setCurrentTrackIndex(0);
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(err => console.error("Audio playback error:", err));
    }
  };

  // Next & Prev track handlers (supports Shuffle mode!)
  const handlePrevTrack = () => {
    if (isShuffle && validPlaylist.length > 1) {
      let randomIdx;
      do {
        randomIdx = Math.floor(Math.random() * validPlaylist.length);
      } while (randomIdx === safeTrackIndex);
      setCurrentTrackIndex(randomIdx);
    } else {
      setCurrentTrackIndex(prev => (prev - 1 + validPlaylist.length) % validPlaylist.length);
    }
  };

  const handleNextTrack = () => {
    if (isShuffle && validPlaylist.length > 1) {
      let randomIdx;
      do {
        randomIdx = Math.floor(Math.random() * validPlaylist.length);
      } while (randomIdx === safeTrackIndex);
      setCurrentTrackIndex(randomIdx);
    } else {
      setCurrentTrackIndex(prev => (prev + 1) % validPlaylist.length);
    }
  };

  // Start journey on overlay click — NOTE: Horn auto-play is REMOVED!
  const handleBoardBus = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Audio playback error:", err));
    }
  };

  // Continuous playback: Auto advance to next song when current track ends!
  const handleAudioEnded = () => {
    handleNextTrack();
  };

  // When track index or playlist changes, update source & auto-play if previously playing
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.src;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Auto play error:", err));
    }
  }, [safeTrackIndex, enabledSongIds]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [safeTrackIndex, validPlaylist.length, isShuffle]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const triggerHonk = () => {
    setIsHonking(true);
    setTimeout(() => setIsHonking(false), 300);
  };

  const handleNextRoute = () => {
    setCurrentRouteIndex(prev => (prev + 1) % BUS_ROUTES.length);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none font-odia bg-slate-950 text-slate-100">
      
      {/* Hidden HTML5 Audio Element */}
      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      {/* Dynamic Parallax Highway Background with Destination Milestones */}
      <HighwayBackground
        isPlaying={isPlaying}
        timeOfDay={timeOfDay}
        currentRoute={currentRoute}
        lang={lang}
      />

      {/* Top Fixed Header */}
      <TopHeader
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        currentRouteIndex={currentRouteIndex}
        setNextRoute={handleNextRoute}
        onSelectRoute={setCurrentRouteIndex}
        onToggleQueue={() => setIsQueueOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isShuffle={isShuffle}
        onToggleShuffle={toggleShuffle}
        lang={lang}
        onChangeLang={setLang}
      />

      {/* Bumper Quotes Ticker Header */}
      <BusQuotesTicker lang={lang} />

      {/* Floating Horn Button on Left */}
      <HornButton onHonk={triggerHonk} lang={lang} />

      {/* Center Animated Highway Bus (Changes design based on route's busModel) */}
      <main className="relative flex-1 flex items-end justify-center pb-28 sm:pb-32 z-10">
        <BusGraphic
          isPlaying={isPlaying}
          isHonking={isHonking}
          busModel={currentRoute.busModel}
          currentRoute={currentRoute}
          lang={lang}
          quotes={t.quotes}
        />
      </main>

      {/* Song Queue Drawer Modal (Shows active checked songs) */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        playlist={validPlaylist}
        currentIndex={safeTrackIndex}
        isPlaying={isPlaying}
        lang={lang}
      />

      {/* Admin Panel Modal (Check / Uncheck songs) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        allSongs={allSongsList}
        enabledSongIds={enabledSongIds}
        onSaveEnabledSongs={handleSaveEnabledSongs}
        lang={lang}
      />

      {/* Bottom Floating Glassmorphic Audio Player Bar */}
      <MusicPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onChangeVolume={setVolume}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        playlistLength={validPlaylist.length}
        currentIndex={safeTrackIndex}
        onToggleQueue={() => setIsQueueOpen(true)}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
        isShuffle={isShuffle}
        onToggleShuffle={toggleShuffle}
        lang={lang}
      />

      {/* Initial Welcome Overlay for Audio Auto-play Activation */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 font-odia">
          <div className="max-w-md w-full glass-panel-gold rounded-3xl p-6 sm:p-8 text-center shadow-[0_25px_60px_rgba(245,158,11,0.3)] border border-amber-500/40 relative overflow-hidden animate-bus-bounce">
            
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
            
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-4xl shadow-xl border-2 border-amber-300 animate-pulse">
              🚌
            </div>

            <h2 className="font-odia text-3xl font-extrabold text-amber-200 mb-1">
              {t.welcomeTitle}
            </h2>
            <p className="text-sm text-amber-300/90 font-bold mb-2">
              {t.title} — {t.subTitle}
            </p>

            <div className="my-4 p-3 rounded-xl bg-black/50 border border-amber-500/20 text-xs text-slate-200 text-left space-y-1.5 font-odia">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Volume2 className="w-4 h-4" />
                <span>{validPlaylist.length} Active Songs in Queue</span>
              </div>
              <p>• Use Next ⏩ / Prev ⏪ or Shuffle 🔀 to change tracks 🎵</p>
              <p>• {t.hornNotice}</p>
            </div>

            <button
              onClick={handleBoardBus}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-odia font-black text-lg shadow-[0_10px_30px_rgba(245,158,11,0.5)] transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t.startJourney}</span>
              <Sparkles className="w-5 h-5 text-amber-950 animate-spin" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
