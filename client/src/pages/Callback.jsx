import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) return;

    console.log("CODE:", code); // debug

    fetch(`http://127.0.0.1:5000/callback?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("BACKEND RESPONSE:", data); // 🔥 IMPORTANT

        if (data.error) {
          alert("Error connecting Spotify ❌");
          return;
        }

        localStorage.setItem("spotifyData", JSON.stringify(data));

        alert("Spotify connected ✅");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("Connection failed ❌");
      });
  }, []);

  return (
    <div className="text-white flex justify-center items-center min-h-screen">
      Connecting to Spotify... 🎵
    </div>
  );
}

export default Callback;