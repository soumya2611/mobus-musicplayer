import React, { useState, useRef, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import HighwayBackground from './components/HighwayBackground';
import BusGraphic from './components/BusGraphic';
import HornButton from './components/HornButton';
import BusQuotesTicker from './components/BusQuotesTicker';
import MusicPlayerBar from './components/MusicPlayerBar';
import QueueDrawer from './components/QueueDrawer';
import AdminPanel from './components/AdminPanel';
import { playlist as defaultStaticPlaylist, BUS_ROUTES } from './data/playlist';
import { Play, Sparkles, Volume2, Radio, Bell } from 'lucide-react';
import { subscribeToRadioState, updateCentralRadioPlaylist, subscribeToCentralSongsCatalog } from './services/realtimeRadioService';
import { calculateLiveRadioState, syncDeviceClockWithServer } from './utils/radioSyncEngine';

export default function App() {
  const [allSongsList, setAllSongsList] = useState(defaultStaticPlaylist);

  // Sync device clock with global UTC server time on mount
  useEffect(() => {
    syncDeviceClockWithServer();
  }, []);

  // Live Toast Notification Banner state
  const [broadcastNotice, setBroadcastNotice] = useState('');
  const [lastNoticeTime, setLastNoticeTime] = useState(0);

  // Subscribe to dynamic central song catalog (Admin uploaded songs)
  useEffect(() => {
    const unsubscribeCatalog = subscribeToCentralSongsCatalog((remoteSongs) => {
      if (Array.isArray(remoteSongs) && remoteSongs.length > 0) {
        setAllSongsList(remoteSongs);
      }
    });

    return () => {
      if (typeof unsubscribeCatalog === 'function') unsubscribeCatalog();
    };
  }, []);

  // Load enabled song IDs from localStorage or default to all songs
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
    return defaultStaticPlaylist.map(s => s.id);
  });

  const [isCentralSynced, setIsCentralSynced] = useState(false);

  // Active playlist contains only checked songs
  const activePlaylist = allSongsList.filter(s => enabledSongIds.includes(s.id));
  const validPlaylist = activePlaylist.length > 0 ? activePlaylist : allSongsList;

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [targetTrackTime, setTargetTrackTime] = useState(0);
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

  const audioRef = useRef(null);

  // 24/7 Live Radio Synchronization Engine Loop (runs every 1s)
  useEffect(() => {
    const syncLiveRadio = () => {
      const liveState = calculateLiveRadioState(validPlaylist);
      setCurrentTrackIndex(prevIdx => {
        if (prevIdx !== liveState.currentTrackIndex) {
          return liveState.currentTrackIndex;
        }
        return prevIdx;
      });
      setTargetTrackTime(liveState.currentTrackTime);
    };

    syncLiveRadio();
    const interval = setInterval(syncLiveRadio, 1000);
    return () => clearInterval(interval);
  }, [validPlaylist]);

  // Subscribe to central Firebase real-time radio state on mount
  useEffect(() => {
    const unsubscribe = subscribeToRadioState((remoteData) => {
      if (remoteData?.enabledSongIds && Array.isArray(remoteData.enabledSongIds) && remoteData.enabledSongIds.length > 0) {
        setEnabledSongIds(remoteData.enabledSongIds);
        localStorage.setItem('mobus_enabled_songs', JSON.stringify(remoteData.enabledSongIds));
        setIsCentralSynced(true);
      }

      // Check for live notices (Song added / deleted / updated)
      if (remoteData?.latestNotice && remoteData?.noticeTime > lastNoticeTime) {
        setBroadcastNotice(remoteData.latestNotice);
        setLastNoticeTime(remoteData.noticeTime);
        setTimeout(() => setBroadcastNotice(''), 6000);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [lastNoticeTime]);

  const safeTrackIndex = currentTrackIndex % validPlaylist.length;
  const currentTrack = validPlaylist[safeTrackIndex] || validPlaylist[0];
  const currentRoute = BUS_ROUTES[currentRouteIndex];

  // Save enabled songs to localStorage AND push to central Firebase Firestore
  const handleSaveEnabledSongs = async (newIds) => {
    setEnabledSongIds(newIds);
    localStorage.setItem('mobus_enabled_songs', JSON.stringify(newIds));
    // Push update to central cloud database so all 5 connected users receive updates live!
    await updateCentralRadioPlaylist(newIds);
  };

  // Handle Play/Pause for 24/7 Live Radio
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = targetTrackTime;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(err => console.error("Audio playback error:", err));
    }
  };

  // Start journey on overlay click
  const handleBoardBus = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTrackTime;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Audio playback error:", err));
    }
  };

  // When track index or playlist changes, update source & auto-sync to live position
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.src;
    audioRef.current.load();
    audioRef.current.currentTime = targetTrackTime;
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Auto play error:", err));
    }
  }, [safeTrackIndex, enabledSongIds, currentTrack]);

  // Sync audio time drift to 24/7 live position if offset > 2.5 seconds
  useEffect(() => {
    if (!audioRef.current || !isPlaying) return;
    const diff = Math.abs(audioRef.current.currentTime - targetTrackTime);
    if (diff > 2.5) {
      audioRef.current.currentTime = targetTrackTime;
    }
  }, [targetTrackTime, isPlaying]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [safeTrackIndex, validPlaylist.length]);

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
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none font-sans bg-slate-950 text-slate-100">
      
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onError={(e) => {
          console.warn(`Audio stream error for "${currentTrack?.englishTitle}". Skipping to next track...`);
          setTimeout(() => {
            setCurrentTrackIndex(prev => (prev + 1) % (validPlaylist.length || 1));
          }, 1000);
        }}
      />

      {/* Dynamic Parallax Highway Background with Destination Milestones */}
      <HighwayBackground
        isPlaying={isPlaying}
        timeOfDay={timeOfDay}
        currentRoute={currentRoute}
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
      />

      {/* Bumper Quotes Ticker Header */}
      <BusQuotesTicker />

      {/* Floating Live Broadcast Toast Notice Banner */}
      {broadcastNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 max-w-md w-11/12 px-4 py-3 rounded-2xl bg-amber-500/90 text-slate-950 font-black text-xs sm:text-sm shadow-[0_15px_40px_rgba(245,158,11,0.6)] backdrop-blur-md border-2 border-yellow-300 flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 shrink-0 animate-pulse text-amber-950" />
            <span>{broadcastNotice}</span>
          </div>
          <button
            onClick={() => setBroadcastNotice('')}
            className="px-2 py-0.5 rounded-lg bg-amber-950/20 hover:bg-amber-950/40 text-amber-950 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Horn Button on Left */}
      <HornButton onHonk={triggerHonk} />

      {/* Center Animated Highway Bus (Changes design based on route's busModel) */}
      <main className="relative flex-1 flex items-end justify-center pb-28 sm:pb-32 z-10">
        <BusGraphic
          isPlaying={isPlaying}
          isHonking={isHonking}
          busModel={currentRoute.busModel}
          currentRoute={currentRoute}
        />
      </main>

      {/* Song Queue Drawer Modal (Shows active checked songs) */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        playlist={validPlaylist}
        currentIndex={safeTrackIndex}
        isPlaying={isPlaying}
      />

      {/* Admin Panel Modal (Check / Uncheck songs & Dynamic Upload / Delete) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        allSongs={allSongsList}
        enabledSongIds={enabledSongIds}
        onSaveEnabledSongs={handleSaveEnabledSongs}
        isCentralSynced={isCentralSynced}
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
      />

      {/* Initial Welcome Overlay for Audio Auto-play Activation */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 font-sans">
          <div className="max-w-md w-full glass-panel-gold rounded-3xl p-6 sm:p-8 text-center shadow-[0_25px_60px_rgba(245,158,11,0.3)] border border-amber-500/40 relative overflow-hidden animate-bus-bounce">
            
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
            
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-4xl shadow-xl border-2 border-amber-300 animate-pulse">
              📻
            </div>

            <h2 className="text-3xl font-extrabold text-amber-200 mb-1">
              Mo Bus 24/7 Live FM
            </h2>
            <p className="text-sm text-amber-300/90 font-bold mb-2">
              Non-Stop Synchronized Bus Radio
            </p>

            <div className="my-4 p-3 rounded-xl bg-black/50 border border-amber-500/20 text-xs text-slate-200 text-left space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Volume2 className="w-4 h-4" />
                <span>🔴 24/7 Synchronized Live Stream Active</span>
              </div>
              <p>• Every listener hears the exact same song at the exact same second 📻</p>
              <p>• Continuous non-stop retro radio broadcast 24/7 🎵</p>
              <p>• Click the horn button to blow authentic bus horn 🎺</p>
            </div>

            <button
              onClick={handleBoardBus}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg shadow-[0_10px_30px_rgba(245,158,11,0.5)] transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Listen Live Stream</span>
              <Sparkles className="w-5 h-5 text-amber-950 animate-spin" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
