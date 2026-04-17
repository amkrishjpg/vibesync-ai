import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();
  const hasRun = useRef(false); // 👈 key fix

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) return;

    fetch(`http://127.0.0.1:5000/callback?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Spotify Data:", data);

        localStorage.setItem("spotifyTaste", JSON.stringify(data));

        alert("Spotify connected ✅");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("Error connecting Spotify ❌");
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-black">
      <h1>Connecting to Spotify... 🎵</h1>
    </div>
  );
}

export default Callback;