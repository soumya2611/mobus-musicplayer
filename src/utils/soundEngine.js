// Audio player for authentic Indian Bus Horn files located in /public/horns/

const HORN_FILES = [
  { name: "Gori tera....", src: "/horns/Rajasthani Bus Horn Download.mp3" },
  { name: "Bus Air Horn", src: "/horns/Bus Air Horn.mp3" },
  { name: "bus air popcorn", src: "/horns/Indian Truck.mp3" },
  { name: "Travels Horn", src: "/horns/Travels Horn Download.mp3" }
];

let hornIndex = 0;
let currentHornAudio = null;
let synthAudioCtx = null;

/**
 * Play authentic Indian Bus Horn - plays ONE sound file at a time sequentially per click.
 * Stops any previously playing horn to prevent audio overlap.
 */
export function playBusHorn() {
  try {
    // Stop & reset any currently playing horn audio instance
    if (currentHornAudio) {
      currentHornAudio.pause();
      currentHornAudio.currentTime = 0;
      currentHornAudio = null;
    }

    // Select the next horn sound in sequence
    const hornObj = HORN_FILES[hornIndex % HORN_FILES.length];
    hornIndex = (hornIndex + 1) % HORN_FILES.length;

    // console.log(`🎺 Blowing Bus Horn #${hornIndex}: ${hornObj.name}`);

    // Create single Audio instance for selected horn file
    const audio = new Audio(hornObj.src);
    audio.volume = 1.0;
    currentHornAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("Real horn file play failed, using synthesized air horn fallback:", err);
        playSynthesizedHorn();
      });
    }

    // Cleanup reference when finished playing
    audio.onended = () => {
      if (currentHornAudio === audio) {
        currentHornAudio = null;
      }
    };

    return hornObj.name;
  } catch (err) {
    console.error("Error playing horn file:", err);
    playSynthesizedHorn();
  }
}

/**
 * Web Audio API synthesized pneumatic air horn fallback
 */
function playSynthesizedHorn() {
  try {
    if (!synthAudioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      synthAudioCtx = new AudioContext();
    }
    if (synthAudioCtx.state === 'suspended') {
      synthAudioCtx.resume();
    }

    const now = synthAudioCtx.currentTime;
    const frequencies = [349.23, 440.00, 523.25];
    const masterGain = synthAudioCtx.createGain();

    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.4, now + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.6);
    masterGain.gain.linearRampToValueAtTime(0.001, now + 0.9);

    masterGain.connect(synthAudioCtx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = synthAudioCtx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.9);
    });
  } catch (err) {
    console.error("Synthesizer error:", err);
  }
}
