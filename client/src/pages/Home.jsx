function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      
      <h1 className="text-4xl font-bold mb-4">
        Discover Music by Your Mood 🎶
      </h1>

      <p className="text-gray-400 mb-6 text-center max-w-xl">
        Tell us how you feel, and we’ll suggest music that matches your vibe.
      </p>

      <input
        type="text"
        placeholder="Describe your vibe... (e.g. late night drive)"
        className="px-4 py-2 w-80 rounded-lg text-black outline-none"
      />

      <button className="mt-4 px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600">
        Find Music
      </button>

    </div>
  );
}

export default Home;