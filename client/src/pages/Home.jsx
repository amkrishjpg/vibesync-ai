import { useState } from "react";

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
    console.error(error);
  }

  setLoading(false);
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