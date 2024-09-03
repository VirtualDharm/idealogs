import React, { useEffect, useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const VideoCall = ({ roomName, user }) => {
  const [callStats, setCallStats] = useState({
    bitrate: 0,
    packetLoss: 0,
    jitter: 0,
    latency: 0,
  });

  // Store the API reference
  const [api, setApi] = useState(null);

  const logCallStats = (stats) => {
    console.log('Logging call stats:', stats); // Log stats before sending to backend
    fetch('/api/logCallStats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName, user, stats }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Stats logged successfully:', response.status); // Log response status
        } else {
          console.error('Failed to log stats:', response.status); // Log error if not successful
        }
      })
      .catch((error) => {
        console.error('Error logging stats:', error); // Log any network errors
      });
  };

  useEffect(() => {
    if (api) {
      const updateCallStats = (stats) => {
        console.log('Stats event received:', stats);
        const currentStats = {
          bitrate: Math.random() * 5000, // Simulate random bitrate
          packetLoss: Math.random() * 5, // Simulate random packet loss
          jitter: Math.random() * 50, // Simulate random jitter
          latency: Math.random() * 200, // Simulate random latency
        };
        console.log('Simulated call stats:', currentStats); // Log simulated stats
        setCallStats(currentStats);
        logCallStats(currentStats); // Send the processed stats to the backend
      };

      console.log('Setting up conference.statsUpdated listener with simulation');
      const intervalId = setInterval(() => updateCallStats({}), 1000);

      return () => {
        console.log('Removing simulated stats interval');
        clearInterval(intervalId);
      };
    }
  }, [api]);

  const handleOpenDashboard = () => {
    window.open('/admin/dashboard', '_blank');
  };

  return (
    <div>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: false,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: user.name,
        }}
        onApiReady={(externalApi) => {
          console.log('Jitsi Meet API is ready:', externalApi);
          setApi(externalApi); // Set the API reference
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '600px';
          iframeRef.style.width = '100%';
        }}
      />
      {/* Display call stats (for debugging or admin monitoring) */}
      <div>
        <p>Bitrate: {callStats.bitrate} kbps</p>
        <p>Packet Loss: {callStats.packetLoss} %</p>
        <p>Jitter: {callStats.jitter} ms</p>
        <p>Latency: {callStats.latency} ms</p>
      </div>
      {/* Button to open the dashboard in a new tab */}
      <button onClick={handleOpenDashboard} className="dashboard-button">
        Open Admin Dashboard
      </button>
    </div>
  );
};

export default VideoCall;
