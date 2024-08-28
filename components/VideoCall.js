import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
const VideoCall = ({ roomName, user }) => {
  return (
    <JitsiMeeting
      domain="meet.jit.si" // You can replace this with your custom Jitsi domain if needed
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
        // Attach custom event listeners to the Jitsi Meet External API here
        console.log('Jitsi Meet API is ready:', externalApi);
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = '600px'; // Customize the height as needed
        iframeRef.style.width = '100%';
      }}
    />
  );
};

export default VideoCall;
