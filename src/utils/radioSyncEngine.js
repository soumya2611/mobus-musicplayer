// Fixed reference epoch timestamp for 24/7 TransitTunes Live Radio (Jan 1, 2025 00:00:00 UTC)
const RADIO_START_EPOCH = 1735689600000;
const DEFAULT_SONG_DURATION = 270; // 4.5 minutes fixed deterministic duration per song

let deviceClockOffset = 0;

/**
 * Synchronizes local device clock with web server HTTP Date header.
 * Eliminates CORS errors and network resets by fetching same-origin server time.
 */
export async function syncDeviceClockWithServer() {
  try {
    const start = Date.now();
    const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
    const dateHeader = res.headers.get('date');
    
    if (dateHeader) {
      const serverMs = new Date(dateHeader).getTime();
      if (!isNaN(serverMs) && serverMs > 0) {
        const roundTrip = Math.round((Date.now() - start) / 2);
        deviceClockOffset = (serverMs + roundTrip) - Date.now();
        console.log("⏱️ Same-origin server clock sync complete. Offset:", deviceClockOffset, "ms");
        return;
      }
    }
  } catch (e) {
    console.warn("Same-origin HEAD request info:", e);
  }

  // Backup fallback using WorldTimeAPI if same-origin header is not exposed
  try {
    const start2 = Date.now();
    const res2 = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
    if (res2.ok) {
      const data2 = await res2.json();
      const serverMs2 = new Date(data2.datetime).getTime();
      const roundTrip2 = Math.round((Date.now() - start2) / 2);
      const offset2 = (serverMs2 + roundTrip2) - Date.now();
      if (Math.abs(offset2) < 60000) {
        deviceClockOffset = offset2;
        console.log("⏱️ Backup NTP clock sync complete. Offset:", deviceClockOffset, "ms");
        return;
      }
    }
  } catch (err2) {
    // Keep 0 offset if offline
  }

  deviceClockOffset = 0;
}

/**
 * Returns accurate global UTC time in milliseconds
 */
export function getAccurateServerTime() {
  return Date.now() + deviceClockOffset;
}

/**
 * PURE & DETERMINISTIC 24/7 Live Radio Calculation
 * Uses fixed track durations so every device on Earth calculates the exact same track & second!
 * @param {Array} playlist - Active songs in radio queue
 * @returns {Object} { currentTrackIndex, currentTrackTime, currentTrack, totalPlaylistDuration }
 */
export function calculateLiveRadioState(playlist) {
  if (!playlist || playlist.length === 0) {
    return { currentTrackIndex: 0, currentTrackTime: 0, currentTrack: null, totalPlaylistDuration: 0 };
  }

  // 1. Calculate cumulative start time using strictly fixed durations
  let accumulatedTime = 0;
  const tracksWithTiming = playlist.map((track) => {
    const duration = Number(track.durationSeconds) || DEFAULT_SONG_DURATION;
    const startTime = accumulatedTime;
    accumulatedTime += duration;
    return { ...track, durationSeconds: duration, startTime, endTime: accumulatedTime };
  });

  const totalPlaylistDuration = accumulatedTime;

  // 2. Use NTP / HTTP Date synced accurate server time
  const now = getAccurateServerTime();
  const elapsedTotalSeconds = ((now - RADIO_START_EPOCH) / 1000) % totalPlaylistDuration;
  const safeElapsedSeconds = elapsedTotalSeconds < 0 ? elapsedTotalSeconds + totalPlaylistDuration : elapsedTotalSeconds;

  // 3. Find active track and current track offset
  let activeIndex = 0;
  let trackOffset = 0;

  for (let i = 0; i < tracksWithTiming.length; i++) {
    const t = tracksWithTiming[i];
    if (safeElapsedSeconds >= t.startTime && safeElapsedSeconds < t.endTime) {
      activeIndex = i;
      trackOffset = safeElapsedSeconds - t.startTime;
      break;
    }
  }

  return {
    currentTrackIndex: activeIndex,
    currentTrackTime: Math.floor(trackOffset),
    currentTrack: tracksWithTiming[activeIndex],
    totalPlaylistDuration
  };
}
