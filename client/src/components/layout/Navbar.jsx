function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">VibeSync AI 🎧</h1>
      <div className="space-x-6">
        <span className="cursor-pointer hover:text-gray-400">Home</span>
        <span className="cursor-pointer hover:text-gray-400">Explore</span>
        <span className="cursor-pointer hover:text-gray-400">Dashboard</span>
      </div>
    </nav>
  );
}

export default Navbar;