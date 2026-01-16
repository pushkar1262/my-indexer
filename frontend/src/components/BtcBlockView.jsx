import React, { useState } from 'react';
import { Box, Clock, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils';
import { useNavigate } from 'react-router-dom';
import './DetailsView.css';

export function BtcBlockView({ block, onSelectTx }) {
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();

  if (!block) return null;

  const handleCopy = (text, key) => {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="details-view">
      <div className="header-row">
        <h2><Box size={24} /> Bitcoin Block #{block.block_number}</h2>
        <button className="back-btn" onClick={() => navigate('/btc')}>Back to Dashboard</button>
      </div>
      <div className="card">
        <div className="row">
          <span className="label">Hash:</span>
          <div className="value-with-copy">
            <span className="value mono">{block.block_hash}</span>
            <button className="copy-btn" onClick={() => handleCopy(block.block_hash, 'hash')}>
              {copied === 'hash' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="row">
          <span className="label">Parent Hash:</span>
          <div className="value-with-copy">
            <span className="value mono">{block.parent_hash}</span>
            <button className="copy-btn" onClick={() => handleCopy(block.parent_hash, 'parent')}>
              {copied === 'parent' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="row">
          <span className="label">Timestamp:</span>
          <span className="value"><Clock size={16} /> {new Date(block.timestamp * 1000).toLocaleString()}</span>
        </div>
        <div className="row">
          <span className="label">Size:</span>
          <span className="value">{block.size ? `${block.size} bytes` : 'N/A'}</span>
        </div>
      </div>

      <h3>Transactions ({block.transactions ? block.transactions.length : 0})</h3>
      <div className="tx-list">
        {block.transactions && block.transactions.map(tx => (
          <div key={tx.tx_hash} className="card mini-card clickable" onClick={() => onSelectTx(tx.tx_hash)}>
            <div className="row">
              <span className="label">Tx:</span>
              <span className="value mono primary">{tx.tx_hash.substring(0, 20)}...</span>
            </div>
            <div className="row">
              <span className="label">Inputs:</span>
              <span className="value">{tx.vin?.length || 0}</span>
            </div>
            <div className="row">
              <span className="label">Outputs:</span>
              <span className="value">{tx.vout?.length || 0}</span>
            </div>
            <div className="row">
              <span className="label">Size:</span>
              <span className="value">{tx.size ? `${tx.size} bytes` : 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
