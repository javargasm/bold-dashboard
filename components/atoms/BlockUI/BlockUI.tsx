import React from 'react';
import './BlockUI.styles.css';


interface BlockUIProps {
  isVisible: boolean;
}

const BlockUI = ({ isVisible }: BlockUIProps) => {
  if (!isVisible) return null;

  return <div className="blockUI" aria-hidden="true" />;
};

export default BlockUI;
