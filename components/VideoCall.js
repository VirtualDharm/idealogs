import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const VideoCall = ({ roomName, user }) => {
  return (
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
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = '600px';
        iframeRef.style.width = '100%';
      }}
    />
  );
};

export default VideoCall;
