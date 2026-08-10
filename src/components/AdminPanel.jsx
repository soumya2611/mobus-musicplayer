import React, { useState, useEffect } from 'react';
import { Lock, LogOut, CheckSquare, Square, Search, ShieldCheck, Save, AlertCircle, X, Radio, PlusCircle, Trash2, Upload, Music, Image as ImageIcon } from 'lucide-react';
import { uploadFileToStorage, addSongToCentralCatalog, deleteSongFromCentralCatalog } from '../services/realtimeRadioService';

export default function AdminPanel({ isOpen, onClose, allSongs, enabledSongIds, onSaveEnabledSongs, isCentralSynced }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'add'
  const [selectedIds, setSelectedIds] = useState(enabledSongIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Add Song Form State
  const [englishTitle, setEnglishTitle] = useState('');
  const [nativeTitle, setNativeTitle] = useState('');
  const [movie, setMovie] = useState('');
  const [artists, setArtists] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrlInput, setAudioUrlInput] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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
    setSelectedIds([allSongs[0].id]);
  };

  const handleSave = async () => {
    await onSaveEnabledSongs(selectedIds);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Handle Adding New Song (Uploads MP3 & Cover image directly)
  const handleAddNewSongSubmit = async (e) => {
    e.preventDefault();
    if (!englishTitle.trim()) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // 1. Upload Audio File or use direct URL
      let finalAudioUrl = audioUrlInput.trim();
      if (audioFile) {
        setActionNotice('Uploading MP3 audio file to Cloud Storage...');
        finalAudioUrl = await uploadFileToStorage(audioFile, 'music', (progress) => {
          setUploadProgress(Math.round(progress * 0.7));
        });
      }

      if (!finalAudioUrl) {
        alert('Please select an MP3 file or provide a direct MP3 URL.');
        setIsUploading(false);
        return;
      }

      // 2. Upload Cover Image or use default/URL
      let finalCoverUrl = coverUrlInput.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';
      if (coverFile) {
        setActionNotice('Uploading cover artwork to Cloud Storage...');
        finalCoverUrl = await uploadFileToStorage(coverFile, 'covers', (progress) => {
          setUploadProgress(70 + Math.round(progress * 0.25));
        });
      }

      setUploadProgress(95);
      setActionNotice('Broadcasting new song to Central Catalog...');

      const newSongObj = {
        title: nativeTitle.trim() || englishTitle.trim(),
        englishTitle: englishTitle.trim(),
        movie: movie.trim() || 'Single',
        artists: artists.trim() || 'Various Artists',
        src: finalAudioUrl,
        cover: finalCoverUrl
      };

      await addSongToCentralCatalog(allSongs, newSongObj);

      setUploadProgress(100);
      setIsUploading(false);
      setActionNotice('');
      
      // Reset form
      setEnglishTitle('');
      setNativeTitle('');
      setMovie('');
      setArtists('');
      setAudioFile(null);
      setAudioUrlInput('');
      setCoverFile(null);
      setCoverUrlInput('');
      setActiveTab('queue');

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to upload new song:", err);
      alert("Upload failed: " + (err.message || "Cloud storage error. Check console."));
      setIsUploading(false);
      setActionNotice('');
    }
  };

  // Handle Deleting a Song
  const handleDeleteSong = async (e, songId, songTitle) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${songTitle}" from the Central Catalog?`)) {
      try {
        await deleteSongFromCentralCatalog(allSongs, songId, songTitle);
        setActionNotice(`Deleted "${songTitle}" from Central Catalog.`);
        setTimeout(() => setActionNotice(''), 3000);
      } catch (err) {
        alert("Failed to delete song: " + err.message);
      }
    }
  };

  const filteredSongs = allSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.movie.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artists.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none font-sans animate-fade-in">
      
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-3xl flex flex-col p-5 sm:p-7 shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>TransitTunes Admin Control</span>
                {isLoggedIn && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    Logged in: soumya
                  </span>
                )}
              </h2>
              <p className="text-xs text-amber-300/80 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Central Radio Sync Active — Broadcasts to all users</span>
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
              Enter admin credentials to manage playlist queue or upload new songs.
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
          <div className="flex-1 flex flex-col min-h-0 pt-3">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 shrink-0">
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'queue'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-amber-400'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Playlist Queue ({allSongs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('add')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'add'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-amber-400'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload New Song</span>
              </button>
            </div>

            {/* Action Notice Banner */}
            {actionNotice && (
              <div className="my-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2 animate-pulse">
                <Radio className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{actionNotice}</span>
              </div>
            )}

            {/* TAB 1: PLAYLIST QUEUE & SELECTION */}
            {activeTab === 'queue' && (
              <div className="flex-1 flex flex-col min-h-0 pt-3">
                {/* Action Bar & Filter */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 shrink-0">
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

                {/* Song Checkbox & Delete List */}
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
                            alt={song.englishTitle}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                          />

                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-100 truncate">
                              {song.englishTitle} <span className="text-slate-400 font-normal">({song.title})</span>
                            </div>
                            <div className="text-[11px] text-amber-300/80 truncate">
                              {song.movie} • <span className="text-slate-400">{song.artists}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isSelected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                            {isSelected ? 'ENABLED' : 'DISABLED'}
                          </span>

                          <button
                            onClick={(e) => handleDeleteSong(e, song.id, song.englishTitle)}
                            className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                            title="Delete Song"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
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
                        ✓ Broadcast Live to All Listeners!
                      </span>
                    )}
                    <button
                      onClick={handleSave}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black shadow-lg hover:from-amber-400 hover:to-yellow-300 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Broadcast Live Playlist Queue</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD NEW SONG FORM */}
            {activeTab === 'add' && (
              <form onSubmit={handleAddNewSongSubmit} className="flex-1 overflow-y-auto pt-3 space-y-4 custom-scrollbar text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Song English Title *</label>
                    <input
                      type="text"
                      value={englishTitle}
                      onChange={(e) => setEnglishTitle(e.target.value)}
                      placeholder="e.g. Tum Hi Ho"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Native Title / Subtitle</label>
                    <input
                      type="text"
                      value={nativeTitle}
                      onChange={(e) => setNativeTitle(e.target.value)}
                      placeholder="e.g. तुम ही हो"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Movie / Album Name</label>
                    <input
                      type="text"
                      value={movie}
                      onChange={(e) => setMovie(e.target.value)}
                      placeholder="e.g. Aashiqui 2 (2013)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Singers / Artists</label>
                    <input
                      type="text"
                      value={artists}
                      onChange={(e) => setArtists(e.target.value)}
                      placeholder="e.g. Arijit Singh"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* MP3 Audio Upload Option */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Music className="w-4 h-4" />
                    <span>MP3 Audio File Source *</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="file"
                      accept="audio/mp3,audio/mpeg,audio/*"
                      onChange={(e) => setAudioFile(e.target.files[0] || null)}
                      className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer w-full"
                    />
                    <span className="text-xs text-slate-500 font-bold">OR</span>
                    <input
                      type="url"
                      value={audioUrlInput}
                      onChange={(e) => setAudioUrlInput(e.target.value)}
                      placeholder="Direct MP3 Audio URL (e.g. https://.../song.mp3)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Cover Image Upload Option */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Cover Artwork Image (Optional)</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files[0] || null)}
                      className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer w-full"
                    />
                    <span className="text-xs text-slate-500 font-bold">OR</span>
                    <input
                      type="url"
                      value={coverUrlInput}
                      onChange={(e) => setCoverUrlInput(e.target.value)}
                      placeholder="Direct Image URL (e.g. https://.../cover.jpg)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-amber-300 font-bold">
                      <span>Uploading to Cloud Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-amber-500/30">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl hover:from-amber-400 hover:to-yellow-300 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading Song...' : 'Upload & Broadcast New Song'}</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
