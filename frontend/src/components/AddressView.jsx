import React, { useState } from 'react';
import { User, Activity, Copy, Check } from 'lucide-react';
import { formatValue, copyToClipboard } from '../utils';
import { useNavigate } from 'react-router-dom';
import './DetailsView.css';

export function AddressView({ address, balance, transactions, onSelectTx }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!address) return null;

  const handleCopy = () => {
    copyToClipboard(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="details-view">
      <div className="header-row">
        <h2><User size={24} /> Address</h2>
        <button className="back-btn" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
      <div className="card">
        <div className="row">
           <span className="label">Address:</span>
           <div className="value-with-copy">
             <span className="value mono">{address}</span>
             <button className="copy-btn" onClick={handleCopy}>
               {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
             </button>
           </div>
        </div>
        <div className="row">
           <span className="label">Balance:</span>
           <span className="value bold">{balance} ETH</span>
        </div>
      </div>
      
      <h3><Activity size={20} /> Recent Activity</h3>
      <div className="tx-list">
        {transactions && transactions.length > 0 ? (
          transactions.map(tx => (
            <div key={tx.hash} className="card mini-card clickable" onClick={() => onSelectTx(tx.hash)}>
              <div className="row">
                <span className="label">Tx:</span>
                <span className="value mono primary">{tx.hash.substring(0, 30)}...</span>
              </div>
              <div className="row">
                <span className="label">Block:</span>
                <span className="value">{tx.block_number}</span>
              </div>
              <div className="row">
                <span className="label">Type:</span>
                <span className="value">
                  {tx.from_address?.toLowerCase() === address?.toLowerCase() ? <span className="tag out">OUT</span> : <span className="tag in">IN</span>}
                </span>
              </div>
              <div className="row">
                <span className="label">Value:</span>
                <span className="value bold">{formatValue(tx.value)}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No transactions found for this address.</p>
        )}
      </div>
    </div>
  );
}
