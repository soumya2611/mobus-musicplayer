import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

const PRESENCE_COLLECTION = collection(db, "radio_presence");
const SESSION_ID = "listener_" + Math.random().toString(36).substring(2, 9);
const SESSION_DOC_REF = doc(db, "radio_presence", SESSION_ID);

let heartbeatInterval = null;

/**
 * Register active listener presence session and start 15s heartbeat
 */
export function startLivePresenceHeartbeat() {
  try {
    const sendHeartbeat = async () => {
      await setDoc(
        SESSION_DOC_REF,
        {
          sessionId: SESSION_ID,
          lastSeen: Date.now(),
          userAgent: navigator.userAgent.substring(0, 50)
        },
        { merge: true }
      );
    };

    sendHeartbeat();
    if (!heartbeatInterval) {
      heartbeatInterval = setInterval(sendHeartbeat, 15000);
    }

    // Clean up on tab close
    window.addEventListener("beforeunload", () => {
      deleteDoc(SESSION_DOC_REF).catch(() => {});
    });
  } catch (err) {
    console.warn("Presence heartbeat info:", err);
  }
}

/**
 * Subscribe to real-time active listener count (users active within last 35 seconds)
 * @param {Function} onCountUpdate - Callback with active listener count (number)
 */
export function subscribeToLiveListenersCount(onCountUpdate) {
  try {
    return onSnapshot(
      PRESENCE_COLLECTION,
      (snapshot) => {
        const now = Date.now();
        const activeCutoff = now - 35000; // Active in last 35 seconds
        let count = 0;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.lastSeen && data.lastSeen >= activeCutoff) {
            count++;
          }
        });

        // Ensure at least 1 listener (the current user) is counted
        onCountUpdate(Math.max(1, count));
      },
      (error) => {
        console.warn("Presence listener info:", error.message || error);
        onCountUpdate(1);
      }
    );
  } catch (err) {
    onCountUpdate(1);
    return () => {};
  }
}
