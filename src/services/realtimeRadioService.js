import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";

const RADIO_DOC_REF = doc(db, "radio", "config");
const CATALOG_DOC_REF = doc(db, "radio", "catalog");

/**
 * Subscribe to real-time radio configuration changes (enabled songs, active track, live notices)
 * @param {Function} onUpdate - Callback function called whenever admin updates playlist
 * @returns {Function} Unsubscribe function
 */
export function subscribeToRadioState(onUpdate) {
  try {
    return onSnapshot(
      RADIO_DOC_REF,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          onUpdate(data);
        }
      },
      (error) => {
        console.warn("Firestore listener info:", error.message || error);
      }
    );
  } catch (err) {
    console.warn("Firestore subscription standby mode.");
    return () => {};
  }
}

/**
 * Subscribe to dynamic central song catalog changes (Admin uploaded songs)
 * @param {Function} onUpdate - Callback function called whenever catalog changes
 * @returns {Function} Unsubscribe function
 */
export function subscribeToCentralSongsCatalog(onUpdate) {
  try {
    return onSnapshot(
      CATALOG_DOC_REF,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.songs)) {
            onUpdate(data.songs);
          }
        }
      },
      (error) => {
        console.warn("Catalog listener info:", error.message || error);
      }
    );
  } catch (err) {
    return () => {};
  }
}

/**
 * Admin function to push enabled song IDs to central Firestore database
 * @param {Array<number>} enabledSongIds - List of active song IDs
 */
export async function updateCentralRadioPlaylist(enabledSongIds) {
  try {
    await setDoc(
      RADIO_DOC_REF,
      {
        enabledSongIds,
        updatedAt: new Date().toISOString(),
        updatedBy: "admin_soumya"
      },
      { merge: true }
    );
    console.log("🔥 Central Radio playlist updated successfully in Firebase!");
    return true;
  } catch (error) {
    console.error("Firestore update error:", error);
    return false;
  }
}

/**
 * Free Catbox/Litterbox CDN file uploader (0 CORS restriction fallback)
 */
async function uploadToCatboxCDN(file, onProgress) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("time", "72h");
  formData.append("fileToUpload", file);

  if (onProgress) onProgress(40);

  const response = await fetch("https://litterbox.catbox.moe/resources/process.php", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("CDN Upload failed with status " + response.status);
  }

  const fileUrl = await response.text();
  if (onProgress) onProgress(100);
  return fileUrl.trim();
}

/**
 * Admin function to upload MP3 audio file or cover image with CORS fallback
 */
export function uploadFileToStorage(file, folderPath, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileRef = ref(storage, `${folderPath}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        async (error) => {
          console.warn("Firebase Storage CORS/Preflight error. Using CDN fallback...", error);
          try {
            const fallbackUrl = await uploadToCatboxCDN(file, onProgress);
            resolve(fallbackUrl);
          } catch (fallbackErr) {
            reject(error);
          }
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    } catch (err) {
      try {
        const fallbackUrl = await uploadToCatboxCDN(file, onProgress);
        resolve(fallbackUrl);
      } catch (fallbackErr) {
        reject(err);
      }
    }
  });
}

/**
 * Admin function to add a new song to the central Firestore catalog AND play it first for everyone!
 */
export async function addSongToCentralCatalog(currentCatalog, newSongData) {
  try {
    const nextId = currentCatalog.length > 0 ? Math.max(...currentCatalog.map(s => Number(s.id))) + 1 : 1;
    const newSong = { id: nextId, ...newSongData };
    // Put newly added song at index 0 so it's placed first!
    const updatedSongs = [newSong, ...currentCatalog];

    await setDoc(
      CATALOG_DOC_REF,
      {
        songs: updatedSongs,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    // Auto-enable all songs, broadcast live toast notice & jump to newly added song ID immediately
    const enabledIds = Array.from(new Set(updatedSongs.map(s => s.id)));
    await setDoc(
      RADIO_DOC_REF,
      {
        enabledSongIds: enabledIds,
        activeTrackId: nextId,
        latestNotice: `🎵 New Song Added: "${newSongData.englishTitle}" — Playing Now!`,
        noticeTime: Date.now(),
        updatedAt: new Date().toISOString(),
        updatedBy: "admin_soumya"
      },
      { merge: true }
    );

    return updatedSongs;
  } catch (error) {
    console.error("Error adding song to catalog:", error);
    throw error;
  }
}

/**
 * Admin function to delete a song from the central Firestore catalog and broadcast notice
 */
export async function deleteSongFromCentralCatalog(currentCatalog, songIdToDelete, songTitle) {
  try {
    const updatedSongs = currentCatalog.filter(s => s.id !== songIdToDelete);

    await setDoc(
      CATALOG_DOC_REF,
      {
        songs: updatedSongs,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    const enabledIds = updatedSongs.map(s => s.id);
    await setDoc(
      RADIO_DOC_REF,
      {
        enabledSongIds: enabledIds,
        latestNotice: `🗑️ Song "${songTitle || 'Track'}" was removed from Radio Queue`,
        noticeTime: Date.now(),
        updatedAt: new Date().toISOString(),
        updatedBy: "admin_soumya"
      },
      { merge: true }
    );

    return updatedSongs;
  } catch (error) {
    console.error("Error deleting song from catalog:", error);
    throw error;
  }
}
