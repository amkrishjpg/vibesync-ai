const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { spawn } = require("child_process");
const usedCodes = new Set();
const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = "ffb5a5305f114cab9a0799608d8506d6";
const CLIENT_SECRET = "6d1ba62740a847e3b641e83503a538f0";
const REDIRECT_URI = "http://127.0.0.1:5173/callback";

// =====================
// STEP 1: Redirect to Spotify
// =====================
app.get("/login", (req, res) => {
  const scope = "user-top-read";

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
// STEP 2: Callback → get token
// =====================
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  console.log("CODE RECEIVED:", code);

  // 🚫 prevent duplicate usage
  if (usedCodes.has(code)) {
    console.log("Duplicate code ignored");
    return res.json({ message: "Already processed" });
  }

  usedCodes.add(code);

  try {
    const response = await axios.post(
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

    const access_token = response.data.access_token;

    const topTracks = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const songs = topTracks.data.items.map((track) => ({
      title: track.name,
      artist: track.artists[0].name,
    }));

    res.json({ songs });
  } catch (err) {
    console.error("SPOTIFY ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Spotify API failed" });
  }
});

// =====================
// ML ROUTE (same)
// =====================
app.post("/recommend", (req, res) => {
  const { mood, intensity, spotifyData } = req.body;

  const python = spawn("python", ["../ml-service/app.py"]);

  let data = "";

  python.stdin.write(
    JSON.stringify({ mood, intensity, spotifyData })
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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});