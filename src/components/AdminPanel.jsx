import React, { useState, useEffect } from 'react';
import { Lock, LogOut, CheckSquare, Square, Search, ShieldCheck, Save, AlertCircle, X } from 'lucide-react';

export default function AdminPanel({ isOpen, onClose, allSongs, enabledSongIds, onSaveEnabledSongs, lang }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [selectedIds, setSelectedIds] = useState(enabledSongIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSelectedIds(enabledSongIds);
  }, [enabledSongIds, isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'soumya' && password === 'admin@143') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials! Check username or password.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const toggleSong = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        // Prevent deselecting all songs (at least 1 must remain enabled)
        if (prev.length === 1) return prev;
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectAll = () => {
    setSelectedIds(allSongs.map(s => s.id));
  };

  const deselectAll = () => {
    // Keep first song enabled so playlist is never empty
    setSelectedIds([allSongs[0].id]);
  };

  const handleSave = () => {
    onSaveEnabledSongs(selectedIds);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const filteredSongs = allSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.movie.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artists.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none font-odia animate-fade-in">
      
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-3xl flex flex-col p-5 sm:p-7 shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>Mo Bus Admin Control</span>
                {isLoggedIn && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    Logged in: soumya
                  </span>
                )}
              </h2>
              <p className="text-xs text-amber-300/80">
                Manage Active Playlist Songs & Queue
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

        {/* LOGIN SCREEN */}
        {!isLoggedIn ? (
          <div className="my-auto py-8 px-4 max-w-md mx-auto w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-slate-100 mb-1">
              Admin Login
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter admin username and password to manage active playlist songs.
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm shadow-lg hover:from-amber-400 hover:to-yellow-300 transition-transform active:scale-95 cursor-pointer mt-2"
              >
                Log In
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD */
          <div className="flex-1 flex flex-col min-h-0 pt-4">
            
            {/* Action Bar & Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs..."
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={selectAll}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                >
                  Deselect All
                </button>
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                  {selectedIds.length} / {allSongs.length} Active
                </span>
              </div>
            </div>

            {/* Song Checkbox List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredSongs.map((song) => {
                const isSelected = selectedIds.includes(song.id);

                return (
                  <div
                    key={song.id}
                    onClick={() => toggleSong(song.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400/50 shadow-md'
                        : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button className="text-amber-400 shrink-0">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-amber-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                      />

                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-100 truncate">
                          {song.title} <span className="text-slate-400 font-normal">({song.englishTitle})</span>
                        </div>
                        <div className="text-[11px] text-amber-300/80 truncate">
                          {song.movie} • <span className="text-slate-400">{song.artists}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isSelected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                      {isSelected ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer Controls */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>

              <div className="flex items-center gap-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-bold animate-pulse">
                    ✓ Playlist Saved!
                  </span>
                )}
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black shadow-lg hover:from-amber-400 hover:to-yellow-300 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Playlist Queue</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
