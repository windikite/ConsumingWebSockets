import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type MessageStatsProps = {
  socket: any;
};

const MessageStats: React.FC<MessageStatsProps> = ({ socket }) => {
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [messageCounts, setMessageCounts] = useState<number[]>([]);

  useEffect(() => {
    const handleMessage = () => {
      const currentTimestamp = new Date().toLocaleTimeString();
      setTimestamps((prev) => [...prev.slice(-9), currentTimestamp]); // Keep only the last 10 timestamps
      setMessageCounts((prev) => [...prev.slice(-9), (prev[prev.length - 1] || 0) + 1]); // Increment count
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Messages Over Time",
        data: messageCounts,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const }, // Use "top", "bottom", etc., from the allowed values
      title: { display: true, text: "Message Activity" },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Messages" }, beginAtZero: true },
    },
  };
  

  return (
    <div style={{ marginTop: "20px" }}>
      <h5>Message Statistics</h5>
      <Line data={data} options={options} />
    </div>
  );
};

export default MessageStats;
