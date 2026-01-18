import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

const WS_URL = "ws://localhost:4000";

function App() {
  const [data, setData] = useState([]);
  const [lastReading, setLastReading] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setLastReading(msg);
      setData((prev) => {
        const updated = [...prev, {
          ...msg,
          timeLabel: new Date(msg.timestamp).toLocaleTimeString()
        }];
        return updated.slice(-60);
      });
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => ws.close();
  }, []);

  const anomalyCount = data.filter(d => d.anomaly).length;

  return (
    <div className="app">
      <header className="header">
        <h1>Realtime IoT Sensor Dashboard</h1>
        <p>Node.js backend + React dashboard streaming live sensor data.</p>
      </header>

      <section className="cards">
        <div className="card">
          <h3>Latest Temperature</h3>
          <p>{lastReading ? `${lastReading.temperature} °C` : "--"}</p>
        </div>
        <div className="card">
          <h3>Latest Humidity</h3>
          <p>{lastReading ? `${lastReading.humidity} %` : "--"}</p>
        </div>
        <div className="card">
          <h3>Latest Vibration</h3>
          <p>{lastReading ? lastReading.vibration : "--"}</p>
        </div>
        <div className={`card ${lastReading?.anomaly ? "card-alert" : ""}`}>
          <h3>Status</h3>
          <p>{lastReading ? (lastReading.anomaly ? "ANOMALY" : "Normal") : "--"}</p>
        </div>
        <div className="card">
          <h3>Anomalies (last 60s)</h3>
          <p>{anomalyCount}</p>
        </div>
      </section>

      <section className="chart-section">
        <h2>Sensor Readings (Last 60s)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeLabel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ff7300"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#387908"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="vibration"
              stroke="#007bff"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default App;
