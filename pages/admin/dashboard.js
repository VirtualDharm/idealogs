import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const Dashboard = () => {
  const [callLogs, setCallLogs] = useState([]); // Initialize as an empty array
  const [chartData, setChartData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        console.log('Fetching call logs...');
        const response = await fetch('/api/getCallLogs');
        const data = await response.json();
        console.log('Fetched call logs:', data); // Log fetched data

        if (data.logs && data.logs.length > 0) {
          setCallLogs(data.logs);
          prepareChartData(data.logs);
        } else {
          console.log('No logs found'); // Log if logs are empty
          setChartData(null); // Set chartData to null if no logs
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
      console.log('No logs to prepare chart data with'); // Log if there are no logs
      return;
    }

    console.log('Preparing chart data from logs:', logs); // Log logs before processing
    const labels = logs.map(log => log.roomName);
    const bitrateData = logs.map(log => log.stats?.bitrate || 0); // Default to 0 if undefined
    const packetLossData = logs.map(log => log.stats?.packetLoss || 0); // Default to 0 if undefined
    const jitterData = logs.map(log => log.stats?.jitter || 0); // Default to 0 if undefined
    const latencyData = logs.map(log => log.stats?.latency || 0); // Default to 0 if undefined

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

    console.log('Chart data prepared:', chartData); // Log the chart data
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard - Call Analytics</h1>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <div>No data available to display the chart.</div>
      )}
      <table>
        <thead>
          <tr>
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
                <td>{log.roomName}</td>
                <td>{log.user?.name || 'Unknown User'}</td> {/* Handle potential null or undefined user */}
                <td>{log.stats?.bitrate || 0}</td> {/* Default to 0 if undefined */}
                <td>{log.stats?.packetLoss || 0}</td> {/* Default to 0 if undefined */}
                <td>{log.stats?.jitter || 0}</td> {/* Default to 0 if undefined */}
                <td>{log.stats?.latency || 0}</td> {/* Default to 0 if undefined */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
