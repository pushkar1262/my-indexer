import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils';
import { useNavigate } from 'react-router-dom';
import './DetailsView.css';

export function BtcTxView({ tx }) {
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();

  if (!tx) return null;

  const handleCopy = (text, key) => {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="details-view">
      <div className="header-row">
        <h2><FileText size={24} /> Bitcoin Transaction</h2>
        <button className="back-btn" onClick={() => navigate('/btc')}>Back to Dashboard</button>
      </div>
      <div className="card">
        <div className="row">
          <span className="label">Hash:</span>
          <div className="value-with-copy">
            <span className="value mono">{tx.tx_hash}</span>
            <button className="copy-btn" onClick={() => handleCopy(tx.tx_hash, 'hash')}>
              {copied === 'hash' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="row">
          <span className="label">Block Number:</span>
          <span className="value mono">{tx.block_number}</span>
        </div>
        <div className="row">
          <span className="label">Size:</span>
          <span className="value">{tx.size ? `${tx.size} bytes` : 'N/A'}</span>
        </div>
        {tx.weight && (
          <div className="row">
            <span className="label">Weight:</span>
            <span className="value">{tx.weight}</span>
          </div>
        )}
      </div>

      <h3>Inputs ({tx.vin?.length || 0})</h3>
      <div className="tx-list">
        {tx.vin && tx.vin.map((input, idx) => (
          <div key={idx} className="card mini-card">
            <div className="row column">
              <span className="label">Prev Tx:</span>
              <span className="value mono wrap">{input.txid || 'Coinbase'}</span>
            </div>
            {input.vout !== undefined && (
              <div className="row">
                <span className="label">Output Index:</span>
                <span className="value">{input.vout}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <h3>Outputs ({tx.vout?.length || 0})</h3>
      <div className="tx-list">
        {tx.vout && tx.vout.map((output, idx) => (
          <div key={idx} className="card mini-card">
            <div className="row">
              <span className="label">Index:</span>
              <span className="value">{output.n || idx}</span>
            </div>
            <div className="row">
              <span className="label">Value:</span>
              <span className="value bold">{output.value ? `${output.value} BTC` : 'N/A'}</span>
            </div>
            {output.scriptPubKey?.addresses && output.scriptPubKey.addresses.length > 0 && (
              <div className="row column">
                <span className="label">Addresses:</span>
                {output.scriptPubKey.addresses.map((addr, i) => (
                  <span key={i} className="value mono">{addr}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
