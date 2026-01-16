import React, { useState } from 'react';
import { Box, Clock, Copy, Check, ArrowLeft } from 'lucide-react';
import { formatValue, copyToClipboard } from '../utils';
import { useNavigate, Link } from 'react-router-dom';
import Card from './Card';
import './DetailsView.css';

export function BlockView({ block, onSelectTx }) {
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();

  if (!block) return null;

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
        <h1><Box size={24} style={{ marginRight: '10px' }} /> Block #{block.number}</h1>
        <div className="hash-display">
          <span className="mono">{block.hash}</span>
          <button className="icon-btn" onClick={() => handleCopy(block.hash, 'hash')}>
            {copied === 'hash' ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="grid-2">
        <Card title="Details" delay={0.1}>
          <div className="detail-row">
            <span className="label">Parent Hash</span>
            <div className="value-with-copy">
              <span className="value mono small">{block.parent_hash.substring(0, 20)}...</span>
              <button className="icon-btn" onClick={() => handleCopy(block.parent_hash, 'parent')}>
                {copied === 'parent' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <div className="detail-row">
            <span className="label">Timestamp</span>
            <span className="value">
              <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {new Date(block.timestamp * 1000).toLocaleString()}
            </span>
          </div>
        </Card>

        <Card title="Statistics" delay={0.2}>
          <div className="detail-row">
            <span className="label">Transactions</span>
            <span className="value highlight bold">{block.transactions ? block.transactions.length : 0}</span>
          </div>
          <div className="detail-row">
            <span className="label">Status</span>
            <span className="value highlight">Confirmed</span>
          </div>
        </Card>
      </div>

      <h3 className="section-title">Transactions</h3>
      <div className="tx-list">
        {block.transactions && block.transactions.map((tx, idx) => (
          <Card key={tx.hash} delay={0.3 + (idx * 0.02)} className="mini-card clickable" onClick={() => onSelectTx(tx.hash)}>
            <div className="detail-row">
              <span className="label">Hash</span>
              <span className="value mono primary">{tx.hash.substring(0, 24)}...</span>
            </div>
            <div className="mini-grid" style={{ margin: '10px 0 0 0' }}>
              <div>
                <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                  From
                  <button className="icon-btn" style={{ padding: '2px' }} onClick={(e) => { e.stopPropagation(); handleCopy(tx.from_address, `from-${idx}`); }}>
                    {copied === `from-${idx}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </span>
                <span className="value mono small">{tx.from_address.substring(0, 15)}...</span>
              </div>
              <div>
                <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                  To
                  {tx.to_address && (
                    <button className="icon-btn" style={{ padding: '2px' }} onClick={(e) => { e.stopPropagation(); handleCopy(tx.to_address, `to-${idx}`); }}>
                      {copied === `to-${idx}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    </button>
                  )}
                </span>
                <span className="value mono small">{tx.to_address ? tx.to_address.substring(0, 15) + '...' : 'Contract'}</span>
              </div>
            </div>
            <div className="detail-row" style={{ marginTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '10px' }}>
              <span className="label">Value</span>
              <span className="value bold">{formatValue(tx.value)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
