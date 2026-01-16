import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ChainSelector.css';

const ChainSelector = () => {
  const location = useLocation();
  const currentChain = location.pathname.startsWith('/btc') ? 'btc' : 'eth';

  return (
    <div className="chain-selector-container">
      <div className="chain-toggle">
        <Link 
          to="/eth" 
          className={`chain-option ${currentChain === 'eth' ? 'active' : ''}`}
        >
          Ethereum
        </Link>
        <Link 
          to="/btc" 
          className={`chain-option ${currentChain === 'btc' ? 'active' : ''}`}
        >
          Bitcoin
        </Link>
        <div className={`slider ${currentChain}`} />
      </div>
    </div>
  );
};

export default ChainSelector;
