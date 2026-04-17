import { useEffect, useState } from "react";

function Explore() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/explore")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return (
      <div className="text-white text-center mt-20">
        Loading Explore...
      </div>
    );
  }

  const renderSection = (title, songs) => (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {songs.map((song, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-xl">
            <p className="font-bold">{song.title}</p>
            <p className="text-gray-400 text-sm">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-20">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Explore Music 🔥
      </h1>

      {renderSection("🔥 Trending", data.trending)}
      {renderSection("🎵 Most Liked", data.popular)}
      {renderSection("🎧 Discover", data.random)}
    </div>
  );
}

export default Explore;