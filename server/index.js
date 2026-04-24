const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { spawn } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 Replace with YOUR values (regenerate if exposed)
const CLIENT_ID = "ffb5a5305f114cab9a0799608d8506d6";
const CLIENT_SECRET = "ea4c3c992fcd490b94befb70772bdf15";
const REDIRECT_URI = "http://127.0.0.1:5173/callback";

// Prevent duplicate code usage
const usedCodes = new Set();

// =====================
// STEP 1: Redirect to Spotify
// =====================
app.get("/login", (req, res) => {
  const scope = "user-top-read user-read-recently-played";

  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
    });

  res.redirect(authUrl);
});

// =====================
// STEP 2: Callback → get Spotify data
// =====================
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  console.log("CODE RECEIVED:", code);

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  if (usedCodes.has(code)) {
    console.log("Duplicate code ignored");
    return res.json({ message: "Already processed" });
  }

  usedCodes.add(code);

  try {
    // 🔐 Exchange code for access token
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    // 🎵 Fetch top tracks
    const topTracksRes = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // 🎤 Fetch top artists
    const topArtistsRes = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?limit=10",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // 🕒 Fetch recently played
    const recentlyPlayedRes = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played?limit=10",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // 🔥 Build Spotify data object
    const spotifyData = {
      topTracks: topTracksRes.data.items.map((track) => ({
        title: track.name,
        artist: track.artists[0]?.name || "Unknown",
        image: track.album?.images?.[0]?.url || "",
      })),

      topArtists: topArtistsRes.data.items.map((artist) => ({
        name: artist.name,
        image: artist.images?.[0]?.url || "",
      })),

      recentlyPlayed: recentlyPlayedRes.data.items.map((item) => ({
        title: item.track?.name || "Unknown",
        artist: item.track?.artists?.[0]?.name || "Unknown",
        image: item.track?.album?.images?.[0]?.url || "",
      })),
    };

    // ✅ Debug log (IMPORTANT)
    console.log("SPOTIFY DATA:", spotifyData);

    // ✅ Send to frontend
    res.json(spotifyData);
  } catch (err) {
    console.error("SPOTIFY ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Spotify API failed" });
  }
});

// =====================
// STEP 3: ML RECOMMENDATION
// =====================
app.post("/recommend", (req, res) => {
  const { mood, intensity, spotifyData } = req.body;

  const python = spawn("python", ["../ml-service/app.py"]);

  let data = "";

  python.stdin.write(
    JSON.stringify({
      mood,
      intensity,
      spotifyData,
    })
  );

  python.stdin.end();

  python.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  python.stderr.on("data", (err) => {
    console.error("PYTHON ERROR:", err.toString());
  });

  python.on("close", () => {
    try {
      res.json(JSON.parse(data));
    } catch {
      res.status(500).send("ML error");
    }
  });
});

// =====================
// START SERVER
// =====================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});