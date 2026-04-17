import { motion } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Link to="/explore">Explore</Link>
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 z-20 w-full border-b border-white/10 bg-[#06142b]/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          VibeSync AI 🎧
        </h1>

        <div className="hidden items-center gap-6 text-sm text-slate-300 sm:flex">
          <span className="cursor-pointer transition hover:text-white">Home</span>
          <span className="cursor-pointer transition hover:text-white">Explore</span>
          <span className="cursor-pointer transition hover:text-white">Dashboard</span>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;