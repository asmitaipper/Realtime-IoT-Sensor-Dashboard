import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  const interval = setInterval(() => {
    const now = Date.now();

    const temperature = 20 + Math.random() * 10;
    const humidity = 40 + Math.random() * 20;
    const vibration = Math.random() * 0.1;

    const isAnomaly =
      temperature > 28 ||
      humidity < 45 ||
      vibration > 0.08;

    const payload = {
      timestamp: now,
      temperature: Number(temperature.toFixed(2)),
      humidity: Number(humidity.toFixed(2)),
      vibration: Number(vibration.toFixed(3)),
      anomaly: isAnomaly
    };

    ws.send(JSON.stringify(payload));
  }, 1000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

app.get("/", (_req, res) => {
  res.send("Realtime IoT Sensor Dashboard Backend");
});
