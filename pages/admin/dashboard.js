import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        const response = await fetch('/api/getCallLogs');
        const data = await response.json();
        if (data.logs) {
          const logsWithTimestamp = data.logs.map(log => ({
            ...log,
            timestamp: new Date().toLocaleTimeString(), // Add a timestamp
          }));
          setCallLogs(logsWithTimestamp.reverse()); // Reverse to show latest first
          prepareChartData(logsWithTimestamp);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching call logs:', error);
        setLoading(false);
      }
    };

    fetchCallLogs();

    const intervalId = setInterval(fetchCallLogs, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const prepareChartData = (logs) => {
    if (!logs || logs.length === 0) {
      console.log('No logs to prepare chart data with');
      return;
    }

    const labels = logs.map(log => `${log.roomName} (${log.timestamp})`);
    const bitrateData = logs.map(log => log.stats.bitrate);
    const packetLossData = logs.map(log => log.stats.packetLoss);
    const jitterData = logs.map(log => log.stats.jitter);
    const latencyData = logs.map(log => log.stats.latency);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Bitrate (kbps)',
          data: bitrateData,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
        {
          label: 'Packet Loss (%)',
          data: packetLossData,
          borderColor: 'rgba(255,99,132,1)',
          fill: false,
        },
        {
          label: 'Jitter (ms)',
          data: jitterData,
          borderColor: 'rgba(54,162,235,1)',
          fill: false,
        },
        {
          label: 'Latency (ms)',
          data: latencyData,
          borderColor: 'rgba(153,102,255,1)',
          fill: false,
        },
      ],
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <h1>Admin Dashboard - Call Analytics</h1>
      <div className="chart-container">
        <Line data={chartData} />
      </div>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Room Name</th>
            <th>User</th>
            <th>Bitrate (kbps)</th>
            <th>Packet Loss (%)</th>
            <th>Jitter (ms)</th>
            <th>Latency (ms)</th>
          </tr>
        </thead>
        <tbody>
          {callLogs && callLogs.length > 0 ? (
            callLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.roomName}</td>
                <td>{log.user.name}</td>
                <td>{log.stats.bitrate}</td>
                <td>{log.stats.packetLoss}</td>
                <td>{log.stats.jitter}</td>
                <td>{log.stats.latency}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
