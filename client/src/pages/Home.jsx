import { useState } from "react";

function Home() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!mood.trim()) return;

    setLoading(true);
    setSongs([]); // clear old results

    setTimeout(() => {
      const dummySongs = [
        { title: "Blinding Lights", artist: "The Weeknd" },
        { title: "Night Changes", artist: "One Direction" },
        { title: "Perfect", artist: "Ed Sheeran" },
      ];

      setSongs(dummySongs);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      
      <h1 className="text-4xl font-bold mb-4">
        Discover Music by Your Mood 🎶
      </h1>

      <p className="text-gray-400 mb-6 text-center max-w-xl">
        Tell us how you feel, and we’ll suggest music that matches your vibe.
      </p>

      <input
        type="text"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Describe your vibe... (e.g. late night drive)"
        className="px-4 py-2 w-80 rounded-lg text-black outline-none"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600"
      >
        Find Music
      </button>

      {/* LOADING */}
      {loading && (
        <p className="mt-6 text-gray-400">Finding songs for you...</p>
      )}

      {/* SONG RESULTS */}
      {songs.length > 0 && !loading && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Recommended Songs</h2>

          {songs.map((song, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 mb-2 rounded-lg hover:bg-gray-700 transition"
            >
              <p className="font-bold">{song.title}</p>
              <p className="text-gray-400 text-sm">{song.artist}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Home;