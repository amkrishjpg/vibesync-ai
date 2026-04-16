const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/recommend", (req, res) => {
  const { mood } = req.body;

  console.log("Mood received:", mood);

  // Call Python ML script
  const python = spawn("python", ["../ml-service/app.py", mood]);

  let data = "";

  python.stdout.on("data", (chunk) => {
  console.log("PYTHON OUTPUT:", chunk.toString());
  data += chunk.toString();
});

python.stderr.on("data", (err) => {
  console.error("PYTHON ERROR:", err.toString());
});

  python.on("close", () => {
    try {
      const result = JSON.parse(data);
      res.json(result);
    } catch (error) {
      res.status(500).send("Error processing ML output");
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});