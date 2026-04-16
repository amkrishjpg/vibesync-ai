const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/recommend", (req, res) => {
  const { mood } = req.body;

  console.log("Received mood:", mood);

  // dummy response (will replace with ML later)
  const songs = [
    { title: "Blinding Lights", artist: "The Weeknd" },
    { title: "Sienna", artist: "The Marias" },
    { title: "Perfect", artist: "Ed Sheeran" },
  ];

  res.json(songs);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});