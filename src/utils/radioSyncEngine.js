// Fixed reference epoch timestamp for 24/7 Mo Bus Live Radio (Jan 1, 2025 00:00:00 UTC)
const RADIO_START_EPOCH = 1735689600000;
const DEFAULT_SONG_DURATION = 240; // 4 minutes fallback duration per song

let deviceClockOffset = 0;

/**
 * Synchronizes local device clock with global NTP / UTC server time
 * to fix device clock discrepancies (fast/slow phone/laptop clocks)
 */
export async function syncDeviceClockWithServer() {
  try {
    const start = Date.now();
    const res = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
    if (res.ok) {
      const data = await res.json();
      const serverMs = new Date(data.datetime).getTime();
      const roundTrip = Math.round((Date.now() - start) / 2);
      deviceClockOffset = (serverMs + roundTrip) - Date.now();
      console.log("⏱️ Server clock sync complete. Offset:", deviceClockOffset, "ms");
      return;
    }
  } catch (e) {
    // Secondary fallback NTP server API
    try {
      const start2 = Date.now();
      const res2 = await fetch("https://timeapi.io/api/time/current/zone?timeZone=UTC");
      if (res2.ok) {
        const data2 = await res2.json();
        const serverMs2 = new Date(data2.dateTime + "Z").getTime();
        const roundTrip2 = Math.round((Date.now() - start2) / 2);
        deviceClockOffset = (serverMs2 + roundTrip2) - Date.now();
        console.log("⏱️ Secondary server clock sync complete. Offset:", deviceClockOffset, "ms");
      }
    } catch (err2) {
      console.warn("Using local system clock for 24/7 radio sync.");
    }
  }
}

/**
 * Returns accurate global UTC time in milliseconds
 */
export function getAccurateServerTime() {
  return Date.now() + deviceClockOffset;
}

/**
 * Calculates current active song and exact second offset for 24/7 Live Radio Sync
 * @param {Array} playlist - Active songs in radio queue
 * @returns {Object} { currentTrackIndex, currentTrackTime, currentTrack, totalPlaylistDuration }
 */
export function calculateLiveRadioState(playlist) {
  if (!playlist || playlist.length === 0) {
    return { currentTrackIndex: 0, currentTrackTime: 0, currentTrack: null, totalPlaylistDuration: 0 };
  }

  // 1. Calculate cumulative start time for each track
  let accumulatedTime = 0;
  const tracksWithTiming = playlist.map((track) => {
    const duration = Number(track.durationSeconds) || DEFAULT_SONG_DURATION;
    const startTime = accumulatedTime;
    accumulatedTime += duration;
    return { ...track, durationSeconds: duration, startTime, endTime: accumulatedTime };
  });

  const totalPlaylistDuration = accumulatedTime;

  // 2. Use NTP synced accurate server time instead of raw device clock
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
