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
          bitrate: stats.bitrate.download / 1000 || 0, // Convert to kbps and handle undefined
          packetLoss: stats.packetLoss.total || 0, // Handle undefined
          jitter: stats.jitter || 0, // Handle undefined
          latency: stats.e2eRtt || 0, // Handle undefined
        };
        console.log('Updated call stats:', currentStats); // Log stats after processing
        setCallStats(currentStats);
        logCallStats(currentStats); // Send the processed stats to the backend
      };
  
      console.log('Setting up conference.statsUpdated listener');
      api.on('conference.statsUpdated', updateCallStats);
  
      return () => {
        console.log('Removing conference.statsUpdated listener');
        api.off('conference.statsUpdated', updateCallStats);
      };
    }
  }, [api]);
  

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
    </div>
  );
};

export default VideoCall;
