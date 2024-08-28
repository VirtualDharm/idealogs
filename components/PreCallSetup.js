import React, { useState, useEffect } from 'react';
const PreCallSetup = ({ onSetupComplete }) => {
  const [audioInput, setAudioInput] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [devices, setDevices] = useState({ audio: [], video: [] });

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const audioDevices = deviceInfos.filter((device) => device.kind === 'audioinput');
      const videoDevices = deviceInfos.filter((device) => device.kind === 'videoinput');
      setDevices({ audio: audioDevices, video: videoDevices });
    });
  }, []);

  const handleStartCall = () => {
    onSetupComplete({ audioInput, videoInput });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pre-Call Setup</h2>
      <div>
        <label>Audio Input:</label>
        <select value={audioInput} onChange={(e) => setAudioInput(e.target.value)}>
          {devices.audio.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Video Input:</label>
        <select value={videoInput} onChange={(e) => setVideoInput(e.target.value)}>
          {devices.video.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleStartCall} style={{ marginTop: '20px' }}>
        Start Call
      </button>
    </div>
  );
};

export default PreCallSetup;
