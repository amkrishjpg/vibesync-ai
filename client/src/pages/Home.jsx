import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!mood.trim()) return;

    setLoading(true);
    setSongs([]);

    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood }),
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
    <div className="relative min-h-screen overflow-hidden bg-[#06142b] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pb-16 pt-28">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-4xl text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
          >
            Discover Music by Your Mood{" "}
            <span className="inline-block">🎶</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg"
          >
            Type how you feel and get AI-powered song recommendations based on
            mood, audio features, and similarity matching.
          </motion.p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65 }}
          className="mt-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Describe your vibe... (e.g. late night drive, happy, chill)"
              className="flex-1 rounded-2xl border border-white/10 bg-white/90 px-5 py-4 text-base text-slate-900 outline-none transition focus:ring-4 focus:ring-emerald-400/30"
            />

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSubmit}
              className="rounded-2xl bg-emerald-500 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
            >
              Find Music
            </motion.button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              happy
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              sad
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              chill
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              late night drive
            </span>
          </div>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-lg"
            >
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
              <p className="text-slate-200">Finding songs for your vibe...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {!loading && songs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-12 w-full max-w-4xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Recommended Songs
                </h2>
                <p className="text-sm text-slate-400">
                  {songs.length} results
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {songs.map((song, index) => (
                  <motion.div
                    key={`${song.title}-${song.artist}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold leading-snug text-white">
                          {song.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300">
                          {song.artist}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-lg text-emerald-300 transition group-hover:bg-emerald-500/25">
                        ▶
                      </div>
                    </div>

                    <div className="mt-5 h-px w-full bg-white/10" />

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>AI match</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                        mood-based
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Home;