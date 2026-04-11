import React from 'react';

interface CloudLayerProps {
  src: string;
  position: 'left' | 'right' | 'bottom';
}

const CloudLayer: React.FC<CloudLayerProps> = ({ src, position }) => {
  return (
    <div className={`hero__cloud hero__cloud--${position}`}>
      <img src={src} alt="" aria-hidden="true" draggable={false} />
    </div>
  );
};

export default CloudLayer;
