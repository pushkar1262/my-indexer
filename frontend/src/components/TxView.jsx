import React, { useState } from 'react';
import { FileText, Copy, Check, ArrowLeft } from 'lucide-react';
import { formatValue, copyToClipboard } from '../utils';
import { useNavigate, Link } from 'react-router-dom';
import Card from './Card';
import './DetailsView.css';

export function TxView({ tx }) {
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();

  if (!tx) return null;

  const handleCopy = (text, key) => {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="view-container fade-in">
      <Link to="/eth" className="back-link">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="view-header">
        <h1><FileText size={24} style={{ marginRight: '10px' }} /> Transaction Details</h1>
        <div className="hash-display">
          <span className="mono">{tx.hash}</span>
          <button className="icon-btn" onClick={() => handleCopy(tx.hash, 'hash')}>
            {copied === 'hash' ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="grid-2">
        <Card title="Overview" delay={0.1}>
          <div className="detail-row">
            <span className="label">Block Number</span>
            <span className="value highlight mono">{tx.block_number}</span>
          </div>
          <div className="detail-row">
            <span className="label">Value</span>
            <span className="value highlight bold">{formatValue(tx.value)}</span>
          </div>
          <div className="detail-row">
            <span className="label">Status</span>
            <span className="value highlight">Success</span>
          </div>
        </Card>

        <Card title="Addresses" delay={0.2}>
          <div className="detail-row">
            <span className="label">From</span>
            <div className="value-with-copy">
              <span className="value mono small">{tx.from_address.substring(0, 20)}...</span>
              <button className="icon-btn" onClick={() => handleCopy(tx.from_address, 'from')}>
                {copied === 'from' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <div className="detail-row">
            <span className="label">To</span>
            <div className="value-with-copy">
              <span className="value mono small">{tx.to_address ? tx.to_address.substring(0, 20) + '...' : 'Contract Creation'}</span>
              {tx.to_address && (
                <button className="icon-btn" onClick={() => handleCopy(tx.to_address, 'to')}>
                  {copied === 'to' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {tx.data && tx.data !== '0x' && (
        <Card title="Input Data" delay={0.3}>
          <div className="wrap mono">
            {tx.data}
          </div>
        </Card>
      )}
    </div>
  );
}
