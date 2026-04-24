import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginWithSpotify } from "../utils/spotifyAuth";
import { useEffect } from "react";
function Home() {
  const navigate = useNavigate();

  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotify = params.get("spotify");

    if (spotify) {
      const tracks = JSON.parse(decodeURIComponent(spotify));
      localStorage.setItem("spotifyTaste", JSON.stringify(tracks));
    }
  }, []);
  
  const handleSubmit = async () => {
    if (!mood.trim()) return;

    setLoading(true);
    setSongs([]);
    
    const spotifyData = JSON.parse(localStorage.getItem("spotifyTaste") || "[]");

    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood, intensity, spotifyData }),
      });

      const data = await res.json();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl animate-pulse" />
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
      </div>
      <div className="absolute top-6 right-6 z-50 flex gap-3">
  
  
</div>

      

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-5xl font-extrabold md:text-6xl"
        >
          Discover Your Vibe 🎧✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 max-w-xl text-center text-gray-400"
        >
          Tell us your mood and let AI cook the perfect playlist for you 🔥
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex gap-3">
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="happy, heartbreak, gym mode..."
              className="flex-1 rounded-xl bg-white px-4 py-3 text-black outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold"
            >
              🎧
            </motion.button>
          </div>

          <div className="mt-4">
            <p className="mb-1 text-sm text-gray-400">
              Mood Intensity ⚡ ({intensity})
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              { label: "😊 happy", value: "happy" },
              { label: "💔 sad", value: "sad" },
              { label: "🌙 chill", value: "chill" },
              { label: "🚗 drive", value: "drive" },
              { label: "💪 gym", value: "gym" },
            ].map((m, i) => (
              <span
                key={i}
                onClick={() => setMood(m.value)}
                className="cursor-pointer rounded-full bg-white/10 px-3 py-1 text-sm transition hover:bg-white/20"
              >
                {m.label}
              </span>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 grid w-full max-w-4xl gap-5 md:grid-cols-2">
          {songs.map((song, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold">{song.title}</h3>
              <p className="text-sm text-gray-400">{song.artist}</p>
              <p className="mt-2 text-xs text-emerald-400">{song.reason}</p>

              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>AI match</span>
                <span>✨ vibe-based</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;