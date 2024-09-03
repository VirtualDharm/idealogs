import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const GlobeComponent = ({ size, onClick, isHovering }) => {
  const globeEl = useRef();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (isClient && globeEl.current) {
      const globe = globeEl.current;
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 1;

      // Adjust camera distance to fit the globe within the size
      globe.camera().position.z = size * 1.67 ; // Fine-tuned camera distance

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      globeEl.current.scene().add(ambientLight);

      return () => {
        globe.controls().autoRotate = false;
      };
    }
  }, [isClient, size]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = !isHovering;
    }
  }, [isHovering]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="globe-container" onClick={onClick}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0, 0, 0, 0)"
        className="globe-canvas"
        width={size}
        height={size}
      />
    </div>
  );
};

export default GlobeComponent;
